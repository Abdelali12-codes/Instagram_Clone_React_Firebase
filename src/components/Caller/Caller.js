import React , {useEffect , useState , useRef} from 'react'
// import './Video.css'
import firebase from '../../config/Firebase'
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import MicOffIcon from '@material-ui/icons/MicOff';
import IconButton from '@material-ui/core/IconButton'
import CameraEnhanceIcon from '@material-ui/icons/CameraEnhance';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import {makeStyles} from '@material-ui/core/styles'
import queryString from 'query-string'
import { useLocation , useHistory} from 'react-router-dom'
import  {connect} from 'react-redux'
import Peer from 'simple-peer'
import io from 'socket.io-client'
const useStyles = makeStyles(()=>({
    call :{
    
        background :'#4FCE5D' ,
           transform:'scale(1.4)',
           '&:hover':{
           
            background: '#4FCE5D'
           }
    },
    callend:{
                background : 'red' ,
        transform:'scale(1.4)',
        '&:hover':{
            background:'red'
      
        }
    },
    icons :{
        transform:'scale(1.2)',
        background:'rgb(170, 166, 166)',
        '&:hover':{
            background:'rgb(170, 166, 166)',
        }
    }
}))
const Caller = () => {
    const history = useHistory()
    const classes = useStyles()
    // const [stream , setSTream ] = useState({})
    const [unmuted , setUnmuted] = useState(true)
    const [showvideo , setShowvideo] = useState(true) 
    const location = useLocation()
    const {roomid , userId} = queryString.parse(location.search)
    const [call , setCall] = useState(true)
    const [caller , setCaller] = useState(false)
    const [yourId , setYourId] = useState('') ;
    const [stream , setStream] = useState() ;
    const [receivingCall , setReceivingCall] = useState(false)
    const [callerSignal , setCallerSignal] = useState()
    const [receiverSignal , setReceiverSignal] = useState()
    const [callAccepted , setCallAccepted] = useState(false)

    const userVideo = useRef() ;
    const partnerVideo = useRef() ;
    const socket = io.connect('/')


    useEffect(()=>{
       navigator.mediaDevices.getUserMedia({video : {height:600 , width:600} , audio:true})
       .then(stream =>{
           setStream(stream)
           if(userVideo.current){
               userVideo.current.srcObject = stream
           }
       })
    },[])
   
    function callPeer(){
        const peer = new Peer({
            initiator : true ,
            trickle : false ,
            config :{
                iceServers :[
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    }
                ]
            },
            stream : stream
        })

       
        peer.on('signal' , data =>{
            window.localStorage.setItem('callersignal' ,JSON.stringify(data))
        })

        peer.on('stream' , stream =>{
            console.log('stream ' , stream)
            if(partnerVideo.current){
                partnerVideo.current.srcObject = stream
            }
        })
        
        // the call is accepted 
        const receivesignal = window.localStorage.getItem('receiversignal')
        if(receivesignal){
            console.log('received ' , receivesignal)
            peer.signal(receivesignal)
        }
        
    }

    function acceptCall(){
        setCallAccepted(true) ;

        const peer = new Peer({
            initiator : false  ,
            trickle : false ,
            stream : stream
        }) ;
        
        // a signal of type answer
        peer.on('signal' , data =>{
           window.localStorage.setItem('receiversignal' ,data )
        })

        peer.on('stream' , stream =>{

            console.log('stream ' , stream)
            partnerVideo.current.srcObject = stream
        })
        const callsignal = window.localStorage.getItem('callersignal')
        if(callsignal){
            console.log('caller' , callsignal)
            peer.signal(callsignal)
        }
         
    }
    const handleVideoRoomClose = (roomid)=>{
      
        firebase.firestore().collection('roomcalls').doc(roomid)
        .delete().then(()=>{
            history.push('/messages')
            document.location.reload(true)
           
        })
    }
    const handlemutedvideo = ()=>{
        const enabled = stream.getAudioTracks()[0].enabled 
        if(enabled){
            stream.getAudioTracks()[0].enabled = false 
            setUnmuted(false)
        }else{
            stream.getAudioTracks()[0].enabled = true 
            setUnmuted(true)
        }
    }
    const handlevideostop = ()=>{
        const enabled = stream.getVideoTracks()[0].enabled

        if(enabled){
            stream.getVideoTracks()[0].enabled = false 
          setShowvideo(false)
        }else{
            stream.getVideoTracks()[0].enabled = true 
            setShowvideo(true)
        }
    }
    return (
        <>
          <div style={{marginTop:'11vh'}}>
                <div className='video__section'>
                   <video className='remote__stream' ref={partnerVideo} autoPlay playsInline/>
                <div className='button__section'>
                  <IconButton className={classes.icons}>
                      <CameraEnhanceIcon/>
                  </IconButton>
                 {unmuted ? ( <IconButton onClick={handlemutedvideo} className={classes.icons}>
                      <KeyboardVoiceIcon/>
                  </IconButton>):
                  (<IconButton onClick={handlemutedvideo} className={classes.icons}>
                      <MicOffIcon/>
                  </IconButton>)}
                  {showvideo ? (<IconButton onClick={handlevideostop} className={classes.icons}>
                       <VideocamIcon/>
                  </IconButton>):
                  (<IconButton onClick={handlevideostop} className={classes.icons}>
                      <VideocamOffIcon/>
                  </IconButton>)}
                 
                </div>
                <div className='phone__section'>
               
                  
              {call ?(<IconButton className={classes.call} onClick={()=>callPeer()}>
                         <CallIcon/>
                     </IconButton>):(
                         <IconButton className={classes.callend} onClick={()=>callPeer()}>
                         <CallEndIcon/>
                     </IconButton>
                     )}
              
                </div>
                <div className='caller__section'>
                     <video className='local__stream' ref={userVideo} autoPlay playsInline/>
                </div>
             </div>
            
            
          </div>
        
        </>
    )
}


export default Caller
