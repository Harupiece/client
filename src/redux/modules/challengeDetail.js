import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import instance from "../../shared/api";
import { consoleLogger } from "../configureStore";

const GET_CHALLENGE_DETAIL = "GET_CHALLNENG_DETAIL";
const DELETE_CHALLENGE = "DELETE_CHALLENGE";

const getChallengeDetail = createAction(GET_CHALLENGE_DETAIL, (challenge) => ({
  challenge,
}));
const deleteChallenge = createAction(DELETE_CHALLENGE, (challenge_id) => ({
  challenge_id,
}));

const initialState = {
  detail: {
    challengeId: 1,
    memberId: 1,
    memberName: "만주리아", //챌린지 만든사람 이름
    challengeTitle: "하루에 한끼 비건식",
    challengeContent:
      "건강도 챙기고 맛도 챙기는 비건, 하루에 한번씩 실천해 보야요 :)",
    categoryName: "생활습관",
    challengePassword: "공개",
    challengeStartDate: "2021-07-26",
    challengeEndDate: "2021-08-02",
    challengeProgress: "진행중",
    challengeGood:
      "https://user-images.githubusercontent.com/75834421/127076439-599fa607-9285-4ab6-aec6-54ba16567434.png",
    challengeBad:
      "https://user-images.githubusercontent.com/75834421/127076583-de2aadb3-2dd2-4778-a59e-e68f9dc3aded.png",
    challengeHollyday: " ",
    challengeMember: [1, 2, 3, 4], //챌린지에 참여한 유저아이디
  },
};

const getChallengeDetailDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    //챌린지 상세페이지에서 상세내용 불러오기
    instance
      .get(`/api/memeber/challenge/${challenge_id}`)
      .then((res) => {
        consoleLogger(res);
        dispatch(getChallengeDetail(res.data));
      })
      .catch((error) => {
        // if (
        //   window.confirm(
        //     "챌린지 상세내용을 불러오는데 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
        //   )
        // ) {
        //   history.push("/");

        // } else {
        //   history.goback();
        // }
        consoleLogger(error);
      });
  };

// 관리자 권한으로 DB에 있는 어떤 챌린지든 제약 없이 삭제 하는 함수
const adminChallengeDeleteDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    instance
      .delete(`/api/admin/challenge/${challenge_id}`)
      .then((res) => {
        consoleLogger("관리자권한 강제 삭제 요청 후 응답: " + res);

        //메인화면에서 불러오는 challenge_list 삭제하는 action 다른 모듈에서 가져오기 => 일단은 이 모듈에서 구현
        dispatch(deleteChallenge(challenge_id));

        window.alert("관리자 권한 챌린지 삭제 완료!");
        history.replace("/");
      })
      .catch((error) => consoleLogger("관리자 권한 삭제 중 오류: " + error));
  };

const challengeDeleteDB =
  (challenge_id) =>
  (dispatch, getState, { history }) => {
    instance
      .delete(`/api/member/challenge/${challenge_id}`)
      .then((res) => {
        consoleLogger("챌린지 개설한 사용자가 삭제 요칭시 응답: " + res);

        if (window.confirm("정말 챌린지를 삭제하시겠어요?")) {
          dispatch(deleteChallenge(challenge_id));
          window.alert("챌린지 삭제 완료!");
          history.replace("/");
        }
      })
      .catch((error) => {
        if (
          window.confirm(
            "챌린지 삭제에 실패했어요ㅜㅜ 메인화면으로 돌아가도 될까요?"
          )
        ) {
          history.push("/");
        } else {
          history.goback();
        }
        consoleLogger(
          "챌린지 개설한 사용자가 삭제 버튼 눌렀을 때 오류: " + error
        );
      });
  };

export default handleActions(
  {
    [GET_CHALLENGE_DETAIL]: (state, action) =>
      produce(state, (draft) => {
        draft.detail = action.payload.challenge;
      }),
    [DELETE_CHALLENGE]: (state, action) =>
      produce(state, (draft) => {
        const idx = draft.list.findIndex(
          (l) => l.challlengId === action.payload.challenge_id
        );
        draft.list.splice(idx, 1);
      }),
  },
  initialState
);

const actionCreator = {
  getChallengeDetailDB,
  adminChallengeDeleteDB,
  challengeDeleteDB,
};

export { actionCreator };
