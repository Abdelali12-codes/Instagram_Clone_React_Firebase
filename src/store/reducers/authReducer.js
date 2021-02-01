import * as actions from "../actions/actionTypes";

const initiaState = {
  succes: false,
  error: false,
  photoUrl: null,
  token: null,
  notification: null,
  loading: false,
  messagenotification: false,
  callrefused: false,
};

const authReducer = (state = initiaState, action) => {
  switch (action.type) {
    case actions.LOGIN_SUCCES:
      return { ...state, succes: true };

    case actions.LOGIN_ERROR:
      return { ...state, error: true };

    case actions.SIGNOUT_SUCCES:
      return { ...state, succes: true };

    case actions.SIGNUP_ERROR:
      return { ...state, error: true };
    case actions.SIGNUP_SUCCES:
      return { ...state, succes: true };
    case actions.PHOTO_URL:
      return { ...state, photoUrl: action.url };
    case actions.MESSAGING_TOKEN:
      return { ...state, token: action.token };
    case actions.SEND_NOTIFICATIONS:
      return { ...state, notification: action.payload };
    case actions.PAGE_LOADING:
      return { ...state, loading: false, err: action.err };
    case actions.PAGE_LOADED:
      return { ...state, loading: true };
    case actions.SHOW_NOTIFICATIONS:
      return { ...state, messagenotification: true };
    case actions.HIDE_NOTIFICATIONS:
      return { ...state, messagenotification: false };
    case actions.CALL_REFUSED:
      return { ...state, callrefused: true };
    default:
      return state;
  }
};

export default authReducer;
