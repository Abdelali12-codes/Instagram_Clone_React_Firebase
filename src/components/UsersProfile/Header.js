import React , {useState , useRef , useEffect}  from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import {makeStyles} from '@material-ui/core/styles'
import {List} from '@material-ui/core'
import {Redirect , NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import styled from 'styled-components'
import * as actions from '../../store/actions/authActions'
import firebase from '../../config/Firebase'
import Following from './Following'
import Followers from './Followers'
import Storie from './Storie'
import moment from 'moment'
// const options =['Create a merge commit' , 'Squash and merge' , 'Rebase and merge']
const NavLi = styled(NavLink)`
         width : 100px ,
         height : 50px ,
         border : 1px solid rgb(170, 166, 166) ,
         margin-left : 6px ;
`;

const useStyles = makeStyles((theme)=>({
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
const settings =['follow' ,'block' ]
const followingoptions = ['unfollow' , 'block']
const Header = ({auth:{uid} ,profile , signout , firstName , lastName , userid}) => {

  const classes = useStyles()
    const [open1 , setOpen1] = useState(false)
    const [open , setOpen] = useState(false)
    const [fopen , setFopen] = useState(false)
    const [fopen1 , setFopen1] = useState(false)
    const [icon , setIcon] = useState(true) ;
    const [islink , setLink] = useState(false) ;
    const [roomId , setRoomId] = useState({}) ;
    const [isfollowing , setisFollowing] = useState(false)
    const anchorRef1 = useRef(null)
    const anchorRef = useRef(null)
    const followingRef = useRef(null) ;
    const followersRef = useRef(null) ;
    const [selectedIndex , setSelectedIndex] =useState(0)
    const [posts , setPosts] = useState(0)
    const [user , setUser] = useState({})
    const [roomCreated , setRoomcreated] = useState(false)
    const [takeroomId , setTakeroomId] = useState('')
    const [bio , setBio] = useState([])
    const [followings , setFollowings] = useState([])
    const [followers , setFollowers] = useState([])
    const [storie , setStorie ] = useState([])
    const [sopen , setSopen] = useState(false)
    const [storieexist , setStoryexist] = useState(false)
    const handleToggleIcon =()=>{
      setIcon(previcon =>!previcon)
    }
    const handleMenuItemClick1 = (event , index)=>{
             setSelectedIndex(index)
             if(followingoptions[index] === 'unfollow'){
              handleFollowers(userid)
        }
        if(followingoptions[index] === 'block'){
               handleBlock(userid)
        }
    }
    const handleMenuItemClick = async (event , index)=>{
           setSelectedIndex(index) ;
           if(settings[index] === 'follow'){
            //  await signout()
             handleFollowers(userid)
           }
           if(settings[index] === 'block'){
                      handleBlock(userid)
           }
          
    }
    const handleClick = ()=>{
      setOpen(prevOpen =>!prevOpen)
    }
    const handleToggle1 =()=>{
        setOpen1(prevOpen =>!prevOpen)
    }
    const handleToggle =()=>{
        setOpen(prevOpen =>!prevOpen)
    }
    const fhandleToggle =()=>{
      setFopen(prev =>!prev)
    }
    const fhandleToggle1 = ()=>{
      setFopen1(prev =>!prev)
    }
    const handleClose1 = (event)=>{
        if(anchorRef1.current && anchorRef1.current.contains(event.target)){
            return
        }
        setOpen1(false)
    }
    const handleClose = (event)=>{
        if(anchorRef1.current && anchorRef1.current.contains(event.target)){
            return
        }
        setOpen(false)
        setFopen(false)
        setFopen1(false)
    }

    const handleClickSendMessage = ( receiverId , senderName , receiverName)=>{
         
          const addRoom = firebase.functions().httpsCallable('addRoom') ;
          addRoom({uid : receiverId , senderName : senderName , receiverName : receiverName})
          .then(res =>{
              console.log(res)
              setRoomcreated(true)
              setTakeroomId(res.data.roomId)
          }).catch(err =>{
            console.log(err)
          })
    }
     
    const handleFollowers =(userid)=>{
         const addFollowers = firebase.functions().httpsCallable('addFollowers') ;
         addFollowers({uid: userid }).then(()=>{
           console.log('the following added succefully')
         }).catch(err =>{
           console.log(err)
         })
    }

    const handleBlock = (userid)=>{
      const blockuser = firebase.functions().httpsCallable('blockuser') 
      blockuser({uid : userid}).then(()=>{
        console.log('handleblock done well')
      }).catch((error)=>{
              console.log(error)
      })
    }
    // here where we will deceid is it a button or a link ;
    useEffect(() => {
        
       firebase.firestore().collection('users').doc(userid)
      .onSnapshot(snapshot =>{
        const userrooms = snapshot.data()?.rooms ;
          userrooms && userrooms.forEach((room)=>{
                 if(room.with == `${uid}`){
                   setLink(true) ;
                   setRoomId(room.roomId)
                 }
          })
      })
    }, [userid])

    useEffect(()=>{
           firebase.firestore().collection('users').doc(userid)
          .onSnapshot(snapshot =>{
            setisFollowing(snapshot.data()?.followers.includes(uid))
          })    
   },[userid])

    useEffect(()=>{
              firebase.firestore().collection('blobs').where('uploadedby','==' ,`${userid}`)
              .onSnapshot(querysnapshot =>{
                     setPosts(querysnapshot.docs.length)
              })
           
    },[userid])

    useEffect(()=>{
              firebase.firestore().collection('users').doc(userid)
              .onSnapshot(snapshot =>{
                setUser(snapshot.data())
                setBio(snapshot.data()?.bio)
              })
    },[userid])

    useEffect(()=>{
           firebase.firestore().collection('users')
           .doc(userid).onSnapshot((snapshot)=>{
             setFollowings(snapshot.data()?.following)
             setFollowers(snapshot.data()?.followers)
           })
    },[userid])

    const handleOpenDialog =(userid)=>{
             setSopen(prevOpen =>!prevOpen)
              firebase.firestore().collection('stories')
              .where('storycreated', '==' , `${userid}`).onSnapshot((querysnapshot)=>{
                 setStorie(querysnapshot.docs.map(doc => doc.data()))
              })
    }
    const handleDialogClose1 =()=>{
      setSopen( prevopen =>!prevopen)
    }
    useEffect(()=>{
      const preview = document.querySelector(`.avatar__bord`)
      // const label = document.querySelector('.label__image')
      firebase.firestore()
      .collection('stories').where('storycreated' , '==' , `${userid}`).onSnapshot((querySnapshot)=>{
          setStoryexist(querySnapshot.docs.map((doc)=> doc.data())
          .filter(data => moment(data?.time?.toDate()).startOf('hour').fromNow() !='a day ago' ).length > 0)
      })
      if(storieexist){
          preview.style.border = '3px solid #cd486b'
   
      }else{
        preview.style.border = 'none'
   
      }
      
 },[ storieexist ,userid])
  const handleFollowersClose = ()=>{
         setFopen(false)
  }
  const handleFollowingClose =()=>{
      setFopen1(false)
  }
    if(!uid) return <Redirect to='/login'/>
    if(roomCreated) return <Redirect to={`/messages?roomId=${takeroomId}&roomname=${`${firstName} ${lastName}`}&userId=${userid}`}/>
    return (
        <>
            <div className='profile__header'>
               {/* Avatar Profile */}
                <div className='profile__avatar'>
                  <div className='avatar__bord' onClick={()=>handleOpenDialog(userid)}>
                       <div className='avatar__customs'>
                          {user && <img src={user.photourl} alt='' width='150px'height='150px'/>}
                        </div>
                  </div>
                   
                </div>
                {/* Profile Items */}
                <div className='profile__items'>
                   <div className='profile__items__header'>
                     <h1>{firstName && `${firstName} ${lastName}`}</h1>
                       {
                         !isfollowing ?(
                           <>
                              <ButtonGroup variant='contained' color='primary'  aria-label="split button" style={{marginRight:'7px'}}>
                                <Button onClick={()=>handleFollowers(userid)}  >follow</Button>
                                <Button
                                 color='primary'
                                 size ='small'
                                 aria-controls={open ? 'split-button-menu' : undefined}
                                 aria-expanded={open ? 'true' : undefined}
                                 aria-label="select merge strategy"
                                 aria-haspopup="menu"
                                 ref={anchorRef}
                                 onClick={handleToggle}
                                >
                                  <ArrowDropDownIcon/>
                                </Button>
                              </ButtonGroup>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                             <Grow
                            {...TransitionProps}
                             style={{
                                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                 }}
                           >
                          <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
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
                    </>
                         ):(
                           <>
                              <ButtonGroup variant='outlined' color='default'  aria-label="split button">
                                <Button onClick={()=>handleFollowers(userid)} 
                                style={{marginRight:'10px' , borderRight:'1px solid rgb(170, 166, 166)'}} 
                                endIcon={<DoneIcon/>}
                                >following
                                </Button>
                                <Button
                                 color='defalut'
                                 size ='small'
                                 aria-controls={open ? 'split-button-menu' : undefined}
                                 aria-expanded={open ? 'true' : undefined}
                                 aria-label="select merge strategy"
                                 aria-haspopup="menu"
                                 ref={anchorRef}
                                 onClick={handleToggle}
                               
                                >
                                  <ArrowDropDownIcon/>
                                </Button>
                              </ButtonGroup>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                             <Grow
                            {...TransitionProps}
                             style={{
                                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                 }}
                           >
                          <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList>
                                          {
                                              followingoptions.map((option , index)=>(
                                                  <MenuItem
                                                   key={option}
                                                //    disabled={index === 2}
                                                   selected ={index === selectedIndex}
                                                   onClick={(event) =>handleMenuItemClick1(event , index)}
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
                 { !islink ? (
                 <Button variant='outlined' color='default'
                   onClick={()=>handleClickSendMessage(userid ,`${profile.firstName} ${profile.lastName}`, `${firstName} ${lastName}` )}
                 >
                    Message
                  </Button>):(
                    <NavLi to={`/messages?roomId=${roomId}&roomname=${`${user?.firstName} ${user?.lastName}`}&userId=${userid}`}>
                         <Button variant='outlined'>
                           Message
                         </Button>
                    </NavLi>
                  )}
                           </>
                          
                         )
                       }
                    
                
                   </div>
                   <div className='profile__items__info' style={{marginTop:'5px'}}>
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
                            <ClickAwayListener onClickAway={handleClose}>
                              <List className={classes.list}>
                                 {
                                      followers && followers.map((follow)=>{
                                        return <Followers userid={follow} key={follow}
                                        handleFollowersClose={handleFollowersClose}/>
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
                            <ClickAwayListener onClickAway={handleClose}>
                                <List className={classes.list}>
                                    
                                       {
                                        followings && followings.map((follow)=>{
                                          return <Following userid={follow} key={follow}
                                          handleFollowingClose={handleFollowingClose}/>
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
                       <h1>{user && `${user.username}`}</h1>
                       <ul style={{listStyle:'none' , padding:'3px'}}>
                           {bio ? 

                           ( 
                           <>
                            { bio[0]?.length > 0 ?(<li>{bio[0]}</li>): null}
                            { bio[1]?.length > 0 ?(<li>{bio[1]}</li>): null}
                            { bio[2]?.length > 0 ?(<li>{bio[2]}</li>): null}
                            { bio[3]?.length > 0 ?(<li>{bio[3]}</li>): null}
                            { bio[4]?.length > 0 ?(<li>{bio[4]}</li>): null}
                           </>
                           ):null}
                       </ul>
                   </div>
                </div>
           </div>
           {storie && storie?.length > 0 && <Storie  open={sopen} setOpen1={setSopen} handleDialogClose1={handleDialogClose1}
           storie={storie} length={storie?.length} userid={userid}/>}
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth ,
    profile : state.firebase.profile 
})
const mapDispatchToProps = (dispatch)=>({
    signout : ()=>dispatch(actions.signOut())
})
export default connect(mapStateToProps , mapDispatchToProps)(Header)
