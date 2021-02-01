import React ,{useState , useEffect} from 'react'
import './Profile.css'
// import ava from '../../images/abdelali.jpg'
import Header from './Header'
import Stories from './Stories'
import Footer from './Footer'
import TabsInsta from './TabsInsta'
import {useParams , Redirect , useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import firebase from '../../config/Firebase'
const UserProfile= ({auth:{uid}}) => {
   
    const {id} = useParams()
    const [User , setUser] = useState({})
    const [ history , setHistory ] = useState(false) 
    
    useEffect(()=>{
            firebase.firestore().collection('users').doc(id).get().then(doc =>{
         if(doc.exists){
             setUser(doc.data())
           
         }
    })
    },[id])
    useEffect(()=>{
        firebase.firestore().collection('users').doc(uid)
        .onSnapshot((snapshot)=>{
            setHistory(snapshot.data().blockedusers.includes(id)) 
        })
   },[id])
    if (id == uid) return <Redirect to='/profile'/>
    if(history) return <Redirect to='/profile'/>
    return (
        <>
        <div className='profile__insta'>
           <Header firstName={User?.firstName} lastName={User?.lastName } userid={id} />
           {/* Stories */}
           <Stories userid={id}/>
           {/* Profile Album */}
           <TabsInsta userid={id}/>
           {/* Footer */}
           <Footer/>
        </div>
      
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth 
})
export default connect(mapStateToProps)(UserProfile)
