import React from 'react'
import './Body.css'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import Post from '../Posts/Post'
const Body = ({profile:{firstName ,lastName , initials}  , auth:{uid} ,blobs}) => {
   if (!uid) return <Redirect to='/login'/>
    return (
        <>
          
           <div className='body__posts'>
               <div className='body__cards'>
                  {
                       blobs && blobs.map((blob)=>{
                            return  <Post logo={blob.url} initials={blob.initials} firstName={blob.firstName} lastName={blob.lastName}
                        time={blob.time} key={blob.id} likes={blob.likes} token={blob.id} Idlikes={blob.likedbyId} Idsaves={blob.savedbyId} 
                        uploadedby={blob.uploadedby} photourl={blob.photourl}/>
                        })
                  }
               </div>
           </div>
            
        </>
    )
}

const mapStateToProps =(state )=>({
    blobs : state.firestore.ordered.blobs ,
    profile : state.firebase.profile ,
    auth : state.firebase.auth
})
export default compose(connect(mapStateToProps) ,
firestoreConnect([
    {collection :'blobs' , orderBy:['time' , 'desc']}
]))(Body)
