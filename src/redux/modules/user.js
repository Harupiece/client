import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { deleteCookie, setCookie, getCookie} from '../../shared/Cookie';
import { UserApis } from '../../shared/api';

// action
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';
const SET_USER = "user/SET_USER";

// action creator
const setLogin = createAction(LOGIN, (user) => ({ user }));
const logOut = createAction(LOGOUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (userInfo) => ({userInfo}))

const initialState = {
	isLogin: false,
	userInfo :{
		memberId: null,
		nickname: null,
		point: null,
		profileImg: null,
	}
};

// Thunk
const registerDB = (email, nick, pw, pwc ,profileImg) => {
	return function (dispatch, getState, { history }) {
		UserApis
		.signup(email, nick, pw, pwc ,profileImg)
		.then((res) => {
			window.alert("회원가입이 완료되었습니다!");
			history.push('/login');
		})
		.catch((err) => {
			console.log(err);
		});
	};
};

const setLoginDB = (email, pwd ) => {
	return function (dispatch, getState, { history }) {
		UserApis
			.login(email, pwd)
			.then((res) => {
				setCookie('token', res.data.accessToken,1,"/");
				dispatch(setUser(res.data.userInfo));
				history.replace('/');
			})
			.catch((err) => {
				console.log(err);
				window.alert('회원정보가 없거나 아이디 비밀번호가 일치 하지 않습니다');
			});
	};
};

const logOutDB = () => {
	return function (dispatch, getState, { history }) {
		deleteCookie('token');
		dispatch(logOut());
		history.replace('/login');
	};
};

const loginCheckDB = () => {
	return function (dispatch, getState, { history }) {
		UserApis
		.relaod()
		.then((res) =>{
			dispatch(setUser(res.data.userInfo));
		})
	};
};


export default handleActions(
	{
		[LOGIN]: (state, action) =>produce(state, (draft) => {
			draft.isLogin = true;
		}),
		[LOGOUT]: (state, action) => produce(state, (draft) => {
			draft.user = null;
			draft.isLogin = false;
		}),
		[SET_USER]: (state, action) =>produce(state, (draft) => {
			draft.userInfo = action.payload.userInfo;
			draft.isLogin = true;
		}),

	},
	initialState,
);

const userCreators = {
	registerDB,
	setLoginDB,
	logOutDB,
	loginCheckDB,
};


export { userCreators };