import React ,{useState , useEffect} from 'react'
import { ListItem , ListItemText , ListItemAvatar , ListItemSecondaryAction
    , IconButton , Avatar, Button} from '@material-ui/core'
import firebase from '../../config/Firebase'
const User = ({userid}) => {
    const [userinfo ,setUserinfo] = useState({})
    useEffect(()=>{
          firebase.firestore().collection('users')
          .doc(userid).onSnapshot((snapshot)=>{
             setUserinfo(snapshot.data())
          })
    },[userid])
    const handleUnblock = (userid)=>{
         const blockuser = firebase.functions().httpsCallable('blockuser') ;
         blockuser({uid : userid}).then(()=>{
             console.log('the user is unblocked')
         })
         .catch((err)=>{
             console.log(err)
         })
    }
    return (
        <>
            <ListItem>
                   <ListItemAvatar>
                      <Avatar src={userinfo.photourl} alt=''/>
                   </ListItemAvatar>
                   <ListItemText
                     primary={`${userinfo.firstName} ${userinfo.lastName}`}
                     secondary ={`${userinfo.username}`}
                   />
                   <ListItemSecondaryAction>
                          <IconButton onClick={()=>handleUnblock(userid)} >
                              <Button variant='outlined' color='default'>
                                  unblock
                              </Button>
                          </IconButton>
                   </ListItemSecondaryAction>
               </ListItem>
        </>
    )
}

export default User
