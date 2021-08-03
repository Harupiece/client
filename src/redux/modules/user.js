import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { deleteCookie, setCookie, getCookie, multiCookie } from "../../shared/Cookie";
import { UserApis } from "../../shared/api";
import { MainCreators } from "./main";
import instance from "../../shared/api";

// action
const LOGIN = "user/LOGIN";
const LOGOUT = "user/LOGOUT";
const SET_USER = "user/SET_USER";

// action creator
const setLogin = createAction(LOGIN, (user) => ({ user }));
const logOut = createAction(LOGOUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (userInfo) => ({ userInfo }));

const initialState = {
  isLogin: false,
  userInfo: {
    memberId: null,
    nickname: null,
    point: null,
    profileImg: null,
  },
};

// 회원가입
const registerDB = ({email, nickname, password, passwordConfirm, profileImg}) => {
  return function (dispatch, getState, { history }) {
    UserApis.signup(email, nickname, password, passwordConfirm, profileImg)
      .then((res) => {
        console.log(res)
        window.alert("회원가입이 완료되었습니다!");
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

//로그인
const setLoginDB = ({email, password}) => {
  return function (dispatch, getState, { history }) {
    UserApis.login(email, password)
      .then((res) => {
        console.log(res);
        setCookie("token", res.data.accessToken, 1, "/");
        setCookie("refreshToken", res.data.refreshToken, 1, "/");
        dispatch(setUser(res.data.userInfo));
        dispatch(MainCreators.guestLoad(null));
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
        window.alert("회원정보가 없거나 아이디 비밀번호가 일치 하지 않습니다");
      });
  };
};

//로그아웃
const logOutDB = () => {
  return function (dispatch, getState, { history }) {
    deleteCookie("token");
    deleteCookie("refreshToken");
    dispatch(logOut());
    dispatch(MainCreators.guestLoadDB());
    history.replace("/");
  };
};

//새로고침시 로그인 유지
const loginCheckDB = () => {
  return function (dispatch, getState, { history }) {
    const user_info = getState().user.userInfo
    if (getCookie("token")&& !user_info){
      history.replace("/login");
    }
    UserApis.reload()
      .then((res) => {
        dispatch(setUser(res.data.userInfo));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default handleActions(
  {
    [LOGIN]: (state, action) =>
      produce(state, (draft) => {
        draft.isLogin = true;
      }),
    [LOGOUT]: (state, action) =>
      produce(state, (draft) => {
        draft.userInfo = null;
        draft.isLogin = false;
      }),
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.userInfo = action.payload.userInfo;
        draft.isLogin = true;
      }),
  },
  initialState
);

const userCreators = {
  registerDB,
  setLoginDB,
  logOutDB,
  loginCheckDB,
  setUser,
};

export { userCreators };
