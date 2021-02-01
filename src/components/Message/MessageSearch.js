import React, { useEffect, useState } from 'react'
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
import IconButton from '@material-ui/core/IconButton'
import logo from '../../images/abdelali.jpg'
import firebase from '../../config/Firebase'
const useStyles = makeStyles((theme) => ({
    
    inline: {
      display: 'inline',
    },
  }));
  
const MessageSearch = ({firstName , lastName , photoUrl , uid , handleCloseSearch}) => {
  const [photourl , setPhotoUrl] = useState('')
  const [user , setUser] = useState({})
  //  useEffect(()=>{
  //       firebase.firestore().collection('users').doc(uid)
  //       .onSnapshot(snapshot =>{
  //          setPhotoUrl(snapshot.data().photourl)
  //       })
  //  },[])
   useEffect(()=>{
     firebase.firestore().collection('users').doc(uid)
     .onSnapshot(snapshot =>{
       setUser(snapshot.data())
     })
   },[uid])
    const classes = useStyles()
    return (
        <>
      
            <NavLink to={`/userprofile/${uid}`} onClick={handleCloseSearch}>
             <ListItem alignItems="flex-start">
            <ListItemAvatar>
            
                     { user ? (<Avatar src={user.photourl} alt=''/>):(<Avatar></Avatar>)}
                 
        </ListItemAvatar>
        <ListItemText
          primary={`${firstName} ${lastName}`}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
              </Typography>
              {user && `${user.username}`}
            </React.Fragment>
          }
        />
        {/* <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <Avatar src={logo} alt=''/>
                    </IconButton>
       </ListItemSecondaryAction> */}
      </ListItem>
      </NavLink>
      
            
        </>
    )
}

export default MessageSearch
