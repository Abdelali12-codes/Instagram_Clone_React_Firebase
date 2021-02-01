import React, { useEffect, useState } from "react";
import {
  Navbar,
  Home,
  Notifications,
  Login,
  SignUp,
  VideoCalls,
  Storiesstepper,
} from "./components";
import { TabIns as Messages } from "./components/Messages";
import { Profile } from "./components/Profile";
import { Comment } from "./components/Comments";
import { MessageIns } from "./components/Room";
import { UserProfile } from "./components/UsersProfile";
import { ProfileLogin } from "./components/ProfileLogin";
import { StepperCom } from "./components/StepperCom";
import { Settings } from "./components/Settings";
import { Caller } from "./components/Caller";
import { Receiver } from "./components/Receiver";
import Call from "./components/Call";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import firebase from "./config/Firebase";
import * as actions from "./store/actions/authActions";
import "./App.css";
const App = ({
  auth: { uid },
  sendToken,
  sendNotification,
  profile: { userRole },
}) => {
  const [userrole, setUserrole] = useState(false);

  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      return messaging.getToken();
    })
    .then((token) => {
      const UsersFCM = firebase.functions().httpsCallable("UsersFCM");
      return UsersFCM({ token: token }).then(() => {
        sendToken(token);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  messaging.onMessage((payload) => {
    console.log(payload);
    sendNotification();
  });
  useEffect(() => {
    window.localStorage.removeItem("abdelai", "abdelali jad");
  }, []);
  return (
    <>
      {userRole ? <Navbar /> : null}

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/messages" component={Messages} />
        {/* <Route  path='/notifications' component={Notifications}/> */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/comments" component={Comment} />
        <Route path="/message" component={MessageIns} />
        <Route path="/userprofile/:id" component={UserProfile} />
        <Route path="/profilelogin" component={ProfileLogin} />
        {/* <Route  path='/videos' component={VideoCalls}/> */}
        {/* <Route  path='/stepper' component={StepperCom}/> */}
        <Route path="/stories" component={Storiesstepper} />
        <Route path="/settings" component={Settings} />
        <Route path="/Call" component={Call} />
        {/* <Route  path='/caller' component={Caller}/>
        <Route  path='/receiver' component={Receiver}/> */}
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

const mapDispatchToProps = (dispatch) => ({
  sendToken: (data) => dispatch(actions.Send_Token(data)),
  sendNotification: () => dispatch(actions.sendNotification()),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
