import React , {useEffect , useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton'
// import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import moment from 'moment'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import '.././Profile/Profile.css'
import firebase from '../../config/Firebase'
import {connect} from 'react-redux'
import UserComment from './UserComment'
const useStyles = makeStyles((theme) => ({
  root: {
    width : '400px' ,
    height :'400px' ,
    overflowY : 'auto',
    overflowX :'hidden',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  heart :{
    color :'none'
  },
  heartColor:{
    color : 'red' ,
    transform :'scale(1.3)' ,
    transition : theme.transitions.create('transform' ,{
      duration : theme.transitions.duration.shortest
    })
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const  ProfileCard =({initials , url , userid ,
  time , profile:{firstName , lastName} , comment , auth:{uid} , postid , Idlikes ,handleLikepost})=>{
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [ user , setUser ] = useState({})
  const contain = Idlikes.length > 0 ? Idlikes?.includes(uid) : false
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
 useEffect(()=>{
   firebase.firestore().collection('users')
   .doc(userid).onSnapshot(snapshot =>{
     setUser(snapshot.data())
   })
 },[userid])

 useEffect(()=>{
    
 },[])
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
        
          user && <Avatar src={user?.photourl} alt=''/>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${user?.firstName} ${user?.lastName}`}
        subheader={time ?`posted`+ ' ' + moment(time.toDate()).fromNow() : null}
      />
      <CardMedia
        className={classes.media}
        image={url}
        title="Paella dish"
      />
      <CardActions disableSpacing >
        <IconButton aria-label="add to favorites" onClick={()=>handleLikepost(postid , userid)}>
          <FavoriteIcon className={
                classes.heart ,{
                  [classes.heartColor] : contain
                }
          } />
        </IconButton>
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ padding:'0px'}}>
              <List style={{padding:'0px'}}>
                 { comment && comment.map((item , index)=>{
                    return (
                    <UserComment userid={item.id} text={item.text} key={index}/>
                    )})
                } 
              </List>
              
        </CardContent>
      </Collapse>
    </Card>
  );
}

const mapStateToProps =(state)=>({
  auth : state.firebase.auth
})
export default connect(mapStateToProps)(ProfileCard)