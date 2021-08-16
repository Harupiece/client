import axios from "axios";
import { setCookie, getCookie, multiCookie } from "./Cookie";

const instance = axios.create({
  // baseURL: "http://54.180.141.39/",
  baseURL: "http://34.64.75.241/",
  headers: {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json,",
  },
});

// instance.interceptors.request.use(function (config) {
//   const accessToken = getCookie("token");
//   config.headers.common["Authorization"] = ` Bearer ${accessToken}`;
//   return config;
// });

const getAccessToken = () => {
  const accessToken = getCookie("token");
  return accessToken;
};

const getRefreshToken = () => {
  const refreshToken = getCookie("refreshToken");
  return refreshToken;
};

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = ` Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      if (
        err.response.status === 401 &&
        err.response.data.message === "No message available" &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;
        try {
          const rs = await refreshTokens();
          console.log(rs);
          const { accessToken, refreshToken } = rs.data;
          setCookie("token", accessToken);
          setCookie("refreshToken", refreshToken);
          instance.defaults.headers.common[
            "Authorization"
          ] = ` Bearer ${accessToken}`;
          return instance(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }
    return Promise.reject(err);
  }
);

const refreshTokens = () => {
  return instance.post("/api/member/reissue", {
    refreshToken: getRefreshToken(),
    accessToken: getAccessToken(),
  });
};

// 유저 정보
export const UserApis = {
  login: (email, password) =>
    instance.post("api/member/login", { email, password }),
  signup: (email, nickname, password, passwordConfirm, profileImg) =>
    instance.post("api/member/signup", {
      email,
      nickname,
      password,
      passwordConfirm,
      profileImg,
    }),
  reload: () => instance.get("api/member/reload"),
};

// 챌린지 생성
export const ChallengeCreateApis = {
  GetThumnail: (category) => instance.get(`/api/category-image/${category}`),
  CreateChallenge: (challengeInfo) =>
    instance.post(`/api/member/challenge`, challengeInfo),
};

// 메인 화면
export const MainApis = {
  guestMain: () => instance.get(`api/guest/main`),
  userMain: () => instance.get(`api/member/main`),
  search: (searchWords) => instance.get(`api/guest/search/1/${searchWords}`),
  searchCategory: (categoryName) =>
    instance.get(`/api/guest/challenge/category/1/${categoryName}`),
  searchAll: () => instance.get(`/api/guest/challenge-all/1`),
};

// 인증샷 포스팅
export const PostApis = {
  getPost: (page, challengeId) =>
    instance.get(`api/posting/${page}/${challengeId}`),
  addPost: (new_post) => instance.post("api/posting", new_post),
  editPost: (post_id, post) =>
    instance.put(`api/posting/update/${post_id}`, post),
  deletePost: (post_id) => instance.delete(`api/posting/delete/${post_id}`),
  clickCheck: (check_info) => instance.post("api/certification", check_info),
};

// 챌린지 상세페이지
export const ChallengeDetailApis = {
  getDetail: (challenge_id) =>
    instance.get(`api/guest/challenge/${challenge_id}`),
  editDetail: (challengeInfo) =>
    instance.put(`api/member/challenge`, challengeInfo),
  adminDeleteDetail: (challenge_id) =>
    instance.delete(`api/admin/challenge/${challenge_id}`),
  deleteDetail: (challenge_id) =>
    instance.delete(`api/member/challenge/${challenge_id}`),
  giveupChallenge: (challenge_id) =>
    instance.delete(`api/member/challenge-give-up/${challenge_id}`),
  takeInPartChallenge: (challengeInfo) =>
    instance.post(`api/member/challenge-request`, challengeInfo),
};

// 마이 페이지
export const MypageApis = {
  editProfile: (proFile) => instance.put(`/api/member/mypage/profile`, proFile),
  getMyInfo: () => instance.get(`api/member/mypage`),
  getProceed: () => instance.get(`/api/member/mypage/proceed`),
  getEnd: () => instance.get(`/api/member/mypage/end`),
  getPoint: () => instance.get(`api/member/mypage/history`),
  changePassword: (password) =>
    instance.put(`/api/member/mypage/password`, password),
};

// 채팅방
export const ChatApis = {
  getMessages: (challenge_id) => instance.get(`/chat/messages/${challenge_id}`),
};

export default instance;
