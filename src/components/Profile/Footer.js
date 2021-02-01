import React from 'react'
import './Footer.css'
const Footer = () => {
    return (
        <>
           <div style={{background:'white'}}>
           <ul class="social-icons">
            <li><a href="https://www.instagram.com/abdelali.codes/"><i class="fa fa-instagram"></i></a></li>
            {/* <li><a href="#"><i class="fa fa-twitter"></i></a></li>
            <li><a href="#"><i class="fa fa-facebook"></i></a></li> */}
            <li><a href="https://www.linkedin.com/in/abdelali-jadelmoula-ab974a139/"><i class="fa fa-linkedin"></i></a></li>
            <li><a href="https://github.com/Abdelali12-codes"><i class="fa fa-github"></i></a></li>

            {/* <li><a href="#"><i class="fa fa-codepen"></i></a></li> */}
           </ul>
                <h1 className='made__foot'>
                    Made by Abdelali jad
                </h1>
           </div> 
        </>
    )
}

export default Footer
