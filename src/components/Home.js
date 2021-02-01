import React ,{useEffect , useState} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {Header} from './Stories'
import Body from './Body/Body'
import firebase from '../config/Firebase'
import {ProfileLogin} from './ProfileLogin'
// import InstaTab from './InstaTab'
const Home = ({auth:{uid} }) => {
  
    
    if (!uid) return <Redirect to='/login'/>

    return (
        <> 
        <div style={{marginTop:'14vh'}}>
            <Header/>
            <div style={{padding:'0px 5px'}}>
               <progress  max={100} style={{width:"100%" , display:'none'}}/>
            
            </div>
            {/* <InstaTab/> */}
            <Body/>
        </div>
        </>
    )
}

const mapStateToPros = (state)=>({
    auth : state.firebase.auth ,
    profile : state.firebase.profile
})
export default connect(mapStateToPros)(Home)
