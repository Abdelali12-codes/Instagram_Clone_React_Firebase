import React from 'react'
import {List} from '@material-ui/core'
import User from './User'
const Blocked = ({blockedusers}) => {
    return (
        <>
           <List>
               {
                  blockedusers && blockedusers.map((userid)=>{
                       return <User key={userid} userid={userid}/>
                   })
               }
           </List>
        </>
    )
}

export default Blocked
