import React ,{useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import {connect} from 'react-redux'
import RoomChat from './RoomChat'
import firebase from '../../config/Firebase'
import { firestore } from 'firebase';
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

const Message =({auth:{uid} , userid}) => {
  const classes = useStyles();
  const [currentUserRe , setCurrentUserRe] = useState([])
  const [currentUserSe , setCurrentUserSe] = useState([])

  useEffect(()=>{

         firebase.firestore().collection('rooms').where('receiverId' , '==' , `${uid}`).onSnapshot(querySnap=>{
            setCurrentUserRe(querySnap.docs.map(doc =>({id : doc.id , roomname : doc.data().senderfullName , senderid : doc.data().senderId})))
         })

         firebase.firestore().collection('rooms').where('senderId' , '==' , `${uid}`).onSnapshot(querySnap =>{
                setCurrentUserSe(querySnap.docs.map( doc =>({id : doc.id , roomname : doc.data().receiverfullName , receiverid : doc.data().receiverId})))
      
         })
  },[])
  return (
  
    <List className={classes.root}>
     {
       currentUserRe.map((room)=>{
         return  <RoomChat roomname={room.roomname} roomId={room.id} key={room.id} userid={room.senderid}/>
       })
     
     }
      {
          currentUserSe.map((room)=>{
            return  <RoomChat roomname={room.roomname} roomId={room.id} key={room.id} userid={room.receiverid}/>
          })
      }
    </List>
  
  );
}

const mapStateToProps =(state)=>({
  auth : state.firebase.auth
})
export default connect(mapStateToProps)(Message)