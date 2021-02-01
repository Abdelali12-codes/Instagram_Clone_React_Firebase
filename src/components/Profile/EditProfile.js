import React, {useEffect , useState} from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';
import {useFormik} from 'formik'
import * as Yup from 'yup'
import $ from 'jquery'
import {connect} from 'react-redux'
import './EditProfile.css'
import firebase from '../../config/Firebase'
import * as actions from '../../store/actions/authActions'


const useStyles = makeStyles((theme)=>({
             paper :{
                //  textAlign:'center' ,
               
                 width:'600px' ,
                 height :'860px' ,
                 boxSizing:'border-box' ,
                 padding:'10px 10px 20px 10px'
             }
}))
const EditProfile = ({profile:{firstName , lastName} , auth:{uid} ,
    handleClickopen , userinfo , updateprofile , setBackdrop
    , handleClickopensave , setOpen}) => {
    
    const handleChange = uid => (e)=>{
        var file = e.target.files[0]
        var storageRef = firebase.storage().ref(file.name)
        var uploadTask = storageRef.put(file)
        // var photo = document.querySelector('progress') ;
        uploadTask.on('state_changed' ,(snapshot)=>{
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                 // insert the value in the progress bar value
                //  photo.style.display = 'block'  ;
                //  photo.value = Math.floor(progress)  ;
                  switch(snapshot.state){
                      case firebase.storage.TaskState.PAUSED :
                          console.log('Upload is paused') ;
                          break ;
                      case firebase.storage.TaskState.RUNNING :
                          console.log('Upload is running') ;
                          break ;
                      default :
                         break ;
                  }
        }  ,
         // function handling errors
        (error)=>{

        },
        // Handle successful uploads on Complete
        ()=>{
                uploadTask.snapshot.ref.getDownloadURL()
                .then((downloadUrl)=>{
                     firebase.firestore().collection('users').doc(uid).update({
                                  photourl : downloadUrl 
                     }).then(()=>{
                         return {
                             message :'the photorl added succefully'
                         }
                     }).catch(err =>{
                         console.log(err)
                     })
                })} )
    }
    const classes = useStyles()
    $("#imageUpload").change(function(){
        readURL(this)
    })
    const readURL = (input)=>{
        if(input.files && input.files[0]){
            var reader = new FileReader() ;
            reader.onload= function(e){
                $('#imagePreview').css('background-image' ,`url(${e.target.result})`) ;
                $('#imagePreview').hide() ;
                $('#imagePreview').fadeIn(650) ;
            }
            reader.readAsDataURL(input.files[0])
        }
    }
    const formik = useFormik({
        initialValues:{
             username: `${userinfo.username}` ,
             bio_item1 : `${userinfo.bio[0]}` ,
             bio_item2 : `${userinfo.bio[1]}` ,
             bio_item3 : `${userinfo.bio[2]}` ,
             bio_item4 : `${userinfo.bio[3]}` ,
             bio_link : `${userinfo.bio[4]}`
        },
        validationSchema:Yup.object({
            username : Yup.string()
            .max(20 ,'this field should has at the maximum 20 characters')
            .required('this field is required'),
            bio_item1 : Yup.string()
            .max(40 , 'this field should has at the maximum 40 characters') ,
            bio_item2 : Yup.string()
            .max(40 , 'this field should has at the maximum 40 characters') ,
            bio_item3 : Yup.string()
            .max(30 , 'this field should has at the maximum 30 characters ') ,
            bio_item4 : Yup.string()
            .max(30 , 'this field should has at the maximus 30 characters'),
           
            bio_link : Yup.string() 
            .max(50 , 'this field should has at the maximum 40 characters ')
            
        }),
        onSubmit: async(values)=>{
        //    alert(JSON.stringify(values))
            await updateprofile(values)
            setOpen(false)
            setBackdrop(true)
        }
    })
    const [photourl , setPhotourl] = useState('')
    useEffect(()=>{
           firebase.firestore().collection('users').doc(uid)
           .onSnapshot((snapshot)=>{
               setPhotourl(snapshot.data().photourl)
           })
    },[])
    return (
        <>
        <div className='form__conatiner__wrapper'>
            <div className='profile__form'>
             <Paper elevation={7} className={classes.paper}>
             
               {/* <div className='form__container'> */}
                <form onSubmit={formik.handleSubmit} className='form__container'>
                    {/* first section */}
                    <div className='avatar__section'> 
                      <div className='avatar-upload'>
                      <div className='avatar-edit'>
                          <input type='file' id='imageUpload'
                            accept='image/*' onChange={handleChange(uid)}
                         />
                       <label htmlFor='imageUpload'>
                           <IconButton component='span'>
                               <EditIcon/>
                           </IconButton>
                       </label>
                      </div>
                       <div className='avatar-preview'>
                             <div id='imagePreview' style={{backgroundImage:`url(${photourl})`}}>
                            </div>
                       </div>
                     </div>
                   
                 </div>  
                 {/* second section */}
                  <div className='form__inputs'>
                        <div className='form__credentials'>
                            <h1 style={{padding:'0px'}}>Your credentials</h1>
                            <TextField 
                            disabled
                            fullWidth 
                            label={`First Name`} 
                            defaultValue={firstName} 
                           />
                            <TextField 
                             fullWidth 
                             label={`Last Name`}
                             defaultValue={lastName} 
                             disabled
                            />
                            <TextField 
                            required
                            multiline
                            value={formik.values.username}
                            label="username"
                            placeholder="Enter your username..."
                            fullWidth 
                             name="username" onChange={formik.handleChange}/>
                              {formik.touched.username && formik.errors.username ?
                                       (<div style={{color:'red'}}>{formik.errors.username}</div>) : null}
                        </div>
                        <div className='form__bio'>
                            <h1 sty>Your bio</h1>
                             <TextField
                             label="bio_item1"
                             placeholder="Enter your informations..."
                             multiline 
                             rowsMax={4}
                             fullWidth value={formik.values.bio_item1}
                             name="bio_item1" onChange={formik.handleChange}/>
                              {formik.touched.bio_item1&& formik.errors.bio_item1 ?
                                (<div style={{color:'red'}}>{formik.errors.bio_item1}</div>) : null}
                             <TextField
                             label="bio_item2"
                             placeholder="Enter your informations... "
                             multiline
                             rowsMax={4}
                             fullWidth 
                             value={formik.values.bio_item2} 
                             name="bio_item2"
                             onChange={formik.handleChange}/>
                                {formik.touched.bio_item2&& formik.errors.bio_item2?
                                       (<div style={{color:'red'}}>{formik.errors.bio_item2}</div>) : null}
                             <TextField 
                             multiline
                             rowsMax={4}
                             fullWidth 
                             placeholder="Enter your information..."
                             label='bio_item3'
                             value={formik.values.bio_item3} name="bio_item3"
                             onChange={formik.handleChange}/>
                                {formik.touched.bio_item3 && formik.errors.bio_item3 ?
                                  (<div style={{color:'red'}}>{formik.errors.bio_item3}</div>) : null}
                             <TextField 
                             multiline
                             rowsMax={4}
                             l
                             placeholder="Enter your informations..."
                             label='bio_item4'
                             placeholder='Enter your url...'
                             fullWidth
                             value={formik.values.bio_item4} 
                             name="bio_item4"
                             onChange={formik.handleChange}/>
                              {formik.touched.bio_item4 && formik.errors.bio_item4?
                                 (<div style={{color:'red'}}>{formik.errors.bio_item4}</div>) : null}
                            
                             <TextField 
                             multiline
                             label='Web site Url'
                             placeholder='Enter your url...'
                             fullWidth
                             value={formik.values.bio_link} 
                             name="bio_link"
                             onChange={formik.handleChange}/>
                              {formik.touched.bio_link && formik.errors.bio_link ?
                                 (<div style={{color:'red'}}>{formik.errors.bio_link}</div>) : null}
                             
                            <div className='submit__section'>
                              <div className='btns__section'>
                               <Button variant='outlined' color='default' onClick={handleClickopen}>
                                    Cancel
                               </Button>
                               <Button variant='contained' color='primary' type='submit' >
                                     Save
                                </Button>
                                </div>
                           </div>
                       
                        </div>
                  </div>
                  </form>  
                {/* </div> */}
              </Paper>
            </div>  
        </div>
        </>
    )
}

const mapStateToProps =(state)=>({
    profile : state.firebase.profile ,
    auth : state.firebase.auth
})
const mapDispatchToProps = (dispatch)=>({
    updateprofile : (data)=>dispatch(actions.UpdateProfile(data))
})
export default connect(mapStateToProps , mapDispatchToProps)(EditProfile)
