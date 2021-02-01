// import React from 'react'
import Toast from 'light-toast'
import firebase from '../config/Firebase'

export const handleUpload = (firstName , lastName , uid , photourl) => e =>{
        //    console.log(firstName , lastName , uid , e)
        var userbuckets = {
            url :'' ,
            time : firebase.firestore.FieldValue.serverTimestamp() , 
            firstName : firstName,
            lastName : lastName,
            // initials : firstName[0].toUpperCase()+lastName[0].toUpperCase() ,
            likes : 0 ,
            likedbyId : [] ,
            savedby : [] ,
            comments : 0 ,
            photourl : photourl
        }
        var blobs = {
            url :'' ,
            time : firebase.firestore.FieldValue.serverTimestamp() , 
            firstName : firstName ,
            lastName : lastName,
            likes : 0 ,
            // initials : firstName[0].toUpperCase()+lastName[0].toUpperCase() ,
            savedbyId : [] ,
            likedbyId : [] ,
            uploadedby : uid ,
            photourl : photourl
        }
        var file = e.target.files[0]
        var storageRef = firebase.storage().ref(file.name)
        var uploadTask = storageRef.put(file)
        var photo = document.querySelector('progress') ;
        uploadTask.on('state_changed' ,(snapshot)=>{
         
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                 // insert the value in the progress bar value
                if(photo){
                    photo.style.display = 'block'  ;
                    photo.value = Math.floor(progress)  ;
                }
                  switch(snapshot.state){
                      case firebase.storage.TaskState.PAUSED :
                          console.log('Upload is paused') ;
                          break ;
                      case firebase.storage.TaskState.RUNNING :
                          console.log('Upload is running') ;
                          break ;
                      default :
                         break ;
                  }
        }  ,
         // function handling errors
        (error)=>{

        },
        // Handle successful uploads on Complete
        ()=>{
                uploadTask.snapshot.ref.getDownloadURL()
                .then((downloadUrl)=>{
                    //  console.log('File available at '+ downloadUrl)  
                     userbuckets = {...userbuckets , url : downloadUrl} 
                     blobs= {...blobs, url : downloadUrl}
                     firebase.firestore().collection('blobs')
                     .add(blobs).then( docRef =>{
                         return firebase.firestore().collection('users')
                         .doc(uid).collection('buckets').doc(docRef.id).set(userbuckets)
                     }).then(()=>{
                         return {
                             message :'the buckets added succefully'
                         }
                     }).catch(err =>{
                         console.log(err)
                     })
                })
                Toast.success('your Photo uploaded Succefully' , 2000, ()=>{
                    if(photo){
                        photo.style.display = 'none' ;
                    }
                }) }   )}
    
  


