import React , {useState , useEffect} from 'react'
import {ListItem , ListItemText , ListItemAvatar , Avatar} from '@material-ui/core'
import firebase from '../../config/Firebase'
import {NavLink} from 'react-router-dom'

const UserComment = ({userid , text}) => {
    const [user , setUser] = useState({})
    useEffect(()=>{
      firebase.firestore().collection('users')
      .doc(userid).onSnapshot((snapshot)=>{
          setUser(snapshot.data())
      })
    },[userid])
    return (
        <>
        <ListItem>
            <ListItemAvatar>
               {user && <Avatar src={user?.photourl} alt=''/>}
            </ListItemAvatar>
            <NavLink to={`/userprofile/${userid}`}>
            <ListItemText
              primary={`${user?.firstName} ${user.lastName}`}
              secondary={text}
            />
            </NavLink>
        </ListItem>
          
        </>
    )
}

export default UserComment
