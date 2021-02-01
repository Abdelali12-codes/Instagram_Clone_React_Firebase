import React , {useEffect, useState} from 'react'

// import logo from '../../images/story.jpg'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import firebase from '../../config/Firebase'
// import ava from '../../images/abdelali.jpg'
import './style.css'
const Posts = ({auth:{uid}}) => {
    const [posts , setPosts] = useState([])
    var Items =[]
    useEffect(()=>{
         firebase.firestore().collection('users').doc(uid)
         .collection('posts').doc(uid).onSnapshot(snapshot =>{
            if(snapshot.exists){
                  setPosts(snapshot.data().urls)
            }
           
         })
    },[])
    
    return (
        <>
            <div className='album__container'>
             <div className='profile__album'>
                 <div className='profile__grid'>
                      
                         { 
                         posts && posts.length > 0 && posts.map(url =>{
                               return (
   
    <div className="gallery-item" tabindex="0">
     {
         console.log(url)
     }
    <img src={url} className="gallery-image" alt=""/>

    <div className="gallery-item-info">

      <ul>
        <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span><i className="fas fa-heart" aria-hidden="true"></i> 66</li>
        <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><i className="fas fa-comment" aria-hidden="true"></i> 2</li>
      </ul>

    </div>

  </div>
                                   
                               )
                           })
                         }
                 </div>
             </div>
             {
                 console.log(posts)
             }
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
