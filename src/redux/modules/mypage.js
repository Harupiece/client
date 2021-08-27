import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { MypageApis } from "../../shared/api";
import AWS from "aws-sdk";
import { userCreators } from "./user";
import { consoleLogger } from "../configureStore";

const GET_MYINFO = "GET_MYINFO";
const EDIT_MYPROFILE = "EDIT_MYPROFILE";
const SET_PREVIEW = "SET_PREVIEW";
const LOADING = "LOADING";

const getInfo = createAction(GET_MYINFO, (myInfo, myChallenge) => ({
  myInfo,
  myChallenge,
}));
const editMyProfile = createAction(EDIT_MYPROFILE, (myInfo) => ({
  myInfo,
}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  myInfo: {},
  preview: null,
  is_loading: false,
};

const getMyInfoDB = () => {
  return function (dispatch, getState, { history }) {
    dispatch(loading(true));
    MypageApis.getMyInfo()
      .then((res) => {
        consoleLogger("point history 요청 후 응답", res);

        const memberHistoryResponseDto = {
          level: res.data.memberHistoryResponseDto.level,
          rank: res.data.memberHistoryResponseDto.rank,
          memberId: res.data.memberHistoryResponseDto.memberId,
          nickname: res.data.memberHistoryResponseDto.nickname,
          point: res.data.memberHistoryResponseDto.point,
          profileImage: res.data.memberHistoryResponseDto.profileImage,
          pointHistoryList: [
            ...res.data.memberHistoryResponseDto.challengeGetpoint,
            ...res.data.memberHistoryResponseDto.postingGetpoint,
          ],
        };
        dispatch(getInfo({ ...res.data, memberHistoryResponseDto }));
      })
      .catch((error) => {
        if (window.confirm("사용자 정보를 받아올수없습니다.")) {
          history.push("/home");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

const getPointDB = () => {
  return function (dispatch, getState, { history }) {
    MypageApis.getMyInfo()
      .then((res) => {
        consoleLogger("point history 요청 후 응답", res);
        const pointHistoryList = [
          ...res.data.memberHistoryResponseDto.challengeGetpoint,
          ...res.data.memberHistoryResponseDto.postingGetpoint,
        ];
        const myInfo = {
          level: res.data.memberHistoryResponseDto.level,
          rank: res.data.memberHistoryResponseDto.rank,
          memberId: res.data.memberHistoryResponseDto.memberId,
          nickname: res.data.memberHistoryResponseDto.nickname,
          profileImage: res.data.memberHistoryResponseDto.profileImage,
          pointHistoryList,
        };
        dispatch(getInfo(myInfo));
      })
      .catch((error) => {
        if (window.confirm("포인트 정보를 찾을수가 없어요ㅜㅜ")) {
          history.push("/home");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

const editMyProfileDB = (content) => {
  return function (dispatch, getState, { history }) {
    const myProfileImg =
      getState().mypage.myInfo.memberHistoryResponseDto.profileImage;

    const blank_check = /[\s]/g;

    if (blank_check.test(content.newNickName)) {
      setTimeout(() => window.alert("공백은 사용할 수 없습니다!"), 300);
      return;
    }

    dispatch(loading(true));

    if (content.levelImage) {
      console.log("파일은 없고 레벨이미지만 있을 때");
      const levelProfile = {
        nickname: content.newNickName,
        profileImage: content.levelImage,
      };

      MypageApis.editProfile(levelProfile)
        .then((res) => {
          consoleLogger("프로필 이미지를 등급 구슬로 설정할 때: ", res);

          dispatch(editMyProfile(levelProfile));

          const user_info = getState().user.userInfo;

          const new_user_info = {
            ...user_info,
            nickname: levelProfile.nickname,
            profileImg: levelProfile.profileImage,
          };
          dispatch(userCreators.setUser(new_user_info));
          dispatch(getMyInfoDB());
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            setTimeout(() => window.alert(error.response?.data?.message), 300);
          } else if (error) {
            setTimeout(
              () =>
                window.alert(
                  "프로필 수정 중 오류가 발생했습니다. 다시 한번 시도해주세요!"
                ),
              300
            );
          }
          consoleLogger("프로필 이미지를 등급 구슬로 설정할 때: ", error);
        });
    } else if (content.file === myProfileImg) {
      const proFile = {
        nickname: content.newNickName,
        profileImage: content.file,
      };
      MypageApis.editProfile(proFile)
        .then((res) => {
          consoleLogger("글 내용만 수정하고 server에 전송후 응답: ", res);
          const new_post = {
            ...proFile,
            nickname: content.newNickName,
            profileImage: myProfileImg,
          };

          dispatch(editMyProfile(new_post));

          const user_info = getState().user.userInfo;

          const new_user_info = {
            ...user_info,
            ...new_post,
            profileImg: new_post.profileImage,
          };
          dispatch(userCreators.setUser(new_user_info));
          dispatch(getMyInfoDB());
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            setTimeout(() => window.alert(error.response?.data?.message), 300);
          } else if (error) {
            setTimeout(
              () =>
                window.alert(
                  "프로필 수정 중 오류가 발생했습니다. 다시 한번 시도해주세요!"
                ),
              300
            );
          }
          consoleLogger("사진은 그대로고 닉네임만 수정 했을 때: ", error);
        });
    } else if (!content.levelImage) {
      //프로필 사진, 닉네임 둘다 바꿀 때
      if (!content.file) {
        return;
      }
      const date = new Date();
      const user_info = getState().user.userInfo;

      AWS.config.update({
        region: "ap-northeast-2",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: `${process.env.REACT_APP_AWS_KEY}`,
        }),
      });

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: "onedaypiece-shot-image",
          Key: `${user_info.memberId}_${date.getTime()}.jpg`,
          Body: content.file,
        },
      });

      const promise = upload.promise();
      promise
        .then((data) => {
          const proFile = {
            nickname: content.newNickName,
            profileImage: content.file,
          };

          const newProFile = { ...proFile, profileImage: data.Location };

          MypageApis.editProfile(newProFile)
            .then((res) => {
              const _newProFile = { ...newProFile };

              dispatch(editMyProfile(_newProFile));

              const user_info = getState().user.userInfo;

              const new_user_info = {
                ...user_info,
                ...newProFile,
                profileImg: newProFile.profileImage,
              };
              dispatch(userCreators.setUser(new_user_info));
              dispatch(getMyInfoDB());
            })
            .catch((error) => {
              if (error.response?.data?.message) {
                setTimeout(
                  () => window.alert(error.response?.data?.message),
                  300
                );
              } else if (error) {
                setTimeout(
                  () =>
                    window.alert(
                      "프로필 수정 중 오류가 발생했습니다. 다시 한번 시도해주세요!"
                    ),
                  300
                );
              }
              consoleLogger("사진 닉네임 둘다 수정 했을 때: ", error);
            });
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            setTimeout(() => window.alert(error.response?.data?.message), 300);
          } else if (error) {
            setTimeout(
              () =>
                window.alert(
                  "이미지 업로드 중 오류가 발생했습니다. 다시 한번 시도해주세요!"
                ),
              300
            );
          }
          consoleLogger("aws이미지 업로드: ", error);
        });
    }
  };
};

const changePasswordDB = (password) => {
  return function (dispatch, getState, { history }) {
    const passwordList = {
      currentPassword: password.oldPassword,
      newPassword: password.newPassword,
      newPasswordCheck: password.newPasswordConfirm,
    };
    MypageApis.changePassword(passwordList)
      .then((res) => {
        consoleLogger("비밀번호 변경 후 응답", res);
        setTimeout(() => window.alert("비밀번호 변경이 완료되었습니다!"), 300);
        history.replace("/home");
      })
      .catch((error) => {
        if (
          error.response?.data?.message === "현재 비밀번호가 일치하지 않습니다."
        ) {
          setTimeout(() => window.alert(error.response?.data?.message), 300);
        } else {
          setTimeout(
            () =>
              window.alert(
                "비밀번호 변경 중 오류가 발생했어요! 새로고침 후 다시 시도해주세요!"
              ),
            300
          );
        }
        console.log(error);
      });
  };
};

export default handleActions(
  {
    [GET_MYINFO]: (state, action) =>
      produce(state, (draft) => {
        let myInfo = action.payload.myInfo;
        if (myInfo.profileImage === "") {
          myInfo = {
            ...action.payload.myInfo,
            profileImage:
              "https://onedaypiece-shot-image.s3.ap-northeast-2.amazonaws.com/green.svg",
          };
        }
        draft.myInfo = myInfo;
        draft.is_loading = false;
      }),
    [EDIT_MYPROFILE]: (state, action) =>
      produce(state, (draft) => {
        draft.myInfo = action.payload.myInfo;
      }),
    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getInfo,
  editMyProfile,
  getMyInfoDB,
  editMyProfileDB,
  changePasswordDB,
  setPreview,
  getPointDB,
};

export { actionCreators };
