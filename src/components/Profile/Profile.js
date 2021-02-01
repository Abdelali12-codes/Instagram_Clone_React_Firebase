import React from 'react'
import './Profile.css'

// import ava from '../../images/abdelali.jpg'
import Header from './Header'

import Stories from './Stories'
import Footer from './Footer'
import TabsInsta from './TabsInsta'
const Profile = () => {
    
    return (
        <>
        <div className='profile__insta'>
           <Header/>
           {/* Stories */}
           <Stories/>
           {/* Profile Album */}
           <TabsInsta/>
           {/* Footer */}
           <Footer/>
        </div>
        </>
    )
}

export default Profile
