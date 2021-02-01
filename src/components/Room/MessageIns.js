import React, { useRef, useState, useEffect, forwardRef } from "react";
import "./Message.css";
import firebase from "../../config/Firebase";
import * as actions from "../../store/actions/authActions";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PhoneIcon from "@material-ui/icons/Phone";
import { Avatar, Dialog } from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";
// import ScrollToBottom from "react-scroll-to-bottom";
// import ReactEmoji from "react-emoji";
import FlipMove from "react-flip-move";
import VideocamIcon from "@material-ui/icons/Videocam";
import { useHistory } from "react-router-dom";
// import { set } from "date-fns";
import CallIcon from "@material-ui/icons/Call";
import { makeStyles } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
// import { el } from "date-fns/locale";
// import io from "socket.io-client";
// import queryString from 'query-string'
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

const MessageIns = ({
  auth: { uid },
  SendMessage,
  roomId,
  roomname,
  userid,
  callrefused,
}) => {
  const classes = useStyles();
  const InputRef = useRef();
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [photourl, setPhotourl] = useState("");
  const [displayinput, setDisplayinput] = useState(true);
  const [blockuser, setBlockuser] = useState(true);
  const [blocked, setBlocked] = useState(true);
  const [notsend, setNotSender] = useState(false);
  const [caller, setCaller] = useState({});
  const [callerId, setCallerId] = useState(null);
  const socket = useRef();

  useEffect(() => {
    firebase.firestore().collection("users").doc(uid).update({
      callrefused: false,
    });
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        firebase.firestore().collection("users").doc(uid).update({
          callrefused: false,
        });
      });
  }, []);

  useEffect(() => {
    uid &&
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("roomcalls")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            setNotSender(snapshot.data()?.callerId != uid);
            console.log(snapshot.data()?.callerId != uid);
            setCallerId(snapshot.data()?.callerId);
            // setCaller(snapshot.data());
            snapshot.data()?.callerId &&
              firebase
                .firestore()
                .collection("users")
                .doc(snapshot.data()?.callerId)
                .onSnapshot((snapshot) => {
                  setCaller(snapshot.data());
                });
          } else {
            setNotSender(false);
          }
        });
  }, []);
  useEffect(() => {
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("time", "asc")
      .onSnapshot((querySnapshot) => {
        setMessages(
          querySnapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
        );
        var conversation = document.querySelector(".containers");
        if (conversation) {
          conversation.scrollTop = conversation.scrollHeight;
        }
      });
  }, [roomId]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .onSnapshot((snapshot) => {
        setPhotourl(snapshot.data()?.photourl);
      });
  }, [roomId]);
  const handleClick = (uid, roomId) => {
    if (message) {
      SendMessage({ message: message, uid: uid, roomId: roomId });
    }

    setMessage("");
    InputRef.current.focus();
    const send = document.querySelector(".send");
    if (send) {
      send.style.display = "none";
    }
  };
  const handleChange = (e) => {
    const send = document.querySelector(".send");
    if (send && e.target.value.length > 0) {
      send.style.display = "block";
    } else {
      send.style.display = "none";
    }
    setMessage(e.target.value);
  };
  const handlebackClick = () => {
    history.replace("/messages");
  };

  const handleVideoCall = (roomid, userid, uid) => {
    history.push(`/Call?roomid=${roomid}&userid=${userid}`);
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .collection("roomcalls")
      .doc(roomid)
      .set({
        callerId: uid,
      });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setBlockuser(!snapshot.data()?.blockedusers.includes(userid));
      });
  }, [userid]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setBlocked(!snapshot.data()?.blocked.includes(userid));
      });
  }, [userid]);
  const handleRefuseCall = (roomid, uid, userid, callerid) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("roomcalls")
      .doc(roomid)
      .delete()
      .then(() => {
        return firebase.firestore().collection("users").doc(callerid).update({
          callrefused: true,
        });
      })
      .then(() => {
        console.log("the refuse call option updated");
      })
      .catch((err) => {
        console.log(err);
      });
    // callrefused();
  };
  const handleAnswerCall = (roomid, userid) => {
    history.push(`/Call?roomid=${roomid}&userid=${userid}`);
  };
  return (
    <>
      <div className="chat__section">
        <div class="page">
          <div class="chat">
            <div class="chat-container">
              <div class="user-bar">
                <div class="back">
                  <IconButton onClick={handlebackClick}>
                    <ArrowBackIcon />
                  </IconButton>
                </div>
                <div class="avatar">
                  {photourl ? (
                    <Avatar src={photourl} alt="" />
                  ) : (
                    <Avatar>{roomname && roomname[0].toUpperCase()}</Avatar>
                  )}
                </div>
                <div class="name">
                  <span>{roomname}</span>
                  {/* <span class="status">online</span> */}
                </div>
                <div class="actions more">
                  <IconButton>
                    <MoreVertOutlinedIcon />
                  </IconButton>
                </div>
                <div className="actions">
                  <IconButton
                    onClick={() => handleVideoCall(roomId, userid, uid)}
                  >
                    <VideocamIcon />
                  </IconButton>
                </div>
              </div>
              <div className="conversation">
                <div className="conversation-container containers">
                  <FlipMove>
                    {messages &&
                      messages.map((message) => {
                        return (
                          <Message
                            message={message}
                            uid={uid}
                            key={message.id}
                          />
                        );
                      })}
                  </FlipMove>
                </div>

                <form
                  class="conversation-compose"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {!blockuser || !blocked ? (
                    <p style={{ width: "100%", textAlign: "center" }}>
                      you can't send message to this conversation
                    </p>
                  ) : (
                    <>
                      <div class="photo">
                        <input
                          accept="image/*"
                          type="file"
                          name="files"
                          style={{ display: "none" }}
                        />
                        <label htmlFor="files">
                          <IconButton component="span">
                            <CameraAltOutlinedIcon />
                          </IconButton>
                        </label>
                      </div>

                      <input
                        class="input-msg"
                        name="input"
                        placeholder="Type a message"
                        onChange={handleChange}
                        value={message}
                        autoComplete="off"
                        autoFocus
                        ref={InputRef}
                      />
                      <div class="emoji">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          id="smiley"
                          x="3147"
                          y="3209"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965zM5.95 12.965c-.027-.307-.132 5.218 6.062 5.55 6.066-.25 6.066-5.55 6.066-5.55-6.078 1.416-12.13 0-12.13 0zm11.362 1.108s-.67 1.96-5.05 1.96c-3.506 0-5.39-1.165-5.608-1.96 0 0 5.912 1.055 10.658 0zM11.804 1.01C5.61 1.01.978 6.034.978 12.23s4.826 10.76 11.02 10.76S23.02 18.424 23.02 12.23c0-6.197-5.02-11.22-11.216-11.22zM12 21.355c-5.273 0-9.38-3.886-9.38-9.16 0-5.272 3.94-9.547 9.214-9.547a9.548 9.548 0 0 1 9.548 9.548c0 5.272-4.11 9.16-9.382 9.16zm3.108-9.75c.795 0 1.44-.88 1.44-1.963s-.645-1.96-1.44-1.96c-.795 0-1.44.878-1.44 1.96s.645 1.963 1.44 1.963z"
                            fill="#7d8489"
                          />
                        </svg>
                      </div>
                      <button className="send" style={{ display: "none" }}>
                        <div class="circle">
                          {/* <i class="zmdi zmdi-mail-send"></i> */}
                          <IconButton onClick={() => handleClick(uid, roomId)}>
                            <SendIcon />
                          </IconButton>
                        </div>
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={notsend} scroll="body">
          <div className="class__call">
            {caller && (
              <p>{`${caller.firstName} ${caller.lastName}`} Is Calling You</p>
            )}
            <div className="class__answer">
              <IconButton
                className={classes.call}
                onClick={() => handleAnswerCall(roomId, uid)}
              >
                <CallIcon />
              </IconButton>
              <IconButton
                className={classes.callend}
                onClick={() => handleRefuseCall(roomId, uid, userid, callerId)}
              >
                <CallEndIcon />
              </IconButton>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
});
const mapDispatchToProps = (dispatch) => ({
  SendMessage: (data) => dispatch(actions.SendMessage(data)),
  callrefused: () => dispatch(actions.callrefused()),
});

const Message = forwardRef(({ message, uid }, ref) => {
  return (
    <div
      ref={ref}
      class={`message ${message.data.senderId == uid ? `sent` : `received`}`}
    >
      <span>{message.data.message}</span>
      <span class="metadata">
        <span class="time">
          {moment(message.data.time?.toDate()).format("h:mm A")}
        </span>
      </span>
    </div>
  );
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageIns);
