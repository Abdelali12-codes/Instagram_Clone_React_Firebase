import React , { useState , useEffect} from 'react'
import logo from '../../images/story.jpg'
import './Profile.css'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'
import {connect} from 'react-redux'
import firebase from '../../config/Firebase'
import {StepperCom} from '../StepperCom'
import HighLight from './HighLight'

const Stories = ({auth:{uid}}) => {
    const [open , setOpen] = useState(false)
    const [open1 , setOpen1] = useState(false)
    const [stories , setStories] = useState([])
    const [highlights , setHighlights] = useState([]) // set the height light 
    const [highlight , setHighlight] = useState([]) // set the height light 
    const [selectimage , setSelectimage] = useState([])
    // const [highlighturl , setHighlighturl] = useState('')
    const handleAddStories = ()=>{
       setOpen(prevopen =>!prevopen)
    }
    const handleDialogClose = ()=>{
      setSelectimage([])
      setOpen(prevopen => !prevopen)
     
    }
    const handleDialogClose1 =()=>{
        setOpen1(prevopen =>!prevopen)
    }
    const handleChange = (e)=>{
       const {value} = e.target
       if(e.target.checked){
          setSelectimage([...selectimage , value])
       }else{
          setSelectimage(selectimage.filter(image => image != value))
       }
     
    }
    useEffect(()=>{
         firebase.firestore().collection('users').doc(uid)
         .collection('stories').onSnapshot((querySnapshot)=>{
           setStories(querySnapshot.docs.map(doc =>({id: doc.id , data : doc.data()})))
         })
    },[])
    useEffect(()=>{
          firebase.firestore().collection('users').doc(uid)
          .collection('highlights').onSnapshot((querySnapshot)=>{
            setHighlights(querySnapshot.docs.map(doc =>({id : doc.id ,data : doc.data() })))
          })
    },[])
    const handlesavehighlights =(uid , data)=>{

       if(data.selectimage.length >=1){
         firebase.firestore().collection('users').doc(uid)
         .collection('highlights').add({
              highlights : data.selectimage ,
              text : data.text ,
              time : firebase.firestore.FieldValue.serverTimestamp()
         }).then(()=>{
           setOpen(false)
         })
        }
      
       
    }
    const handleHighlightclick =(id , uid)=>{
      setOpen1(prevopen =>!prevopen)
       firebase.firestore().collection('users').doc(uid)
       .collection('highlights').doc(id).onSnapshot((snapshot)=>{
         setHighlight(snapshot.data())
       })
    }
    return (
        <>
        <div className='profile__stories'>
        
          <div  className='problem__solve'>
         <Tooltip title='New' arrow>
          <div className='plus__border' onClick={handleAddStories}>
             <div className='plus__container'>
                <div className='plus__shape'>
                     
                </div>
             </div>
          </div>
          </Tooltip>
           {highlights && highlights.map((highlight)=>{
           return (
           <div className='stories__bord' key={highlight.id} onClick={()=> handleHighlightclick(highlight.id , uid)}>
            <div className='stories__items' >
              <img src={highlight.data.highlights[0]} alt='' style={{width:'100%' , height:'100%'}}/>
            </div>
            <div className='highlight__text'>
               <span>{highlight.data.text}</span>
            </div>
          </div>
           )
          }) }
         </div>
         
       </div>
       <Dialog 
       open={open}
       scroll='body'
       > 
      <div className='stepper__container'>
         <StepperCom stories={stories} handleChange={handleChange}
         handleDialogClose={handleDialogClose} handlesavehighlights={handlesavehighlights} 
         selectimage={selectimage} setSelectimage={setSelectimage}/>
      </div>
       
       </Dialog>
    

          { highlight && <HighLight highlight={highlight?.highlights} date ={highlight.time}
            open={open1} setOpen1={setOpen1} handleDialogClose1={handleDialogClose1} length={highlight?.highlights?.length}
          />}
        

      
        </>
    )
}

const mapStateToProps =(state)=>({
   auth : state.firebase.auth
})
export default connect(mapStateToProps)(Stories)
