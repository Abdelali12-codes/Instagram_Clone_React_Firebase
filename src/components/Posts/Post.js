import React , {useState , useRef , useContext , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import firebase from '../../config/Firebase'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {deepOrange  } from '@material-ui/core/colors'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import SendIcon from '@material-ui/icons/Send';
import CommentIcon from '@material-ui/icons/Comment';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {connect} from 'react-redux'
import moment from 'moment'
import AvatarGroupcus from './AvatarGroupcus'
import {NavLink} from 'react-router-dom'
import styled from 'styled-components'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import {useHistory} from 'react-router-dom'
import './Post.css'
const options =['Create a merge commit' , 'Squash and merge' , 'Rebase and merge']
const settings =['Edit' , 'Modifie' , 'Delete']
const NavLin = styled(NavLink)`
    text-decortation : none ;
    margin-right : 5px ;
    color : rgba(0 ,0 ,0 ,0.5) ;
    text-decoration :none; 
    user-select : none; 
    font-family : Quicksand , sans-serif ;
    font-size : 16px ;
    transition  : all 0.5s linear ;
`;
const List = styled.ul`
      padding: 0 ;
      margin:0 ;
      list-style:none ;
      width:100% ; 
      height :40px ;
     
      overflow:hidden
`;
const Li = styled.li`
    white-space : nowrap ;
    text-overflow : ellipsis ;
    overflow : hidden ;
    list-style : none ;
    padding : 0px 0px 0px 3px ;
 `
const Lis = styled.li`
    white-space : nowrap ;
    text-overflow : ellipsis ;
    overflow : hidden ;
    list-style : none ;
    wdith : 100% ;
    height : 100% ;
    padding : 0px 0px 0px 3px ;
    background : blue ;
 `
const BoxList = styled.div`
     position: relative ;
     width : 100% ;
     height : ${props => props.more ? `39px` : `50px`} ;
     overflow: hidden ;
    
`;
const useStyles = makeStyles((theme)=>({
  root: {
    // position :'relative' ,
    width:'470px',
    height :'540px'  ,
    justifySelf:'center',
    overflow:'hidden' ,
    marginTop : '10px' ,
    '&:hover':{
        boxShadow : '2px 2px 10px grey ,-2px -2px 10px grey'
    },
    
  },
  media: {
    height: '200px',
  },
  card :{
    display :'grid' ,
    gridTemplateColumns : '2fr 2fr' ,
    alignItems :'center' ,
    paddingBottom :'0px' ,
    
    
  },
  button2:{
     justifySelf : 'end' ,
     fontFamily :'Galada , sans-serif' ,
     fontSize : '34px'
  } ,
  button1:{
       fontFamily :'Anton , sans-serif' ,
       fontSize : '25px'
  },
  content :{
     
  },
  expand:{
    transform :'rotate(0)' ,
    marginLeft : 'auto' ,
    transition :theme.transitions.create('transform' ,{
      duration : theme.transitions.duration.shortest
    })
  },
  expandOpen:{
    transform : 'rotate(180deg)'
  } ,
  heartColor:{
    color : 'red' ,
    transform :'scale(1.3)' ,
    transition : theme.transitions.create('transform' ,{
      duration : theme.transitions.duration.shortest
    })
  }
  ,
  heart :{
    color :'none'
  },
  ava:{
    color : theme.palette.getContrastText(deepOrange[500]) ,
    background : deepOrange[500]
   },
   book:{
     justifySelf :'end',
    
   },
   book1:{
    
   },
   book1c:{
     transform:'scale(1.1)'
   },
   send:{
     transform : 'rotate(-30deg) translateY(-4px)',
     transformOrigin :'center' ,} ,
   comment:{
      width :'100%' ,
      height :'34px' ,
      position : 'absolute' ,
      bottom :'0px' ,
      left :'0' ,
      border:'1px solid grey' ,
      outlined :'0px',
      borderRadius :'3px' ,
      padding:'0px 2px' ,
      

   },
   footer:{
     width : '100%' ,
     height :'100%' ,
     display :'flex' ,
     flexDirection : 'column',
     justifyContent :'flex-end'
   },
   like:{
      position :'relative' ,
      width :'100%' ,
      display :'flex' ,
      alignItems :'center' ,
   },
   comments:{
     position:'relative' ,
     width :'100%',
     height : '50px',
     overflow:'hidden' ,
     
   },
   span:{
     fontFamily :'Arimo , sans-serif' ,
     fontSize :'15px' ,
     marginLeft :'5px' 
   },
   para:{
     backgroundColor :'blue'
   },
   cardc:{
     padding:'0' , 
     height: '170px' ,
     width:'100%' , 
     display:'flex' ,
     flexDirection:'column',
     justifyContent:'space-between'
   }

}));
const Post = ({logo ,Idlikes ,uploadedby , 
  Idsaves,auth:{uid} , title , BuyFun , initials ,
   time ,firstName , lastName,token , likes , comments  }) =>{
  const classes = useStyles();
  const inputRef = useRef() ;
  const history = useHistory()
  const contain = Idlikes.length > 0 ? Idlikes.includes(uid) : false ;
  const saved  = Idsaves.length > 0 ? Idsaves.includes(uid) : false ;
  // const [heart , setHeart] = useState(false) 
  const [show , setShow] = useState(false)
  const [click , setClick] = useState(false)
  const [isopened , setIseopened] = useState(false)
  const [more , setMore] = useState(false)
  const [commentSnap , setCommentSnap ]= useState([])
  const [open1 , setOpen1] = useState(false)
  const anchorRef1 = useRef(null)
  const [selectedIndex , setSelectedIndex] =useState(1)
  const [photourl , setPhotourl] = useState('')
  const handleClick =()=>{
        console.info(`You clicked ${options[selectedIndex]}`)
    }
  const handleMenuItemClick = (event , index)=>{
           setSelectedIndex(index) ;
      
    }
  const handleToggle1 =()=>{
        setOpen1(prevOpen =>!prevOpen)
    }
    
  const handleClose1 = (event)=>{
        if(anchorRef1.current && anchorRef1.current.contains(event.target)){
            return
        }
        setOpen1(false)
    }
  const handleClickBuy = ()=>{
    BuyFun()
    setShow(true)
   }
  
  const hearthandleClick =(data)=>{
    
    const addLikes = firebase.functions().httpsCallable('addLikes')
    addLikes({id : data , uid: uploadedby , postId : token}).then((res)=>{
      console.log(res)
    }).catch(err =>{
      console.log('error occured' , err)
     })

    
  }
  const handleClickbook = (token)=>{
    // setClick(!click)
    const SavePost = firebase.functions().httpsCallable('SavePost') ;
    SavePost({url :logo , uid: token}).then(()=>{
      
    })
    .catch(err =>{
      console.log(err)
    })
  }
  const handleClickHeader =(id)=>{
        history.push(`/userprofile/${id}`)
  }
  const footerhandle =()=>{
       setIseopened(!isopened)
  }
  const handleSubmit = data => e =>{
       
    if(e.key == 'Enter' && e.target.value.length > 0){
       const comments = firebase.functions().httpsCallable('addComments')
       comments({id : data.token ,uploadedby : data.uploadedby , text : e.target.value })
       .then(res =>{
         console.log('the comment added succefully' , res)
        //  alert(inputRef.current.value)
         inputRef.current.value = ''
       }).catch(err =>{
         console.log(err.message)
       })

       
    }
}
  useEffect(()=>{
    firebase.firestore().collection('blobs').doc(token).collection('comments').orderBy('time' , 'asc')
    .onSnapshot(snapshot =>{
      setCommentSnap(snapshot.docs.map(doc =>({id : doc.id , data : doc.data()})))
    
    })
 },[])
 useEffect(()=>{
           firebase.firestore().collection('users').doc(uploadedby)
           .onSnapshot(snapshot =>{
              setPhotourl(snapshot.data().photourl)
           })
 },[])
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.ava} src={photourl} alt=''/>
        }
        // action={
        // <div>
        //   <IconButton aria-label="settings" ref={anchorRef1} onClick={handleToggle1}>
        //     <MoreVertIcon />
        //   </IconButton>
        //   <Popper open={open1} anchorEl={anchorRef1.current}
        //   role={undefined} transition disablePortal
        //   style={{zIndex:'8'}}
        //  >
        //      {({TransitionProps , placement}) =>(
        //          <Grow
        //          {...TransitionProps}
        //          style={{
        //              transformOrigin : placement === 'bottom' ? 'center top ' : 'center bottom'
        //          }}
        //          >
        //           <Paper>
        //               <ClickAwayListener onClickAway={handleClose1}>
        //                 <MenuList>
        //                     {
        //                         settings.map((option , index)=>(
        //                             <MenuItem
        //                              key={option}
        //                             //  disabled={index === 2}
        //                              selected ={index === selectedIndex}
        //                              onClick={(event) =>handleMenuItemClick(event , index)}
        //                             >
        //                             {option}
        //                           </MenuItem>
        //                         ))
        //                     }
        //                 </MenuList>
        //               </ClickAwayListener>
        //           </Paper>
        //          </Grow>
        //      )}
        //  </Popper>
        // </div>
        // }
        title={`${firstName}`+ ' ' +  `${lastName}` }
        subheader={time ?  `posted`+' '+ moment(time.toDate()).fromNow() : null}
        style={{background : 'grey' , cursor:'pointer'}}
        onClick={()=>handleClickHeader(uploadedby)}
      />
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={logo}
          title={title}
        />
      </CardActionArea>
      <CardActions className={classes.card}>
      
        <div className={classes.icons}>
        <IconButton 
        onClick={()=>hearthandleClick(token)}
         className={clsx(classes.heart ,{
           [classes.heartColor] :contain
         })}
        >
            <FavoriteIcon />
        </IconButton>
         <IconButton 
          onClick={()=> {
           return inputRef.current.focus()
           }}
         >
          <CommentIcon/> 
         </IconButton>
         <IconButton 
         onClick={handleClick}
         className={classes.send}
         aria-label="show more"
         >
        <SendIcon/>
        </IconButton>
        </div>
        <div className='book__icon'>
       { !saved ?(
         
        <IconButton
        className={classes.book}
        onClick={()=>handleClickbook(token)}
        >
        <BookmarkBorderIcon />
        </IconButton>
       ):
        (
        
        <IconButton className={clsx(classes.book1 ,{
         [classes.book1c] : saved
        })}
          onClick={()=>handleClickbook(token)}
        >
          <BookmarkIcon/>
        </IconButton>
      
        )
        }
        </div>
      </CardActions>
      <CardContent className={classes.cardc}>
        <div className={classes.like}>
          <AvatarGroupcus/>
          <p className='group__avatar'>Liked by {likes}</p>
        </div>
        
      <div className='comments__section'>
        <BoxList more={more}>
         <List>
           {
             commentSnap && commentSnap.map( (comment) =>{
             return <Li key={comment.id} style={{fontSize:'16px'}} onClick={()=>{
               alert(comment.id) 
             }}><span className={classes.span} style={{fontSize:'15px'}}>{comment.data.user}</span> {comment.data.text}</Li>
             } ) }
         </List>
        </BoxList>
        
       {commentSnap.length >= 3 ?(
       <NavLin  to={`/comments?id=${token}&name=${`${firstName} ${lastName}&userid=${uploadedby}`}`} 
       style={{paddingLeft:'4px'}}>
         show all {commentSnap.length - 3 == 0 ? null :  commentSnap.length - 2} comments
       </NavLin>)
       :null}
       <div className='comments__input'>
         <input className='input__custom' name='comment' placeholder='Enter your comment...' 
         onKeyPress={handleSubmit({token : token , uploadedby : uploadedby})} ref={inputRef}/>
       </div>
      </div>
      
       </CardContent>
    </Card>
  );
}
const mapStateToProps = (state)=>({
  profile : state.firebase.profile ,
  auth : state.firebase.auth ,
 
})
const mapDispatchToProps = (dispatch)=>({
 
})


export default connect(mapStateToProps , mapDispatchToProps)(Post)