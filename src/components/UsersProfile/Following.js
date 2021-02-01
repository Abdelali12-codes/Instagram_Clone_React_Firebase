import React , {useEffect , useState} from 'react'
import {ListItem , ListItemAvatar , ListItemText , Avatar} from '@material-ui/core'
import firebase from '../../config/Firebase'
import {NavLink} from 'react-router-dom'
const Following = ({userid , handleFollowingClose}) => {
    const [user , setUser] = useState({})
    useEffect(()=>{
         firebase.firestore().collection('users')
         .doc(userid).onSnapshot((snapshot)=>{
             setUser(snapshot.data())
         })
    },[userid])
    return (
        <>
        <NavLink to={`/userprofile/${userid}`} onClick={handleFollowingClose}>
          <ListItem>
              <ListItemAvatar>
                   {user && <Avatar src={user?.photourl} alt=''/>}
              </ListItemAvatar>
              <ListItemText
               primary={`${user?.firstName} ${user?.lastName}`}
               secondary={`${user?.username}`}
              />

         </ListItem>  
        </NavLink>
        </>
    )
}

export default Following
