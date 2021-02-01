import React, {useEffect, useState} from 'react'
import firebase from '../../config/Firebase'
import  '.././Stories/Story.css'
import logo from '../../images/story.jpg'
import Dialog from '@material-ui/core/Dialog'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'
import {makeStyles , useTheme} from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import {autoPlay} from 'react-swipeable-views-utils'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import {connect} from 'react-redux'
const AutoPlaySwipeableViews =autoPlay(SwipeableViews)


const Progress = styled.div`
     position : relative ;
     width : 390px ;
     height : 3vh ;
     display : grid ;
     box-sizing : border-box ;
     background : ${props => props.white ? 'white' : 'red'} ;
     grid-template-columns :${props =>`repeat(${props.length}, calc(100%/${props.length}))`} ;
     grid-gap : 0 3px ;
`;
const useStyles = makeStyles((theme)=>({
  root:{
      marginTop :'10vh' ,
      maxWidth : 400 ,
      flexGrow : 1 ,
  },
  header:{
      display :'flex' ,
      alignItems :'center' ,
      height :50 ,
      paddingLeft : theme.spacing(4) ,
      backgroundColor : theme.palette.background.default ,
      
  },
  img:{
      height : 350,
      display : 'block' ,
    
      overflow : 'hidden' ,
      width : '400px'
  }
}))

const HighLight = ({userid , highlight , date , open , handleDialogClose1 , setOpen1 , length}) => {
  
  const history = useHistory()
  const [user , setUser] = useState({})
//   const [open ,setOpen] = useState(false)
  const classes = useStyles() ;
  const theme = useTheme() ;
  const [autoplay , setAutoplay] = useState(true)
  const [activeStep , setActiveStep ] = useState(0)
  const [array , setArray] = useState([])
  // const maxSteps = photourls?.length
  const handleStepChange = (step)=>{
        setActiveStep(step)
    }

  const handleUserProfile =(id)=>{
     history.push(`/userprofile/${id}`)
  }
  const handleTransitionEnd =()=>{
     if(activeStep == 0){
       setOpen1(false)
     }
     const progress = document.querySelector(`.progress-bar-inner${activeStep - 1}`)
     if(progress){
       progress.classList.remove('activedbar')
     }
  }

  const handleClick =()=>{
    setAutoplay(prevo =>!prevo)
  }
  useEffect(()=>{
          firebase.firestore().collection('users').doc(userid)
         .onSnapshot((snapshot)=>{
           setUser(snapshot.data())
         })
  },[userid])
  useEffect(()=>{
     const progress = document.querySelector(`.progress-bar-inner${activeStep}`)
    
      if(progress && !progress.classList.contains('activedbar')){
        progress.classList.add('activedbar')

        if(activeStep == 0){
           document.querySelector(`.progress-bar-inner${highlight?.length - 1}`)
           .classList.remove('activedbar')
        }
      }
    
  },[activeStep])
   useEffect(()=>{
             setArray(highlight?.slice(0 , highlight?.length -1))
   },[highlight])
    return (
        <>
        <Dialog
        open={open}
        onClose={handleDialogClose1}
        >
             <div className='story__item__click'>
               <div className='story__indicator'>
                  
                  <Progress length={length} white>
                        <div className="progress-bar stripes">
                            <span className={`${`progress-bar-inner0 activedbar`}`}></span>
                         </div>
                       {
                        array?.map((item , index)=>{
                          return (
                          <div className="progress-bar stripes">
                            <span className={`${`progress-bar-inner${index+1}`}`}></span>
                         </div>)
                        })
                       }
                      
                  </Progress>
                  <div className='story__info'>
                    {user && <Avatar src={user.photourl} alt=''/>}
                    {user && <span className='username' onClick={()=>handleUserProfile(userid)}>{user.username}</span>}
                    {highlight && <span> {moment(date.toDate()).fromNow()}</span>}
                    
                  </div>
                 
               </div>
               <div className='story__item__click__photo'>
                   <AutoPlaySwipeableViews
                    //  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                     index={activeStep}
                     onChangeIndex={handleStepChange}
                     enableMouseEvents
                     style={{height:'400px'}}
                     interval={4000}
                     onClick ={handleClick}
                     autoplay={autoplay}
                     onTouchStart={()=>alert('hhh')}
                     onTransitionEnd={handleTransitionEnd}
                    
                   >
                   {
                    highlight?.map((step , index)=>(
                     <div>
                       
                         {Math.abs(activeStep - index) <= 5 ?
                         (<img className={classes.img} src={step}/>) : console.log('stop')}
                     </div>
                    ))
                   }
                  </AutoPlaySwipeableViews>
             </div>
                
            </div>
          
        </Dialog>
     
        </>
    )
}

const mapStateToProps = (state)=>({
    auth : state.firebase.auth
})
export default connect(mapStateToProps)(HighLight)