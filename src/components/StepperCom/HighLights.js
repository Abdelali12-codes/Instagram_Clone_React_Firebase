import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
const HighLights = ({stories , handleChange}) => {
    return (
        <>
           
            <div className='first__section1'>
                {
                  stories && stories.map((story)=>{
                    return (
                    <div className='your__stories__items' key={story.id}>
                        <img src={story.data.storyphoto} alt='' width='100%' height='100%'/>
                        <div className='your__stories__items__info'>
                          
                             <Checkbox  value={story.data.storyphoto} onChange={handleChange} />
                        </div>
                    </div>)
                  })
                }
            </div>
          
        </>
    )
}

export default HighLights
