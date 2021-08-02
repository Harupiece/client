import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { MypageApis } from "../../shared/api";
import AWS from "aws-sdk";
import { userCreators } from "./user";

const GET_MYINFO = "GET_MYINFO";
const EDIT_MYPROFILE = "EDIT_MYPROFILE";
const SET_PREVIEW = "SET_PREVIEW";

const getInfo = createAction(GET_MYINFO, (myInfo, myChallenge) => ({
  myInfo,
  myChallenge,
}));
const editMyProfile = createAction(EDIT_MYPROFILE, (myInfo) => ({
  myInfo,
}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

const initialState = {
  myInfo: {},
  preview: null,
};

const getMyInfoDB = () => {
  return function (dispatch, getState, { history }) {
    MypageApis.GetMyInfo()
      .then((res) => dispatch(getInfo(res.data)))
      .catch((error) => {
        if (window.confirm("사용자 정보를 받아올수없습니다.")) {
          history.push("/");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

const getProceedDB = () => {
  return function (dispatch, getState, { history }) {
    MypageApis.GetProceed()
      .then((res) => dispatch(getInfo(res.data)))
      .catch((error) => {
        if (window.confirm("사용자 정보를 받아올수없습니다.")) {
          history.push("/");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

const getEndDB = () => {
  return function (dispatch, getState, { history }) {
    MypageApis.GetEnd()
      .then((res) => dispatch(getInfo(res.data)))
      .catch((error) => {
        if (window.confirm("사용자 정보를 받아올수없습니다.")) {
          history.push("/");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

const editMyProfileDB = (content) => {
  return function (dispatch, getState, { history }) {
    const myProfile = getState().mypage.myInfo.memberId;
    const myProfileImg = getState().mypage.myInfo.profileImg;

    const proFile = {
      memberId: myProfile,
      nickname: content.newNickName,
      profileImage: content.file,
    };

    if (content.file === myProfileImg) {
      MypageApis.EditProfile(proFile)
        .then((res) => {
          console.log("글 내용만 수정하고 server에 전송후 응답: ", res);
          const new_post = {
            ...proFile,
            nickname: content.newNickName,
            profileImage: content.file,
          };
          console.log(new_post);
          dispatch(editMyProfile(new_post));

          const user_info = getState().user.userInfo;

          const new_user_info = {
            ...new_post,
            profileImg: new_post.profileImage,
            memberLevel: user_info.memberLevel,
            point: user_info.point,
          };
          dispatch(userCreators.setUser(new_user_info));
        })
        .catch((error) => {
          if (
            window.confirm(
              "인증샷 수정에 문제가 있습니다ㅜㅜ 메인화면으로 돌아가도 될까요?"
            )
          ) {
            history.push("/");
          } else {
            history.goBack();
          }
          console.log("사진은 그대로고 멘트만 수정 했을 때: ", error);
        });
    } else {
      const date = new Date();

      AWS.config.update({
        region: "ap-northeast-2",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: `${process.env.REACT_APP_AWS_KEY}`,
        }),
      });

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: "onedaypiece-shot-image",
          Key: content.file + date + ".jpg",
          Body: content.file,
        },
      });

      const promise = upload.promise();
      promise.then((data) => {
        const newProFile = { ...proFile, profileImage: data.Location };

        MypageApis.EditProfile(newProFile)
          .then((res) => {
            const _newProFile = { ...newProFile };

            dispatch(editMyProfile(_newProFile));

            const user_info = getState().user.userInfo;

            const new_user_info = {
              ...newProFile,
              profileImg: newProFile.profileImage,
              memberLevel: user_info.memberLevel,
              point: user_info.point,
            };
            dispatch(userCreators.setUser(new_user_info));
          })
          .catch((error) => {
            if (window.confirm("test")) {
              history.push("/");
            } else {
              history.goBack();
            }
            console.log(error);
          });
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
    MypageApis.ChangePassword(passwordList)
      .then((res) => console.log(res))
      .catch((error) => {
        if (window.confirm("test")) {
          history.push("/");
        } else {
          history.goBack();
        }
        console.log(error);
      });
  };
};

export default handleActions(
  {
    [GET_MYINFO]: (state, action) =>
      produce(state, (draft) => {
        draft.myInfo = action.payload.myInfo;
      }),
    [EDIT_MYPROFILE]: (state, action) =>
      produce(state, (draft) => {
        draft.myInfo = action.payload.myInfo;
      }),
    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
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
  getProceedDB,
  getEndDB,
};

export { actionCreators };
