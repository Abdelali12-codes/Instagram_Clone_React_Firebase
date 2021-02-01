import React , {useEffect , useState} from 'react'
import firebase from '../../config/Firebase'
import {connect} from 'react-redux'
import queryString from 'query-string'
import {useLocation, Redirect} from 'react-router-dom'
import styled from 'styled-components'
import ProfileCard from './ProfileCard'

const Wrapper = styled.div`
     position : relative ;
     margin-top : 10vh ;
     width : 100% ;
     height : 800px ;
     display : grid ;
     grid-template-columns : 4fr ;
     place-items : center ;
    
`;
const Child = styled.div`
     
     background : blue ;
     
     overflow : hidden ;
     
     
`;
const Comment = ({profile , auth:{uid}}) => {
    const location = useLocation()
    const {id , userid} = queryString.parse(location.search)
    const [blob , setBlob] = useState({})
    const [comment , setComment ] = useState([])
    const [Idlikes , setIdlikes] = useState([])
    let Items = [] ;
    useEffect(()=>{
        imaUrl(id) ;
        imageComments(id) ;
      
    }, [id])
    useEffect(()=>{
        firebase.firestore().collection('blobs')
        .doc(id).onSnapshot((snapshot)=>{
            setIdlikes(snapshot.data()?.likedbyId)
        })
    },[])

    const handleLikepost = (id , userid)=>{
           const addLikes = firebase.functions().httpsCallable('addLikes') 
           addLikes({id : id , uid : userid}).then(()=>{
              return {
                  message :'the lik done'
              }
           }).catch((err)=>{
               console.log(err)
           })
    }
    if(!uid) return <Redirect to='/login'/>
    const imaUrl = async(id)=>{
        const image = await firebase.firestore().collection('blobs').doc(id).get() ;
      //  console.log(image.data())
        setBlob(image.data())
    }
    const imageComments = async (id)=>{
        const comment = await firebase.firestore().collection('blobs').doc(id).collection('comments').orderBy('time','asc')
        .get() ;
        comment && comment.forEach(doc =>{
        //   console.log(doc.data())
            Items = [...Items , doc.data()]
        })
        setComment(Items)
    }
   
    return (
        <>
        <Wrapper>
          <Child>
            {/* {
                console.log(profile.initials)
            } */}
            <ProfileCard userid={userid} 
            initials={blob.initials} url={blob.url} 
            time={blob.time} profile={profile} 
            comment={comment} postid={id} Idlikes={Idlikes} handleLikepost={handleLikepost}/>
            </Child>
            
        </Wrapper>
        </>
    )
}

const mapStateToProps = (state )=>({
    profile : state.firebase.profile ,
    auth : state.firebase.auth
})

export default connect(mapStateToProps)(Comment)
