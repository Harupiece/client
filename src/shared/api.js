import axios from "axios";
import { setCookie, getCookie } from "./Cookie";

const instance = axios.create({
  // baseURL: "http://54.180.141.39/",
  baseURL: "https://api.harupiece.com/",
  headers: {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json,",
  },
});

const getAccessToken = () => {
  const accessToken = getCookie("token");
  return accessToken;
};

const getRefreshToken = () => {
  const refreshToken = getCookie("refreshToken");
  return refreshToken;
};

let isTokenRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.map((callback, idx) => {
    return callback(accessToken);
  });
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
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

    if (originalConfig.url !== "api/member/login" && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        if (!isTokenRefreshing) {
          isTokenRefreshing = true;

          const rs = await refreshTokens();
          const { accessToken, refreshToken } = rs.data;

          setCookie("token", accessToken);
          setCookie("refreshToken", refreshToken);

          isTokenRefreshing = false; // 토큰 생성중 상태를 fasle로 바꿔주고

          instance.defaults.headers.common.Authorization = ` Bearer ${accessToken}`;
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;

          onTokenRefreshed(accessToken); // 첫 요청이 아닌 다른 쌓여있던 요청 다시 요청보내기
          refreshSubscribers = []; // 요청 배열 초기화
          return instance(originalConfig); // 첫 요청 다시 요청
        }
        const retryOriginalRequest = new Promise((resolve) => {
          addRefreshSubscriber((accessToken) => {
            originalConfig.headers.Authorization = "Bearer " + accessToken;
            resolve(instance(originalConfig));
          });
        });
        return retryOriginalRequest;
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
  guestMain: () => instance.get(`/api/guest/main`),
  search: (searchWords) => instance.get(`/api/guest/search/${searchWords}/1`),
  searchFilter: (categoryName, period, progress) =>
    instance.get(`/api/guest/search/${categoryName}/${period}/${progress}/1`),
};

// 인증샷 포스팅
export const PostApis = {
  getPost: (page, challengeId) =>
    instance.get(`/api/posting/${page}/${challengeId}`),
  addPost: (new_post) => instance.post("/api/posting", new_post),
  editPost: (post_id, post) =>
    instance.put(`/api/posting/update/${post_id}`, post),
  deletePost: (post_id) => instance.delete(`/api/posting/delete/${post_id}`),
  clickCheck: (check_info) => instance.post("/api/certification", check_info),
};

// 챌린지 상세페이지
export const ChallengeDetailApis = {
  getDetail: (challenge_id) =>
    instance.get(`/api/guest/challenge/${challenge_id}`),
  editDetail: (challengeInfo) =>
    instance.put(`/api/member/challenge`, challengeInfo),
  adminDeleteDetail: (challenge_id) =>
    instance.delete(`/api/admin/challenge/${challenge_id}`),
  deleteDetail: (challenge_id) =>
    instance.delete(`/api/member/challenge/${challenge_id}`),
  giveupChallenge: (challenge_id) =>
    instance.delete(`/api/member/challenge-give-up/${challenge_id}`),
  takeInPartChallenge: (challengeInfo) =>
    instance.post(`/api/member/challenge-request`, challengeInfo),
};

// 마이 페이지
export const MypageApis = {
  editProfile: (proFile) => instance.put(`/api/member/mypage/profile`, proFile),
  getMyInfo: () => instance.get(`/api/member/mypage`),
  getPoint: () => instance.get(`/api/member/mypage/history`),
  changePassword: (password) =>
    instance.put(`/api/member/mypage/password`, password),
};

// 채팅방
export const ChatApis = {
  getMessages: (challenge_id, page) =>
    instance.get(`/chat/messages/${challenge_id}?page=${page}`),
};

export default instance;
