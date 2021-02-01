import React from 'react'
import {connect} from 'react-redux'
import {NavLink ,Redirect} from 'react-router-dom'
import {FirebaseAuth} from 'react-firebaseui'
import avatar from '../../svg/profile.svg'
import {useFormik} from 'formik'
import * as Yup from 'yup'
// import wave from '../../images/wave.png'
import wave from '../../images/instawave.jpg'
import bg from '../../svg/instagramlo.svg'
import './style.css'
import * as actions from '../../store/actions/authActions'
import firebase from '../../config/Firebase'

const Login = ({auth:{uid} , signin}) => {
	
	
     const formik = useFormik({
		 initialValues:{
			 email :'' ,
			 password : ''
		 },
		 validationSchema:Yup.object({
			email : Yup.string()
            .email('this email is invalid')
            .required('this field is required') ,
            password : Yup.string()
            .max(20 ,'Must be 20 characters or less' )
            .required('this field is required')
		 }),
		 onSubmit : async values =>{
			
              await signin(values)
		 }
	 })

	 
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
					<img src={avatar} alt='' />
				</div>
				
				{/* <h2 className="title">Instagram</h2> */}
           		<div className="input-div one">
           		   <div className="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>Email</h5>
							  <input type="text" name='email' value={formik.values.email}
							  onChange={formik.handleChange} className="input"/>
           		   </div>
           		</div>
           		<div className="input-div pass">
           		   <div className="i"> 
           		    	<i class="fas fa-lock"></i>
           		   </div>
           		   <div className="div">
           		    	<h5>Password</h5>
						   <input type="password" name='password' value={formik.values.password}
						   onChange={formik.handleChange}
						    className="input"/>
            	   </div>
            	</div>
				<input type="submit" className="btn" value="Login"/>
            	<div className='login__form'>
			 	 <NavLink to="/signup" className='a'>SingUp ?</NavLink>
				 <NavLink to="/" className='a'>Forgot Password ?</NavLink>
				 
				</div> 
				{/* <div className='media__login'>
					<button onClick={handleSignInWithGoogle} className='btn-google'>SingIn with Google</button>
					<button onClick={handleSignInWithFacebook} className='btn-facebook'>SignIn With Facebook</button>
				</div>
				 */}
            </form>
        </div>
    </div>
    </div>
        </>
    )
}
const mapStateToProps = (state)=>({
	auth : state.firebase.auth 
})

const mapDispatchToProps = (dispatch)=>({
      signin : (data)=>dispatch(actions.signIn(data))
})
export default connect(mapStateToProps , mapDispatchToProps)(Login)
