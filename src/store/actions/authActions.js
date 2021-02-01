import * as actions from "./actionTypes";
import { el } from "date-fns/locale";

export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_ERROR", err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out");
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };
};

export const signUp = (data) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  var uid;
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);
    dispatch({ type: actions.SIGNUP_SUCCES });
    uid = firebase.auth().currentUser.uid;

    firestore
      .collection("users")
      .doc(uid)
      .set({
        firstNamesearch: data.firstName.toLowerCase(),
        lastNamesearch: data.lastName.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        initials: data.firstName[0] + data.lastName[0],
        photourl: "",
        username: "",
        followers: [],
        following: [],
        postsliked: [],
        postssaved: [],
        rooms: [],
        token: "",
        blockedusers: [],
        blocked: [],
        userRole: false,
        callrefused: false,
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        alert(err.message);
      });

    await firestore;
  } catch (err) {
    dispatch({ type: actions.SIGNUP_ERROR, err });
  }
};

export const PhotoUrl = (data) => (dispatch) => {
  dispatch({ type: actions.PHOTO_URL, url: data });
};

export const Send_Token = (data) => (dispatch) => {
  dispatch({ type: actions.MESSAGING_TOKEN, token: data });
};

export const sendNotification = () => (dispatch) => {
  dispatch({ type: actions.SHOW_NOTIFICATIONS });
};
export const SendMessage = (data) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  if (data.message.length > 0) {
    const firestore = getFirestore();
    // const id ='voF5nopq0CWMqCkmvEv82cbSfYt1'
    firestore
      .collection("rooms")
      .doc(data.roomId)
      .collection("messages")
      .add({
        message: data.message,
        senderId: data.uid,
        time: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("message added succefully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
export const sendMessageRoom = (data) => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  if (data.message.length > 0) {
    const firestore = getFirestore();
    firestore
      .collection("rooms")
      .doc(data.roomId)
      .collection("messages")
      .add({
        message: data.message,
        senderId: data.uid,
        time: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("the message added succefully");
      })
      .catch((err) => {
        console.log("error occured ", err);
      });
  }
};

export const Message = (data) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {};
export const SetProfile = (data) => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const { uid } = getState().firebase.auth;
  var bio = [];
  if (data.bio_item1) {
    bio = [...bio, data.bio_item1];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item2) {
    bio = [...bio, data.bio_item2];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item3) {
    bio = [...bio, data.bio_item3];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item4) {
    bio = [...bio, data.bio_item4];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_link) {
    bio = [...bio, data.bio_link];
  } else {
    bio = [...bio, ""];
  }

  firestore
    .collection("users")
    .doc(uid)
    .update({
      username: data.username,
      bio: bio,
    })
    .then(() => {
      console.log("the profile is setted");
    })
    .catch((err) => {
      console.log(err);
    });
};
export const UpdateProfile = (data) => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const { uid } = getState().firebase.auth;
  var bio = [];
  if (data.bio_item1) {
    bio = [...bio, data.bio_item1];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item2) {
    bio = [...bio, data.bio_item2];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item3) {
    bio = [...bio, data.bio_item3];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_item4) {
    bio = [...bio, data.bio_item4];
  } else {
    bio = [...bio, ""];
  }

  if (data.bio_link) {
    bio = [...bio, data.bio_link];
  } else {
    bio = [...bio, ""];
  }
  //  alert(bio)
  //  alert(uid)
  firestore
    .collection("users")
    .doc(uid)
    .update({
      username: data.username,
      bio: bio,
    })
    .then(() => {
      console.log("bio updated");
      //  dispatch({type : actions.PAGE_LOADED})
    })
    .catch((err) => {
      console.log("bio is not updated");
      dispatch({ type: actions.PAGE_LOADING, err: err.message });
    });
};

export const pageuploaded = () => (dispatch, getState) => {
  dispatch({ type: actions.PAGE_LOADING });
};

export const callrefused = () => (dispatch) => {
  dispatch({ type: actions.CALL_REFUSED });
};
