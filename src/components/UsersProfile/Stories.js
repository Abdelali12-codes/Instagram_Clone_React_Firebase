import React , {useEffect , useState} from 'react'
import firebase from '../../config/Firebase'
import Dialog from '@material-ui/core/Dialog'
import HighLight from './HighLight'


const Stories = ({userid}) => {
    const [highlights , setHighlights] = useState([])
    const [highlight , setHighlight] = useState([])
    const [open1 , setOpen1] = useState(false)

    const handleDialogClose1 =()=>{
      setOpen1(prevopen =>!prevopen)
    }
    useEffect(()=>{
       firebase.firestore().collection('users').doc(userid)
         .collection('highlights').orderBy('time', 'asc').onSnapshot((querysnapshot)=>{
           setHighlights(querysnapshot.docs.map((doc)=>({id : doc.id , data : doc.data()})))
         })
    })
        
    const handleHighlights =(id , userid)=>{
               setOpen1(prevopen =>!prevopen)
              firebase.firestore().collection('users').doc(userid)
              .collection('highlights').doc(id).onSnapshot((snapshot)=>{
                setHighlight(snapshot.data())
              })
      }
    return (
        <>
        <div className='profile__stories'>
          <div  className='problem__solve' >
           {highlights && highlights.map((highlight)=>{
           return (
          <div className='high__stories'>
            <div className='stories__border' key={highlight.id} onClick={()=>handleHighlights(highlight.id , userid)}>
             <div className='stories__items' >
              <img src={highlight.data.highlights[0]} alt='' style={{width:'100%' , height:'100%'}}/>
             </div>
            </div>
            <div className='high__title'>
           <span>{highlight?.data?.text}</span>
            </div>
          </div>

           )
          }) }
         </div>
         
       </div>
       { highlight && <HighLight highlight={highlight?.highlights} date ={highlight.time}
           userid={userid} open={open1} setOpen1={setOpen1} handleDialogClose1={handleDialogClose1} length={highlight?.highlights?.length}
          />}
        </>
    )
}

export default Stories
