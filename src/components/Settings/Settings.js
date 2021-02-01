import React from 'react'
import {Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import './Settings.css'
import Left from './Left'
import Right from './Right'

const useStyles = makeStyles((theme)=>({
    root:{
      width :'700px' ,
      height :'500px' ,
      marginLeft :'auto' , 
      marginRight :'auto' ,
      marginTop :'11vh'
    }
}))
const Setting = () => {
  const classes = useStyles()
    return (
      <>
      <Paper className={classes.root} elevation={5}>
        <div  className='settings__component'>
            <div className='left__component'>
               <Left/>
            </div>
            <div className='right__component'>
               <Right/>
            </div>
        </div>
      </Paper>
      </>
    )
}

export default Setting
