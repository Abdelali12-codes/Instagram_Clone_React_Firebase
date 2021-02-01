import React,{useState , useEffect} from 'react'
import './Title.css'
// import logo from '../../images/abdelali.jpg'
const Title = ({selectimage , setText , text}) => {
    // const [photourl , setPhotoUrl] = useState('')
    const handleChange = (e)=>{
            const {value} = e.target ;
            setText(value)
    }
    return (
        <div className='title'>
            <div className='avatar__box'>
             <div className='avatar__box__circle'>
                <div className='avatar__images'>
                 { selectimage && <img src={selectimage[0]} width='120px' height='120px' alt=''/>}
                </div>
             </div>
                <input className='highlight__input' placeholder='HighLights..' 
                value={text} onChange={handleChange} maxLength={15}/>
            </div>
            {/* {
                console.log(photourl)
            } */}
        </div>
    )
}

export default Title
