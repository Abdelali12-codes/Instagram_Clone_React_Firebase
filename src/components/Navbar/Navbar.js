import React , {useState , useRef , useEffect} from 'react'
import './Navbar.css'
import clsx from 'clsx'
import logo from '../../images/instagram.png'
import avat from '../../images/abdelali.jpg'
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import IconButton from '@material-ui/core/IconButton'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Avatar from '@material-ui/core/Avatar'
import {makeStyles} from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import {NavLink} from 'react-router-dom'
import {handleUpload} from '../Upload'
import {connect} from 'react-redux'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import List from '@material-ui/core/List';
import {Message , MessageSearch} from '../../components/Message'
import ToolTip from '@material-ui/core/Tooltip'
import firebase from '../../config/Firebase'
import * as actions from '../../store/actions/actionTypes'
const useStyles = makeStyles((theme)=>({
  root: {
    width: '100%',
    height : '100px' ,
    padding : 0 ,
    backgroundColor: theme.palette.background.paper,
  },
          avatar:{
              width :'20px' ,
              height :'20px'
          } , 
          send :{
             transform :'rotate(-35deg) translateY(-3px) scale(1.1)',
             padding :'0'
          } ,
          icons:{
            transform :'scale(1.1)'
          }, 
          icon:{
            position :'relative' ,
            transform :'scale(1.1)',
           
            '&::after':{
              position :'absolute' ,
              background : theme.palette.secondary.main ,
              content :'""' ,
              width :'5px' ,
              height :'5px' ,
              top :'70%' ,
              left : '50%' ,
              transform :'translateX(-50%)' ,
               borderRadius :'100%' ,
            }
          },
          notif:{
               position :'relative' ,
               width:'400px' ,
               height : '400px' ,
               overflowX:'hidden' ,
               borderRadius :'4px' ,
               zIndex :'10px',
               border :'1px solid grey' ,
               overflowY :'auto' ,
               '&::before':{
                 content :'""',
                 position :'absolute' ,
                 background :'red' ,
                 width :'100%' , 
                 height :'10px' ,
                 zIndex :'9' ,
                 right :'17%' ,
                 bottom :'100%'
                 
                 
               }
          },
          notifsearch:{
            position :'relative' ,
            width:'400px' ,
            height : '300px' ,
            overflowX:'hidden' ,
            borderRadius :'4px' ,
            zIndex :'10px',
            border :'1px solid grey' ,
            overflowY :'auto' ,
            '&::before':{
              content :'""',
              position :'absolute' ,
              background :'red' ,
              width :'100%' , 
              height :'10px' ,
              zIndex :'9' ,
              right :'17%' ,
              bottom :'100%'
              
              
            }
       }
}))
const Navbar = ({dispatch ,profile:{firstName , lastName , photourl } , auth:{uid} , url , messagenotification}) => {
    const classes = useStyles()
    const [open , setOpen] = useState(false)
    const [open1 , setOpen1] = useState(false)
    const [username , setUsername] =useState('')
    const [users , setUsers] = useState([])
    const anchorRef = useRef(null) ;
    const anchorRef1 = useRef(null) ;
    // const [photourl , setPhotourl] = useState("")
    const [selectedIndex , setSelectedIndex] =useState(0)
    const [favori , setFavori] = useState(false)
    const [home , setHome] = useState(true)
    const [notif , setNotif] = useState([])
    const [blockedusers , setBlockedusers] = useState([])
    const handleListItemClick = (event)=>{
           
           setOpen(false)
    }
    const handleToggle = (e)=>{
      if(e.key === 'Enter' && username){
         setOpen(prevOpen => !prevOpen)
      }
     
     
    }
    const handleToggle1 =()=>{
        setOpen1(prevOpen =>!prevOpen)
        dispatch({type : actions.HIDE_NOTIFICATIONS})
        // setFavori(false)
    }
    const handleClose = (event)=>{
      if(anchorRef1.current && anchorRef1.current.contains(event.target)){
        return
    }
    setOpen(false)
    }
    const handleClose1 = (event)=>{
        if(anchorRef1.current && anchorRef1.current.contains(event.target)){
            return
        }
        setOpen1(false)
    }
    const handleClickHome = ()=>{
      setHome(false)
    }
    const handleChange = (e)=>{
        const {value} = e.target ;
        setUsername(value.toLowerCase())
        console.log(username)
    }
    const handleSubmit = (e)=>{
        e.preventDefault() ;
        const username = e.target.search.value ;
        // username = username
        searchUser(username) ;
        console.log(e.target.search.value)
        e.target.search.value = ''
        setUsername('')
    }
    const searchUser =(username)=>{
      if(username.length > 0){
        firebase.firestore().collection('users').where('firstNamesearch','==' , `${username}`)
        .onSnapshot(querySnapshot =>{
          setUsers(querySnapshot.docs.map(doc =>({id : doc.id , data : doc.data()})))
        })
      }
        
    }
   
    useEffect(()=>{
      firebase.firestore().collection('users').doc(uid)
      .collection('notifications').orderBy('time', 'desc').onSnapshot(querySnapshot =>{
        setNotif(querySnapshot.docs.map(doc =>({id : doc.id , data : doc.data()})))
      })
    },[])

    useEffect(()=>{
          firebase.firestore().collection('users').doc(uid)
          .collection('notifications').onSnapshot(querySnapshot=>{
            querySnapshot.docChanges().forEach(change =>{
              if(change.type == 'added'){
              
              }
            })
          })
    },[])
    useEffect(()=>{
             firebase.firestore().collection('users').doc(uid)
             .onSnapshot((snapshot)=>{
               setBlockedusers(snapshot.data()?.blockedusers)
             })
    },[])
    const handleCloseNotif =()=>{
       setOpen1(false)
    }
    const handleCloseSearch =()=>{
      setOpen(false)
    }
    return (
        <div className='header'>
            <div className='header__left'>
            <input accept='image/*' type='file' id='files' onChange={handleUpload(firstName , lastName , uid , photourl)}/>
            <label htmlFor='files'>
            <ToolTip title='Add Picture' arrow>
              <IconButton component='span'>
                  <CameraAltOutlinedIcon/>
              </IconButton>
            </ToolTip>
            </label>
              <img src={logo} alt='' className='header__image'/>
            </div>
            {/* input search */}
            <div className='header__center'>
              <form onSubmit={handleSubmit}>
                <input className='navbar__input' name='search' type='text' placeholder='search by firstName...' value={username}
                onChange={handleChange}
                 style={{textAlign:'center'  }} onKeyPress={handleToggle} ref={anchorRef}
                />
                <Popper open={open} anchorEl={anchorRef.current}
                        role={undefined} transition disablePortal
                       >
                           {({TransitionProps , placement}) =>(
                               <Grow
                               {...TransitionProps}
                               style={{
                                   transformOrigin : placement === 'bottom' ? 'right top ' : 'center bottom'
                               }}
                               >
                                <Paper className={classes.notifsearch}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                     
                                    <List className={classes.root}>
                                        {
                                          users && users.filter(user =>!blockedusers.includes(user.id)).map((user)=>{
                                             return <MessageSearch firstName={user.data.firstName}
                                              lastName={user.data.lastName} uid={user.id}
                                                handleCloseSearch={handleCloseSearch}
                                             />
                                          })
                                        }
                                      </List>
                                    </ClickAwayListener>
                                </Paper>
                               </Grow>
                           )}
                       </Popper>
              </form>
            </div>
            <div className='header__right'>
            <NavLink to='/'>
            <ToolTip title='Home page' arrow>
              <IconButton className={clsx(classes.icons , {
                [classes.icon]:false
              })} onClick={handleClickHome}>
                  <HomeOutlinedIcon/>
              </IconButton>
            </ToolTip>
            </NavLink>
            <NavLink to='/messages'>
              {!uid ? ( <Badge badgeContent={5} color='secondary'>
                <IconButton className={classes.send} >
                   <SendOutlinedIcon/>
                </IconButton>
                </Badge>):(<IconButton className={classes.send} >
                   <SendOutlinedIcon/>
                </IconButton>)}
            </NavLink>
            <NavLink to='/'>
              <IconButton className={classes.icons}>
                    <ExploreOutlinedIcon/>
              </IconButton>
            </NavLink>
            <ToolTip title='Notifications' arrow>
              <IconButton className={clsx(classes.icons , {
                [classes.icon]:messagenotification
              })} ref={anchorRef1} onClick={handleToggle1}>
                      <FavoriteBorderOutlinedIcon/>
              </IconButton>
            </ToolTip>
              <Popper open={open1} anchorEl={anchorRef1.current}
                        role={undefined} transition disablePortal
                       >
                           {({TransitionProps , placement}) =>(
                               <Grow
                               {...TransitionProps}
                               style={{
                                   transformOrigin : placement === 'bottom' ? 'right top ' : 'center bottom'
                               }}
                               >
                                <Paper className={classes.notif}>
                                    <ClickAwayListener onClickAway={handleClose1}>
                                     
                                    <List className={classes.root}>
                                        {
                                        notif && notif.map((message)=>{
                                            return <Message key={message.id} notif={message.data}
                                            handleCloseNotif={handleCloseNotif}/>
                                          })
                                        }
                                      </List>
                                    </ClickAwayListener>
                                </Paper>
                               </Grow>
                           )}
                       </Popper>
            
            <NavLink to='/profile'>
             { 
              photourl? <Avatar src={photourl} alt='' className={classes.avatar}/> :
              
             (
               <Avatar>
                 {firstName && `${firstName[0].toUpperCase()}`}
               </Avatar>
             )
             }
            </NavLink>
            </div>
        </div>
    )
}

const mapStateToProps =(state)=>({
  profile : state.firebase.profile ,
  auth : state.firebase.auth ,
  url : state.auth.photoUrl ,
  messagenotification : state.auth.messagenotification

})
export default connect(mapStateToProps)(Navbar)
