import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send';
const RightSide = () => {
    return (
        <>
        <div className='send__message'>
        <IconButton className='icon__message'>
            <SendIcon/>
        </IconButton>
        </div>
        <div>
           <h1 style={{textAlign:'center'}}>Vos messages</h1>
           <p style={{color:'grey'}}>Envoyez des photo et des messages privés</p>
        <div className='classe__btn'>
           <button className='btn__message'>Envoyer un message</button>
        </div>
       </div>
        </>
    )
}

export default RightSide
