import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'

import {BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import {Provider} from 'react-redux'
store.firebaseAuthIsReady.then(()=>{
  ReactDOM.render(
  <Provider store={store}>
   <Router>
    
      <App/>
    </Router>
  </Provider>
   ,
  document.getElementById('root')
);
})



