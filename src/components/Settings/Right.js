import React, {useEffect , useState} from 'react'
import {useRouteMatch , Switch , Route} from 'react-router-dom'
import {connect} from 'react-redux'
import Blocked from './Blocked'
import firebase from '../../config/Firebase'
const Right = ({auth:{uid}}) => {
    const {url , path} = useRouteMatch()
    const [blockedusers , setBlockedUsers ] = useState([]) 
    useEffect(()=>{
       firebase.firestore().collection('users')
       .doc(uid).onSnapshot((snapshot)=>{
           setBlockedUsers(snapshot.data().blockedusers)
       })
    },[])
    return (
        <>
           <Switch>
               <Route exact path={`${path}/blockedusers`} render={()=>(
                   <Blocked blockedusers={blockedusers}/>
               )}/>
           </Switch>
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth
})
export default connect(mapStateToProps)(Right)
