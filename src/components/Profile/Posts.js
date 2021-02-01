import React , {useEffect, useState} from 'react'

// import logo from '../../images/story.jpg'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import firebase from '../../config/Firebase'
// import ava from '../../images/abdelali.jpg'

const Posts = ({blobs , auth:{uid}}) => {
    const [posts , setPosts] = useState([])
    useEffect(()=>{
        // const comments = firebase.
        firebase.firestore().collection('users').doc(uid).collection('buckets').orderBy('time' , 'desc')
         .onSnapshot(querySnapshot =>{
             setPosts(querySnapshot.docs.map(doc => ({id : doc.id , data : doc.data() })))
         })
    },[])
    return (
        <>
            <div className='album__container'>
             <div className='profile__album'>
                 <div className='profile__grid'>
                      
                         { 
                          posts && posts.map(blob =>{
                               return (
 
                             <div className="gallery-item" tabindex="0" key={blob.id}>

                                  <img src={blob.data.url} className="gallery-image" alt=""/>
                                    
                                  <div className="gallery-item-info">

                                            <ul>
                               <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><i className="fas fa-heart" aria-hidden="true"></i> {blob.data.likes}</li>
                                    <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><i className="fas fa-comment" aria-hidden="true"></i> {blob.data.comments}</li>
                                            </ul>

                                   </div>

                                </div>
                                   
                               )
                           })
                         }
                 </div>
             </div>
           
            </div>
        </>
    )
}

const mapStateToProps = (state)=>({
   auth : state.firebase.auth ,
   blobs : state.firestore.ordered.blobs
})
export default compose(
     connect(mapStateToProps),
     firestoreConnect([
         {collection :'blobs' , orderBy:['time' , 'desc']}
]))(Posts)
