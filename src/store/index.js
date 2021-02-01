import {createStore , applyMiddleware} from 'redux'
import {getFirebase , reactReduxFirebase} from 'react-redux-firebase'
import {getFirestore , reduxFirestore} from 'redux-firestore'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import firebase from '../config/Firebase'

const rrfconfig ={
    userProfile: 'users', 
    useFirestoreForProfile: true, 
    attachAuthIsReady: true
}
const store = createStore(
    rootReducer , 
    composeWithDevTools( reactReduxFirebase(firebase , rrfconfig) ,
    reduxFirestore(firebase) ,
    applyMiddleware(thunk.withExtraArgument({getFirebase , getFirestore})))
   
)

export default store 