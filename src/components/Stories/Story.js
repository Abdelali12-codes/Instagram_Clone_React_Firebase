import React, { useEffect, useState } from "react";
import firebase from "../../config/Firebase";
import "./Story.css";
import logo from "../../images/story.jpg";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Progress = styled.div`
  position: relative;
  width: 390px;
  height: 3vh;
  display: grid;
  box-sizing: border-box;
  background: ${(props) => (props.white ? "white" : "red")};
  grid-template-columns: ${(props) =>
    `repeat(${props.length}, calc(100%/${props.length}))`};
  grid-gap: 0 3px;
`;
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

const Story = ({ userid, stories }) => {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const [autoplay, setAutoplay] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  // const maxSteps = photourls?.length
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const handlecloseDialog = () => {
    setOpen((prevopen) => !prevopen);
  };
  const handleOpenDialog = () => {
    setOpen((prevopen) => !prevopen);
    const progress = document.querySelector(`.progress-bar-inner${0}`);
    if (progress) {
      progress.classList.toggle("activedbar");
    }
    console.log(progress);
  };
  const handleUserProfile = (id) => {
    history.push(`/userprofile/${id}`);
  };
  const handleTransitionEnd = () => {
    if (activeStep == 0) {
      setOpen(false);
    }
  };

  const handleClick = () => {
    setAutoplay((prevo) => !prevo);
  };
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .onSnapshot((snapshot) => {
        setUser(snapshot.data());
      });
  }, [userid]);
  useEffect(() => {
    const progress = document.querySelector(`.progress-bar-inner${activeStep}`);

    if (progress && !progress.classList.contains("activedbar")) {
      progress.classList.add("activedbar");

      if (activeStep == 0) {
        document
          .querySelector(`.progress-bar-inner${stories?.length - 1}`)
          .classList.remove("activedbar");
      }
    }
  }, [activeStep]);

  return (
    <>
      <div className="circle__inner" onClick={handleOpenDialog}>
        <div className="circle__inner__inner">
          {user && (
            <img
              className="circle__img"
              src={user.photourl}
              alt=""
              width="70px"
              height="70px"
            />
          )}
        </div>
        <div className="story__user">
          <span>{user && user.username}</span>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handlecloseDialog}
        // onTransitionEnd={handleTransitionEnd}
      >
        <div className="story__item__click">
          <div className="story__indicator">
            <Progress length={stories?.length} white>
              <div className="progress-bar stripes">
                <span className={`${`progress-bar-inner0 activedbar`}`}></span>
              </div>
              {Array(stories?.length - 1)
                .fill(0)
                .map((item, index) => {
                  return (
                    <div className="progress-bar stripes">
                      <span
                        className={`${`progress-bar-inner${index + 1}`}`}
                      ></span>
                    </div>
                  );
                })}
            </Progress>
            <div className="story__info">
              {user && <Avatar src={user.photourl} alt="" />}
              {user && (
                <span
                  className="username"
                  onClick={() => handleUserProfile(userid)}
                >
                  {user.username}
                </span>
              )}
              {stories && (
                <span>
                  {" "}
                  {moment(stories[activeStep].data.time.toDate()).fromNow()}
                </span>
              )}
            </div>
          </div>
          <div className="story__item__click__photo">
            <AutoPlaySwipeableViews
              //  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
              style={{ height: "400px" }}
              interval={4000}
              onClick={handleClick}
              autoplay={autoplay}
              onTouchStart={() => alert("hhh")}
              onTransitionEnd={handleTransitionEnd}
            >
              {stories?.map((step, index) => (
                <div>
                  {Math.abs(activeStep - index) <= 5 ? (
                    <img className={classes.img} src={step.data.storyphoto} />
                  ) : (
                    console.log("stop")
                  )}
                </div>
              ))}
            </AutoPlaySwipeableViews>
            {/* {storyurl && <img src={storyurl} alt=''/>} */}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Story;
