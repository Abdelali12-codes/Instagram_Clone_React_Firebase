import React , {useEffect} from 'react'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'
const Progress = styled.div`
  position : relative ;
  width : 400px ;
  height : 3vh ;
  display : grid ;
  box-sizing : border-box ;
  background : ${props => props.white ? 'white' : 'red'} ;
  grid-template-columns :${props =>`repeat(${props.length}, calc(100%/${props.length}))`} ;
  grid-gap : 0 2px ;
`;
const UserStory = ({storie , photourl , handleUserProfile  ,uid , username  ,handleTransitionEnd , activeStep}) => {
    
    useEffect(()=>{
        const progress = document.querySelector(`.progress-bar-inner${activeStep}`)
       
         if(progress && !progress.classList.contains('activedbar')){
           progress.classList.add('activedbar')
   
           if(activeStep == 0){
              document.querySelector(`.progress-bar-inner${storie?.length - 1}`)
              .classList.remove('activedbar')
           }
         }
       
     },[activeStep])
    return (
        <>
            {storie && (<Progress length={storie.length} white>
                        <div className="progress-bar stripes">
                            <span className={`${`progress-bar-inner0 activedbar`}`}></span>
                         </div>
                       {
                        
                        storie && Array(Math.floor(storie.length - 1)).fill(0).map((item , index)=>{
                          return (
                          <div className="progress-bar stripes">
                            <span className={`${`progress-bar-inner${index+1}`}`}></span>
                         </div>)
                        })
                       }
                      
                  </Progress>  )}
                   <div className='story__info'>
                    { <Avatar src={photourl} alt=''/>}
                    { <span className='username' onClick={()=>handleUserProfile(uid)}>{username}</span>}
                    {storie && <span> {moment(storie[activeStep]?.data?.time?.toDate()).fromNow()}</span>}
                    
                  </div> 
        </>
    )
}

export default UserStory
