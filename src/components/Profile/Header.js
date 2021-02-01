import React , {useState , useRef , useEffect}  from 'react'
import ava from '../../images/abdelali.jpg'
import IconButton from "@material-ui/core/IconButton"
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Button from '@material-ui/core/Button'
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import {List} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditProfile from './EditProfile'
import firebase from '../../config/Firebase'
import * as actions from '../../store/actions/authActions'
import {useHistory} from 'react-router-dom'
import Followers from './Followers'
import Following from './Following'
// const options =['Create a merge commit' , 'Squash and merge' , 'Rebase and merge']
const settings =['Settings' , 'Sign out']


const useStyles = makeStyles(()=>({
     backdrop :{
         zIndex : 11 
     },
     following :{
        position:'relative' , 
        width : '350px' , 
        height : '280px' ,
        overflowX : 'hidden' ,
        zIndex : '40px' ,
        overflowY : 'auto'
 },
 followers:{
  position:'relative' , 
  width : '350px' , 
  height : '280px' ,
  zIndex : '40px' ,
  overflowX : 'hidden' ,
  overflowY : 'auto'
 },
 list:{
   width : '100%'
 }
}))
const Header = ({auth:{uid} , signout , profile:{firstName , lastName} , loading , uploaded}) => {
    const classes = useStyles()
    const [open1 , setOpen1] = useState(false)
    const anchorRef1 = useRef(null)
    const [selectedIndex , setSelectedIndex] =useState(0)
    const [user , setUser] = useState({})
    const [posts , setPosts] = useState(0) ;
    const [photourl , setPhotourl ] = useState("")
    const [open , setOpen ] = useState(false)
    const [bio , setBio] = useState([])
    const [userinfo , SetUserinfo] = useState({})
    const [backdrop , setBackdrop ] = useState(false)
    const history = useHistory()
    const [fopen , setFopen] = useState(false)
    const [fopen1 , setFopen1] = useState(false)
    const followingRef = useRef(null) ;
    const followersRef = useRef(null) ;
    const [followings , setFollowings] = useState([])
    const [followers , setFollowers] = useState([])
    const fhandleToggle =()=>{
        setFopen(prev =>!prev)
      }
    const fhandleToggle1 = ()=>{
        setFopen1(prev =>!prev)
    }

    useEffect(()=>{
       uid && firebase.firestore().collection('users')
        .doc(uid).onSnapshot((snapshot)=>{
          setFollowings(snapshot.data().following)
          setFollowers(snapshot.data().followers)
        })
 },[uid])
    useEffect(()=>{
        uid && firebase.firestore().collection('users').doc(uid)
        .onSnapshot((user =>{
               setPhotourl(user.data().photourl)
        }))
    })
    useEffect(() => {
      uid &&  firebase.firestore().collection('blobs').where('uploadedby','==' ,`${uid}`)
        .get().then(query =>{
            setPosts(query.docs.length)
        })
          
    }, [])

    useEffect(()=>{
         uid &&  firebase.firestore().collection('users').doc(uid)
           .onSnapshot(snapshot =>{
               setUser(snapshot.data())
           })
    },[])
    useEffect(()=>{
       uid && firebase.firestore().collection('users').doc(uid)
        .onSnapshot((user)=>{
            setBio(user.data().bio)
        })
     },[])
     useEffect(()=>{
            uid && firebase.firestore().collection('users')
             .doc(uid).onSnapshot(snapshot =>{
                 SetUserinfo(snapshot.data())
             })
     },[])
    const handleMenuItemClick = async (event , index)=>{
           setSelectedIndex(index) ;
           if(settings[index] === 'Settings'){
               history.push('/settings')
           }
           if(settings[index] === 'Sign out'){
             await signout()
           }
    }
    const handleToggle1 =()=>{
        setOpen1(prevOpen =>!prevOpen)
    }
    const handleClose1 = (event)=>{
        if(anchorRef1.current && anchorRef1.current.contains(event.target)){
            return
        }
        setOpen1(false)
        setFopen(false)
        setFopen1(false)
    }
    const handleClickopen =()=>{
              setOpen(prevOpen => !prevOpen)
    }
    const handleClose = () =>{
        setOpen(false)
    }
    const handleClickopensave =()=>{
        setOpen(false)
        setBackdrop(true)
    } 
   
    if(loading){
       
        setBackdrop(false)
        uploaded()
    }
    if(!uid) return <Redirect to='/login'/>
    return (
        <>
            <div className='profile__header'>
               {/* Avatar Profile */}
                <div className='profile__avatar'>
                  <div className='avatar__bord'>
                       <div className='avatar__customs'>
                          { photourl ? (<img src={photourl} alt='' width='100%'height='100%'/>) :(
                            null
                          ) }
                        </div>
                  </div>
                   
                </div>
                {/* Profile Items */}
                <div className='profile__items'>
                   <div className='profile__items__header'>
                       <h1> { firstName && `${firstName} ${lastName}`}</h1>
                       <Button  variant='outlined' onClick={handleClickopen} >Edit Profile</Button>
                     {/* Popper for the MoreHorizIcon */}
                       <IconButton ref={anchorRef1} onClick={handleToggle1}>
                           <MoreHorizIcon/>
                       </IconButton>
                       <Popper open={open1} anchorEl={anchorRef1.current}
                        role={undefined} transition disablePortal
                       >
                           {({TransitionProps , placement}) =>(
                               <Grow
                               {...TransitionProps}
                               style={{
                                   transformOrigin : placement === 'bottom' ? 'center top ' : 'center bottom'
                               }}
                               >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose1}>
                                      <MenuList>
                                          {
                                              settings.map((option , index)=>(
                                                  <MenuItem
                                                   key={option}
                                                //    disabled={index === 2}
                                                   selected ={index === selectedIndex}
                                                   onClick={(event) =>handleMenuItemClick(event , index)}
                                                  >
                                                  {option}
                                                </MenuItem>
                                              ))
                                          }
                                      </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                               </Grow>
                           )}
                       </Popper>

                   </div>
                   <div className='profile__items__info'>
                      <p >
                        <span className='profile__static'>{posts}</span>
                        <span className='profile__label'>posts</span>
                      </p>
                      <p ref={followersRef} onClick={fhandleToggle} style={{cursor:'pointer'}}>
                       <span className='profile__static'>{user?.followers?.length}</span>
                        <span className='profile__label'>followers</span>
                      </p>
                      <Popper open={fopen} anchorEl={followersRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                             <Grow
                            {...TransitionProps}
                             style={{
                                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                 }}
                           >
                          <Paper className={classes.followers}>
                            <ClickAwayListener onClickAway={handleClose1}>
                              <List className={classes.list}>
                                 {
                                      followers && followers.map((follow)=>{
                                        return <Followers userid={follow} key={follow}/>
                                      })
                                 }
                              </List>
                            </ClickAwayListener>
                         </Paper>
                      </Grow>
                      )}
                      </Popper>
                      <p ref={followingRef} onClick={fhandleToggle1} style={{cursor:'pointer'}}>
                        <span className='profile__static'>{user?.following?.length}</span>
                        <span className='profile__label'>following</span>
                      </p>
                      <Popper open={fopen1} anchorEl={followingRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                             <Grow
                            {...TransitionProps}
                             style={{
                                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                 }}
                           >
                          <Paper className={classes.following} >
                            <ClickAwayListener onClickAway={handleClose1}>
                                <List className={classes.list}>
                                    
                                       {
                                        followings && followings.map((follow)=>{
                                          return <Following userid={follow} key={follow}/>
                                        })
                                    }
                                    
                                </List>
                            </ClickAwayListener>
                         </Paper>
                      </Grow>
                      )}
                      </Popper>
                   </div>
                   <div className='profile__items__descrip'>
                        <h1>{ userinfo.username && `${userinfo.username}`}</h1>
                       <ul style={{listStyle:'none' , padding:'3px'}}>
                                       {bio ? ( 
                                       <>
                                        {bio[0]?.length >0  ? (<li>{bio[0]}</li>) : null}
                                        {bio[1]?.length >0 ? (<li>{bio[1]}</li>):null}
                                        {bio[2]?.length > 0 ?(<li>{bio[2]}</li>) : null}
                                      { bio[3]?.length > 0 ?(<li>{bio[3]}</li>):null}
                                        {bio[4]?.length > 0 ?(<li><a className='profile__link' style={{textDecoration:'none' , textAlign:'left'}} href={`${bio[4]}`}>{bio[4]}</a></li>):null}</>): null}
                       </ul>
                   </div>
                </div>
           </div>
           
        <Dialog
        open={open}
        aria-labelledby="customized-dialog-title"
        scroll='body'
        maxWidth='lg'
        >
                <EditProfile handleClickopen={handleClickopen} 
                userinfo={userinfo} handleClickopensave={handleClickopensave} setOpen={setOpen}
                 setBackdrop={setBackdrop}
                />
       </Dialog>
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth ,
    profile : state.firebase.profile ,
    loading : state.auth.loading
})
const mapDispatchToProps = (dispatch)=>({
    signout : ()=>dispatch(actions.signOut()) ,
    uploaded : ()=>dispatch(actions.pageuploaded())
})
export default connect(mapStateToProps , mapDispatchToProps)(Header)
