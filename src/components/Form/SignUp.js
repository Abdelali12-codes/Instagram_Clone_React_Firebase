import React ,{useEffect , useState} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {FirebaseAuth} from 'react-firebaseui'
import avatar from '../../svg/profile.svg'
// import wave from '../../images/wave.png'
import wave from '../../images/instawave.jpg'
import bg from '../../svg/instagramlo.svg'
import './style.css'
import * as actions from '../../store/actions/authActions'
import firebase from '../../config/Firebase'
import {ProfileLogin} from '../ProfileLogin'

const SignUp = ({auth:{uid} , signup , photoUrl , profile:{userRole}}) => {

	const [hasuerrole , setHasuserrole] = useState(false)
	const handleClick = ()=>{
		 const provider = new firebase.auth.GoogleAuthProvider ;
		 firebase.auth().signInWithPopup(provider).then(result =>{
			 console.log(result.user)
			 photoUrl(result.user.photoURL)
		 }).catch(err =>{
			 console.log(err)
		 })
	}
    const uiConfig = {
		signInflow : 'popup' ,
		singInOptions :[
               firebase.auth.GoogleAuthProvider.PROVIDER_ID ,
		],
		callbacks: {
			signInSuccess: () => {
			  this.setState({signedIn: true});
			  return false; // Avoid redirects after sign-in.
			}
		}
	}
	const formik = useFormik({
	initialValues :{
		firstName : '' ,
		lastName : '' ,
		email : '' ,
		password : '' ,
	

	},
	validationSchema:Yup.object({
		firstName : Yup.string()
		.max(20 , 'Must be 20 characters or less')
		.required('this field is required') ,
		lastName : Yup.string()
		.max( 20 ,' Must be 20 characters or less')
		.required('this field is required') ,
		email : Yup.string()
		.email('this email is invalid')
		.required('this field is required') ,
		password : Yup.string()
		.min( 10 , 'the password must contain 10 characters or more')
		.required('this field is required') ,
	
	}),
	onSubmit : async values =>{
	
	   await  signup(values)
	}})
	useEffect(()=>{
		uid && firebase.firestore().collection('users').doc(uid)
		  .onSnapshot((snapshot)=>{
			  setHasuserrole(snapshot.data().userRole)
		  })
	},[])
	 if(!hasuerrole && uid ) return <Redirect to='/profilelogin' children={ProfileLogin}/>
	if(uid) return <Redirect to='/'/>
    return (
        <>
		<div className='wrapper__form'>
          <img className="wave" src={wave} alt=''/>
	    <div className="container">
		<div className="img">
			<img src={bg} alt=''/>
		</div>
		<div className="login-content">
			<form onSubmit={formik.handleSubmit} >
				<div className='avatar__login'>
					<img src={avatar} alt=''/>
				</div>
				
				{/* <h2 className="title">Instagram</h2> */}
           		<div className="input-div one">
           		   <div className="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>First Name</h5>
							  <input type="text" name='firstName'
							  class="input" value={formik.values.firstName} onChange={formik.handleChange}
							   placeholder='Enter your First Name...' required/>
           		   </div>
           		</div>
				   {formik.touched.firstName && formik.errors.firstName ?
                                       (<div style={{color:'red'}}>{formik.errors.firstName}</div>) : null}
           		<div className="input-div one">
           		   <div className="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>Last Name</h5>
							  <input type="text" name='lastName'
							   value={formik.values.lastName} onChange={formik.handleChange}
							   class="input" placeholder='Enter your last Name...' required/>
           		   </div>
           		</div>
				   {formik.touched.lastName && formik.errors.lastName ?
                                       (<div style={{color:'red'}}>{formik.errors.lastName}</div>) : null}
           		<div className="input-div one">
           		   <div className="i">
           		   		<i class="fas fa-envelope"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>Email</h5>
							  <input type="email" name='email'
							  value={formik.values.email} onChange={formik.handleChange}
							   class="input" placeholder='Enter your Email...' required/>
           		   </div>
           		</div>
				   {formik.touched.email && formik.errors.email ?
                                       (<div style={{color:'red'}}>{formik.errors.email}</div>) : null}
           		<div className="input-div one">
           		   <div className="i">
           		   		<i class="fas fa-lock"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>Password</h5>
							  <input type="password" name='password'
							   value={formik.values.password} onChange={formik.handleChange}
							  class="input" placeholder='Enter your password...' required/>
           		   </div>
           		</div>
				   {formik.touched.password && formik.errors.password ?
                                       (<div style={{color:'red'}}>{formik.errors.password}</div>) : null}
				<input type="submit" className="btn" value="Sign Up"/>
				
            </form>
			<div className='login__form'>
			 	 <NavLink to="/login" className='a'>SignIn ?</NavLink>
				{/* <NavLink style={{textAlign:'center'}} to="#" className='a'>SingIn With Google Account ?</NavLink> */}
					{/* <button className='btn-google' onClick={handleClick}>SingIn With Google Account ?</button> */}
				{/* <div>
				<FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
				</div> */}
			</div>
		
        </div>
    </div>
    </div>
        </>
    )
}
const mapStateToProps = (state)=>({
	auth : state.firebase.auth  ,
	profile : state.firebase.profile
})
const mapDispatchToProps =(dispatch)=>({
	signup : (data)=>dispatch(actions.signUp(data)) ,
	photoUrl : (data)=>dispatch(actions.PhotoUrl(data))
})

export default connect(mapStateToProps , mapDispatchToProps)(SignUp)
