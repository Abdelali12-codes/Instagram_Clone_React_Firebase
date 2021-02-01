import React,{useState , useEffect} from 'react'
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles'
//import styled from 'styled-components'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import PhotoCamera from '@material-ui/icons/PhotoCamera'
import {NavLink} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import firebase from '../../config/Firebase'
import moment from 'moment'
// import IconButton from '@material-ui/core/IconButton'
// import logo from '../../images/abdelali.jpg'
const useStyles = makeStyles((theme) => ({
    
    inline: {
      display: 'inline',
    },
  }));
  
const Message = ({firstName , lastName , notif , uid ,handleCloseNotif}) => {
    const classes = useStyles()
    const [user , setUser] = useState({})
    const [photourl , setPhotourl] = useState('')
    useEffect(()=>{
       firebase.firestore().collection('users').doc(notif.userId)
       .onSnapshot(snapshot =>{
           setUser(snapshot.data())
       })
    },[])
    useEffect(()=>{
          firebase.firestore().collection('users').doc(notif.userId)
          .onSnapshot((snapshot)=>{
            setPhotourl(snapshot.data()?.photourl)
          })
    },[])
    return (
        <>
      
        <NavLink to={`/userprofile/${notif?.userId}`} onClick={handleCloseNotif}>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                      {notif ? <Avatar src={photourl} alt=''/> : null}
           </ListItemAvatar>
        <ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          secondary={
            <>
              <p style={{textOverflow:'ellipsis' , overflow:'hidden' ,whiteSpace:'nowrap'}}>
              {notif?.type}
                </p>
              
            </>
          }
        />
        <ListItemSecondaryAction>
                   <span>{moment(notif?.time.toDate()).fromNow()}</span>
       </ListItemSecondaryAction>
      </ListItem>
      </NavLink>
      
            
        </>
    )
}

export default Message
