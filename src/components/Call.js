import React, { useEffect, useState, useRef } from "react";
import "./Call.css";
import firebase from "../config/Firebase";
import io from "socket.io-client";
import Peer from "simple-peer";
// import styled from "styled-components";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import MicOffIcon from "@material-ui/icons/MicOff";
import IconButton from "@material-ui/core/IconButton";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import CallIcon from "@material-ui/icons/Call";
import { makeStyles } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Dialog from "@material-ui/core/Dialog";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import querString from "query-string";
import { connect } from "react-redux";
import { Tooltip } from "@material-ui/core";
import * as actions from "../store/actions/authActions";

const useStyles = makeStyles(() => ({
  call: {
    background: "#4FCE5D",
    transform: "scale(1.4)",
    "&:hover": {
      background: "#4FCE5D",
    },
  },
  callend: {
    background: "red",
    transform: "scale(1.4)",
    "&:hover": {
      background: "red",
    },
  },
  icons: {
    transform: "scale(1.2)",
    background: "rgb(170, 166, 166)",
    "&:hover": {
      background: "rgb(170, 166, 166)",
    },
  },
}));

function Call({ auth: { uid }, refuse }) {
  const classes = useStyles();
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [unmuted, setUnmuted] = useState(true);
  const [showvideo, setShowvideo] = useState(true);
  const [open, setOpen] = useState(true);
  const [callmade, setCallmade] = useState(false);
  const [receivemade, setReceivemade] = useState(false);
  const [callreceived, setCallreceived] = useState(true);
  const [dataexist, setDataexit] = useState(true);
  const [callrefused, setCallRefused] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const location = useLocation();
  const history = useHistory();
  const { roomid, userid } = querString.parse(location.search);
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("roomcalls")
      .doc(roomid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setCallreceived(snapshot.data()?.callanswered);
        }
      });
  }, []);
  useEffect(() => {
    const endpoint = "https://chat-app-backend-h.herokuapp.com/";
    const endpoint1 = "https://instagram-video-call.herokuapp.com/";
    socket.current = io.connect(endpoint1);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          // stream.getAudioTracks()[0].enabled = false;
          userVideo.current.srcObject = stream;
        }
      });
    socket.current.emit("roomid", { roomid: roomid, uid: uid });
    socket.current.on("yourID", (id) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("user exited", (data) => {
      console.log("the current identifier :", uid);
      history.push("/messages");
      window.location.reload(true);
      return () => {
        socket.current.emit("disconnect", { name: "abdelali" });
        socket.current.off();
      };
    });
    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(roomid, userid, uid) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        // userToCall: id,
        signalData: data,
        from: yourID,
        roomid: roomid,
      });
    });

    peer.on("stream", (stream) => {
      console.log("stream local ", stream);
      console.log(stream);
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    setCallmade(true);
  }

  function acceptCall(roomid) {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", {
        signal: data,
        to: caller,
        roomid: roomid,
      });
    });

    peer.on("stream", (stream) => {
      console.log("relote stream ", stream);
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);

    setReceivemade(true);
  }
  const handlemutedvideo = () => {
    const enabled = stream.getAudioTracks()[0].enabled;
    if (enabled) {
      stream.getAudioTracks()[0].enabled = false;
      setUnmuted(false);
    } else {
      stream.getAudioTracks()[0].enabled = true;
      setUnmuted(true);
    }
  };
  const handlevideostop = () => {
    const enabled = stream.getVideoTracks()[0].enabled;

    if (enabled) {
      stream.getVideoTracks()[0].enabled = false;
      setShowvideo(false);
    } else {
      stream.getVideoTracks()[0].enabled = true;
      setShowvideo(true);
    }
  };
  const handleDialogClose = (roomid, userid) => {
    setOpen(false);
    history.push("/messages");
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .collection("roomcalls")
      .doc(roomid)
      .delete()
      .then(() => {
        // return firebase.firestore().collection("users").doc(uid).delete();
      })
      .then(() => {
        console.log("room deleted");
      })
      .catch((err) => {
        console.log(err);
      });
    window.location.reload(true);
  };
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setCallRefused(snapshot.data()?.callrefused);
      });
  }, []);
  if (callrefused) {
    console.log("call refused");
    firebase.firestore().collection("users").doc(uid).update({
      callrefused: false,
    });
    history.push("/messages");
    window.location.reload(true);
  }
  return (
    <>
      <Dialog open={open} scroll="body">
        <div className="video__section">
          <video
            className="remote__stream"
            ref={partnerVideo}
            autoPlay
            playsInline
          />
          <div className="button__section">
            <IconButton className={classes.icons}>
              <CameraEnhanceIcon />
            </IconButton>
            {unmuted ? (
              <IconButton onClick={handlemutedvideo} className={classes.icons}>
                <KeyboardVoiceIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handlemutedvideo} className={classes.icons}>
                <MicOffIcon />
              </IconButton>
            )}
            {showvideo ? (
              <IconButton onClick={handlevideostop} className={classes.icons}>
                <VideocamIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handlevideostop} className={classes.icons}>
                <VideocamOffIcon />
              </IconButton>
            )}
          </div>
          <div className="phone__section">
            {receivingCall ? (
              !receivemade ? (
                <IconButton
                  className={classes.call}
                  onClick={() => acceptCall(roomid)}
                >
                  <Tooltip title="Answer Call" arrow>
                    <CallIcon />
                  </Tooltip>
                </IconButton>
              ) : (
                <IconButton
                  className={classes.callend}
                  onClick={() => handleDialogClose(roomid, userid)}
                >
                  <Tooltip title="End the Call" arrow>
                    <CallEndIcon />
                  </Tooltip>
                </IconButton>
              )
            ) : null}
            {users &&
              users.map((key) => {
                if (key == yourID) {
                  // return null;
                  // alert("helllo");
                  return users.length == 1 ? (
                    <IconButton
                      className={classes.callend}
                      onClick={() => handleDialogClose(roomid, userid)}
                    >
                      <Tooltip title="End the Call" arrow>
                        <CallEndIcon />
                      </Tooltip>
                    </IconButton>
                  ) : null;
                } else {
                  return !callmade ? (
                    <IconButton
                      className={classes.call}
                      onClick={() => callPeer(roomid, userid, uid)}
                    >
                      <Tooltip title="Call" arrow>
                        <CallIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      className={classes.callend}
                      onClick={() => handleDialogClose(roomid, userid)}
                    >
                      <Tooltip title="End the Call" arrow>
                        <CallEndIcon />
                      </Tooltip>
                    </IconButton>
                  );
                }
              })}
          </div>
          <div className="caller__section">
            <video
              className="local__stream"
              ref={userVideo}
              muted="muted"
              autoPlay
              playsInline
            />
          </div>
        </div>

        {console.log(users)}
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  refuse: state.auth.callrefused,
});

const mapDispatchToProps = (dispatch) => ({
  callrefused: () => dispatch(actions.callrefused()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Call);
