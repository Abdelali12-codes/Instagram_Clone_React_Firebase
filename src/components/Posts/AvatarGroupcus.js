import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import {makeStyles} from '@material-ui/core/styles'
import logo from '../../images/story.jpg'
const useStyles = makeStyles((theme)=>({
         avatar :{
             width : '22px' ,
             height : '22px'
         },
         root:{
            
         }
}))
const AvatarGroupcus = () => {
    const classes = useStyles()
    return (
       <>
          <AvatarGroup max={4} className={classes.root}>
          <Avatar className={classes.avatar} alt="Remy Sharp" src={logo} />
          <Avatar className={classes.avatar} alt="Travis Howard" src={logo} />
         <Avatar className={classes.avatar} alt="Cindy Baker" src={logo} />
         </AvatarGroup>

       </>
    )
}

export default AvatarGroupcus
