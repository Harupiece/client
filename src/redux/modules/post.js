import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import instance from "../../shared/api";
import { consoleLogger } from "../configureStore";
import { actionCreator as imageActions } from "./image";

import AWS from "aws-sdk";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({
  post,
}));
const editPost = createAction(EDIT_POST, (post_id, new_post) => ({
  post_id,
  new_post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [
    {
      postingId: 1,
      memberId: 1,
      nickName: "만주리아",
      profileImg:
        "https://user-images.githubusercontent.com/75834421/127079413-4362aacd-ce50-4576-8123-63cb36225d9e.png",
      postingImg:
        "https://user-images.githubusercontent.com/75834421/127076481-90fdc5d8-7461-4d87-83ef-608697e4f2eb.png",
      postingContent: "처음으로 해봤는 데 나름 괜찮았음",
      postingCount: 3,
      memberResponseDto: [1, 2, 3],
      postingApproval: true,
      postingModifyOk: true,
    },
    {
      postingId: 2,
      memberId: 2,
      nickName: "비건린이",
      profileImg:
        "https://user-images.githubusercontent.com/75834421/127079413-4362aacd-ce50-4576-8123-63cb36225d9e.png",
      postingImg:
        "https://user-images.githubusercontent.com/75834421/127076499-50a96a41-7b5f-45fb-84ea-5166666bde3e.png",
      postingContent: "난 이게 체질이 맞는 것 같아요!",
      postingCount: 2,
      memberResponseDto: [1, 2],
      postingApproval: true,
      postingModifyOk: true,
    },
    {
      postingId: 3,
      memberId: 3,
      nickName: "구슬을 모을테야",
      profileImg:
        "https://user-images.githubusercontent.com/75834421/127079413-4362aacd-ce50-4576-8123-63cb36225d9e.png",
      postingImg:
        "https://user-images.githubusercontent.com/75834421/127076537-33e58cc5-5fcf-4203-ad0e-a49b9027c07a.png",
      postingContent: "힘드네요...그래도 계속 해야지",
      postingCount: 1,
      memberResponseDto: [3],
      postingApproval: true,
      postingModifyOk: true,
    },
  ],
  paging: { start: null, next: null, size: 6, page: 1 },
  is_loading: false,
};

//챌린지 상세 페이지에서 인증샷 목록 불러오기
const getPostDB =
  (challengeId, start = null, size = 6) =>
  (dispatch, getState, { history }) => {
    let _paging = getState().post.paging;
    let page = _paging.page;

    //start는 있는데 next가 없다는 건 더이상 가져올 인증샷이
    //없다는 의미이므로 목록을 불러오지 않음!
    if (_paging.start && !_paging.next) {
      return;
    }

    //가져올게 있으면 loading 중이되므로 loading = true
    dispatch(loading(true));

    if (start) {
      page = page + 1;
    }

    instance
      .get(`/api/posting/${page}/${challengeId}`)
      .then((res) => {
        consoleLogger(res);
        let post_list = [];

        let paging = {
          start: res.data[0],
          next:
            res.data.length === size + 1 ? res.data[res.data.length - 1] : null,
          size,
          page,
        };

        post_list.push(...res.data);
        post_list.pop();
        dispatch(setPost(post_list, paging));
      })
      .catch((error) => {
        // if (
        //   window.confirm(
        //     "인증샷 목록을 불러오는데 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
        //   )
        // ) {
        //   history.push("/");
        // } else {
        //   history.goBack();
        // }
        consoleLogger("인증샷 목록 불러올 때: " + error);
      });
  };

const addPostDB =
  (post) =>
  (dispatch, getState, { history }) => {
    const date = new Date();

    AWS.config.update({
      region: "ap-northeast-2",
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: `${process.env.REACT_APP_AWS_KEY}`,
      }),
    });

    dispatch(loading(true));

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "onedaypiece-shot-image",
        Key: post.file.name + date + ".jpg",
        Body: post.file,
      },
    });
    const promise = upload.promise();
    promise
      .then((data) => {
        consoleLogger(data);
        dispatch(imageActions.uploadImage(data.Location));

        let new_post = {
          postingImg: data.Location,
          postingContent: post.shotText,
          postingCount: 0,
          postingApproval: false,
          postingModifyOk: true,
        };

        instance
          .post("/api/posting", new_post)
          .then((res) => {
            consoleLogger(res);
            dispatch(addPost({ ...new_post, postingId: res.postingId }));
            dispatch(imageActions.setPreview(null));
          })
          .catch((error) => {
            if (
              window.confirm(
                "인증샷 등록에 문제가 있습니다ㅜㅜ 메인화면으로 돌아가도 될까요?"
              )
            ) {
              history.push("/");
            } else {
              history.goBack();
            }
            consoleLogger(error);
          });
      })
      .catch((error) => {
        if (
          window.confirm(
            "이미지 업로드에 문제가 있습니다ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goBack();
        }
        consoleLogger("새로운 인증샷 추가할 때: " + error);
      });
  };

const editPostDB =
  (post_id, content) =>
  (dispatch, getState, { history }) => {
    const post_list = getState().post.list;
    const post_idx = post_list.findIndex((p) => p.postingId === post_id);
    const _post = post_list[post_idx];

    const post = { ..._post, postingContent: content.shotText };

    if (content.file === post.postingImg) {
      //사진이 전과 같을 때는 업로드 x
      instance
        .put(`/api/posting/update/${post_id}`, post)
        .then((res) => {
          consoleLogger("글 내용만 수정하고 server에 전송후 응답: ", res);
          dispatch(editPost(post_id, post));
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
          consoleLogger("사진은 그대로고 멘트만 수정 했을 때: " + error);
        });
    } else {
      // 사진이 전과 다를 때는 업로드
      const date = new Date();

      AWS.config.update({
        region: "ap-northeast-2",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: `${process.env.REACT_APP_AWS_KEY}`,
        }),
      });

      dispatch(loading(true));

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: "onedaypiece-shot-image",
          Key: content.file.name + date + ".jpg",
          Body: content.file,
        },
      });
      const promise = upload.promise();
      promise.then((data) => {
        consoleLogger(data);
        dispatch(imageActions.uploadImage(data.Location));

        const new_post = { ...post, postingImg: data.Location };

        instance
          .put(`/api/posting/update/${post_id}`, new_post)
          .then((res) => {
            consoleLogger("이미지 바꾼 수정 server에 전송후 응답: ", res);
            dispatch(editPost(post_id, new_post));
          })
          .catch((error) => {
            if (
              window.confirm(
                "새로운 사진 업로드에 문제가 있습니다ㅜㅜ 메인화면으로 돌아가도 될까요?"
              )
            ) {
              history.push("/");
            } else {
              history.goBack();
            }
            consoleLogger("사진 새로운 걸로 수정 했을 때: " + error);
          });
      });
    }
  };

const deletePostDB =
  (post_id) =>
  (dispatch, getState, { history }) => {
    instance
      .delete(`/api/posting/delete/${post_id}`)
      .then((res) => {
        consoleLogger("삭제 요청 server에게 보낸 후 응답: ", res);
        dispatch(deletePost(post_id));
      })
      .catch((error) => {
        if (
          window.confirm(
            "인증샷 삭제에 문제가 있습니다ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goBack();
        }
        consoleLogger("인증샷 삭제 했을 때: " + error);
      });
  };

//로그인한 사용자가 인증 버튼 눌렀을 때
const clickCheckDB =
  (post_id, totalNumber) =>
  (dispatch, getState, { history }) => {
    const user_info = getState().user.user;

    const check_info = {
      memberId: user_info.memberId,
      postingId: post_id,
      totalNumber,
    };
    instance.post("/api/certification", check_info).then((res) => {
      consoleLogger("응답확인 버튼 클릭 server로 요청 보낸 후 응답: " + res);

      const post_list = getState().post.list;
      const idx = post_list.findIndex((l) => l.postingId === post_id);
      const _post = post_list[idx];

      if (_post.memberResponseDto.includes(user_info.memberId)) {
        window.alert("이미 인증 확인을 완료하신 게시물 입니다 :)");
      } else {
        const new_member_list = [
          ..._post.memberResponseDto,
          user_info.memberId,
        ];
        const new_post = {
          ..._post,
          memberResponseDto: new_member_list,
          postingCount: parseInt(_post.postingCount) + 1,
        };
        dispatch(editPost(post_id, new_post));
      }
    });
  };

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }

        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
        draft.is_loading = false;
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        const idx = draft.list.findIndex(
          (l) => l.postingId === action.payload.post_id
        );
        draft.list[idx] = action.payload.new_post;
        draft.is_loading = false;
      }),

    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        const idx = draft.list.findIndex(
          (l) => l.postingId === action.payload.post_id
        );
        draft.list.splice(idx, 1);
      }),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreator = {
  editPost,
  getPostDB,
  addPostDB,
  editPostDB,
  deletePostDB,
  clickCheckDB,
};

export { actionCreator };
