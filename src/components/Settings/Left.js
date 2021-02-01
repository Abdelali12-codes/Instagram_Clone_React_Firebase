import React from 'react'
import {List , ListItem ,IconButton , ListItemIcon , ListItemText} from '@material-ui/core'
import BlockIcon from '@material-ui/icons/Block';
import SearchIcon from '@material-ui/icons/Search';
import {NavLink , useRouteMatch} from 'react-router-dom'
const Left = () => {
    const {url , path} = useRouteMatch()
    return (
        <>
           <div className='search__bar'>
                  <div>
                      <IconButton>
                          <SearchIcon/>
                      </IconButton>
                      <input className='left__input' placeholder='Search...' maxLength={4}/>
                  </div>
           </div>
           <List>
               <ListItem button>
                   <ListItemIcon>
                       <IconButton>
                           <BlockIcon/>
                       </IconButton>
                   </ListItemIcon>
                   <ListItemText>
                     <NavLink to={`${url}/blockedusers`}>
                            Blocked accounts
                     </NavLink>
                   </ListItemText>
               </ListItem>
           </List>
        </>
    )
}

export default Left
