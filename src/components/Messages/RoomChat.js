import React ,{useEffect , useState} from 'react'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
//import styled from 'styled-components'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import IconButton from '@material-ui/core/IconButton'
import {makeStyles} from '@material-ui/core/styles'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import firebase from '../../config/Firebase'
import moment from 'moment'


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      padding : 0 ,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }));

const RoomChat = ({auth:{uid} , roomname , roomId , userid}) => {
    const classes = useStyles()
    const [photourl , setPhotourl] = useState('')
    const [roomupdate , setRoomupdate] = useState({})
    const [lastmessage , setLastmessage] = useState('')
    const [roomtime , setRoomtime] = useState('')
    useEffect(()=>{
            firebase.firestore().collection('users').doc(userid)
            .onSnapshot((snapshot)=>{
              setPhotourl(snapshot.data()?.photourl)
            })
    },[])

    useEffect(()=>{
        firebase.firestore().collection('rooms').doc(roomId)
        .collection('messages').orderBy('time' , 'asc').onSnapshot((querySnapshot)=>{
               querySnapshot.docChanges().forEach((change)=>{

                if(change.type == 'added'){
                   setLastmessage(change.doc.data().message)
                   firebase.firestore().collection('rooms').doc(roomId)
                   .update({
                     time : change.doc.data().time
                   })
                  //  setTime(change.doc.data().time ? change.doc.data().time : null )
                   
                }
               })
        })
    },[])
    useEffect(()=>{
      firebase.firestore().collection('rooms').doc(roomId)
      .onSnapshot((snapshot)=>{
              setRoomtime(snapshot.data().time)
      })
    },[])

   
    return (
        <>
    <NavLink to={`/messages?roomId=${roomId}&roomname=${roomname}&userId=${userid}`}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
         {photourl ? (<Avatar src={photourl} alt=''/>):( <Avatar>
            {roomname && roomname[0].toUpperCase()}
          </Avatar>)}
        </ListItemAvatar>
        <ListItemText
         primary={`${roomname}`}
        //  secondary={`${lastmessage}`}
        secondary={
          <>
                 <p style={{textOverflow:'ellipsis' , overflow:'hidden' ,whiteSpace:'nowrap'}}>
                   {lastmessage}
                </p>
          </>
        }
        />
        
      
       <ListItemSecondaryAction>
                  
                    {roomtime && moment(roomtime.toDate()).fromNow()}
       </ListItemSecondaryAction>
    
      </ListItem>
      </NavLink>
      <Divider variant="inset" component="li" />
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth
})
export default connect(mapStateToProps)(RoomChat)
