import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Story from "./Story";
import "./Header.css";
import firebase from "../../config/Firebase";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import $ from "jquery";
import moment from "moment";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import UserStory from "./UserStory";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "10vh",
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 350,
    display: "block",

    overflow: "hidden",
    width: "400px",
  },
}));

const Progress = styled.div`
  position: relative;
  width: 400px;
  height: 3vh;
  display: grid;
  box-sizing: border-box;
  background: ${(props) => (props.white ? "white" : "red")};
  grid-template-columns: ${(props) =>
    `repeat(${props.length}, calc(100%/${props.length}))`};
  grid-gap: 0 2px;
`;
const Header = ({ auth: { uid }, profile: { photourl, username } }) => {
  const classes = useStyles();
  const [stories, setStories] = useState({});
  const [obj, setObj] = useState({});
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [storie, setStorie] = useState([]);
  const [storieexist, setStoryexist] = useState(false);
  const history = useHistory();

  const handleInputfiles = (uid) => (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        handleChange(files[i], uid);
      }
    }
  };
  const handleUserProfile = (id) => {
    history.push(`/userprofile/${id}`);
  };
  const handleChange = (file, uid) => {
    const userstorie = {
      storyphoto: "",
      time: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const stories = {
      storycreated: uid,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      storyphoto: [],
      photourl: "",
    };

    // var file = e.target.files[0]
    var storageRef = firebase.storage().ref(file.name);
    var uploadTask = storageRef.put(file);
    // var photo = document.querySelector('progress') ;
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      // function handling errors
      (error) => {},
      // Handle successful uploads on Complete
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
          return firebase
            .firestore()
            .collection("stories")
            .add({
              ...stories,
              storyphoto: downloadUrl,
            })
            .then((docRef) => {
              return firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("stories")
                .doc(docRef.id)
                .set({
                  ...userstorie,
                  storyphoto: downloadUrl,
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  };
  $("#imageUpload").change(function () {
    readURL(this);
  });
  const readURL = (input) => {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css("background-image", `url(${e.target.result})`);
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const handleOpenDialog = (uid) => {
    firebase
      .firestore()
      .collection("stories")
      .where("storycreated", "==", `${uid}`)
      .onSnapshot((querysnapshot) => {
        setStorie(
          querysnapshot.docs
            .map((doc) => ({ id: doc.id, data: doc.data() }))
            .filter(
              (doc) =>
                moment(doc.data?.time?.toDate()).startOf("hour").fromNow() !=
                "a day ago"
            )
        );
      });
    if (storie.length > 0) {
      setOpen((prevopen) => !prevopen);
    }
  };
  const handleClose = () => {
    setOpen((prevopen) => !prevopen);
  };

  useEffect(() => {
    // const user = firebase.firestore().collection()
    firebase
      .firestore()
      .collection("stories")
      .onSnapshot((snapshot) => {
        firebase
          .firestore()
          .collection("stories")
          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              //   if(change.type == 'added' || change.type == 'removed'){
              uid &&
                firebase
                  .firestore()
                  .collection("users")
                  .doc(uid)
                  .onSnapshot((snapshot) => {
                    var items = {};
                    const length = snapshot.data()?.following.length;
                    var j = 0;
                    snapshot.data().following.forEach((id) => {
                      firebase
                        .firestore()
                        .collection("stories")
                        .where("storycreated", "==", `${id}`)
                        .onSnapshot((querySnapshot) => {
                          // if (querySnapshot.docs.length > 0) {
                          console.log("the stories exist ");
                          items = {
                            ...items,
                            [id]: querySnapshot.docs.map((doc) => ({
                              id: doc.id,
                              data: doc.data(),
                            })),
                          };

                          j++;
                          if (j == length) {
                            firebase
                              .firestore()
                              .collection("users")
                              .doc(uid)
                              .update({
                                storiefollowing: items,
                              });
                          }
                          // }
                          // } else {
                          //   console.log("the stories do not exist");
                          //   firebase
                          //     .firestore()
                          //     .collection("users")
                          //     .doc(uid)
                          //     .update({
                          //       storiefollowing: {},
                          //     });
                          // }
                        });
                    });
                  });
            });
          });
      });
  }, []);
  useEffect(() => {
    firebase
      .firestore()
      .collection("stories")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          if (
            moment(doc.data()?.time?.toDate()).startOf("hour").fromNow() ==
              "a day ago" ||
            moment(doc.data()?.time?.toDate()).startOf("hour").fromNow() ==
              "2 days ago" ||
            moment(doc.data()?.time?.toDate()).startOf("hour").fromNow() ==
              "3 days ago"
          ) {
            firebase
              .firestore()
              .collection("stories")
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log("done");
              });
          }
        });
      });
  }, []);
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setStories(snapshot.data().storiefollowing);
      });
  }, []);
  useEffect(() => {
    firebase
      .firestore()
      .collection("stories")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type == "added" || change.type == "removed") {
            const preview = document.querySelector(`.avatar-previe-border`);
            const label = document.querySelector(".label__image");
            firebase
              .firestore()
              .collection("stories")
              .where("storycreated", "==", `${uid}`)
              .onSnapshot((querySnapshot) => {
                setStoryexist(
                  querySnapshot.docs
                    .map((doc) => doc.data())
                    .filter(
                      (data) =>
                        moment(data?.time?.toDate())
                          .startOf("hour")
                          .fromNow() != "a day ago"
                    ).length > 0
                );
              });
            if (storieexist) {
              preview.style.border = "3px solid #cd486b";
              label.style.right = "-7px";
            } else {
              preview.style.border = "none";
            }
          }
        });
      });
  }, [storieexist]);
  const handleTransitionEnd = () => {};
  return (
    <>
      <div className="story__wrapper">
        <div className="circle">
          <div className="avatar-uploa">
            <div className="avatar-edi">
              <input
                type="file"
                id="imageUploa"
                accept="image/*"
                onChange={handleInputfiles(uid)}
                multiple
              />
              {/* onChange={handleChange(uid)} */}
              <label htmlFor="imageUploa" className="label__image">
                <IconButton component="span" color="primary">
                  <AddCircleOutlinedIcon />
                </IconButton>
              </label>
            </div>
            <div
              className="avatar-previe-border"
              onClick={() => handleOpenDialog(uid)}
            >
              <div className="avatar-previe">
                {<img src={photourl} alt="" width="80px" height="80px" />}
              </div>
            </div>
          </div>

          {stories &&
            Object.keys(stories).map((key) => {
              return stories[key].length > 0 ? (
                <Story userid={key} stories={stories[key]} key={key} />
              ) : null;
            })}
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} scroll="body">
        <div className="story__item__click">
          <div className="story__indicator">
            <UserStory
              storie={storie}
              photourl={photourl}
              handleUserProfile={handleUserProfile}
              uid={uid}
              activeStep={activeStep}
              username={username}
              handleTransitionEnd={handleTransitionEnd}
            />
          </div>
          <div className="story__item__click__photo">
            <AutoPlaySwipeableViews
              //  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
              interval={4000}
              onTransitionEnd={handleTransitionEnd}
            >
              {storie?.map((step, index) => (
                <div>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <img className={classes.img} src={step.data.storyphoto} />
                  ) : null}
                </div>
              ))}
              {}
            </AutoPlaySwipeableViews>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});
export default connect(mapStateToProps)(Header);
