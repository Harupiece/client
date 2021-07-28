import React, { useState } from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { consoleLogger } from "../redux/configureStore";
import PostEdit from "./PostEdit";

import { useDispatch, useSelector } from "react-redux";
import { actionCreator as imageActions } from "../redux/modules/image";
import { actionCreator as postActions } from "../redux/modules/post";

const PostList = (props) => {
  const dispatch = useDispatch();
  // const user_info = useSelector(state => state.user.userInfo)

  const { list, totalNumber, totalDay } = props;
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState("");
  const [edit, setEdit] = useState(false);

  //인증샷 클릭시 인증샷 상세페이지 modal 열기
  const handleClickOpen = (id) => {
    setClicked(list.findIndex((l) => l.postingId === id));
    setOpen(true);
  };

  // modal창 닫기,
  const handleClose = () => {
    setOpen(false);
    //수정버전으로 모달 바뀌고 닫길 때 다시 상세보기 모달로 되게끔 edit 상태 초기화
    setTimeout(() => setEdit(false), 300);
    // 수정하려고 사진 바꿨다가 모달 끄면 다시 전 사진으로 초기화
    setTimeout(() => dispatch(imageActions.setPreview(null)), 400);
  };

  //인증 버튼 눌렀을 때
  const check = () => {
    window.alert(
      `한번 인증을 확인하시면 최소할 수 없어요! ${list[clicked]?.nickName}의 인증샷을 인정해 주시겠어요?`
    );
    dispatch(postActions.clickCheckDB(list[clicked]?.postingId, totalNumber));
    if ((list[clicked]?.postingCount / totalNumber) * 100 === 50) {
      //point조각수 총 날짜 * 50 넘겨줘서 유저정보중 point 부분 수정
      // dispatch(userActions.editUserDB(totalDay * 50))
      // window.alert(`${user_info.nickName}님의 인증으로 ${list[clicked]?.nickName}이 ${totalDay * 50}조각을 획득하셨어요!!`)
    }
  };

  //modal안의 component만 편집형태로 바꾸기
  const editPost = () => {
    if (list[clicked]?.postingModifyOk) {
      setEdit(true);
    } else {
      window.alert("인증샷 수정은 게시후 24시간 이내에만 가능합니다!");
    }
  };

  //post 삭제
  const deletePost = (postingId) => {
    if (list[clicked]?.postingModifyOk) {
      dispatch(postActions.deletePostDB(postingId));
    } else {
      window.alert("인증샷 삭제는 게시후 24시간 이내에만 가능합니다!");
    }
  };

  return (
    <>
      {list.map((l, idx) => (
        <article key={l.postingId}>
          <img
            src={l.postingImg}
            onClick={() => handleClickOpen(l.postingId)}
            alt="vegan_post"
          />
        </article>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            padding: "1em",
            borderRadius: "0.6em ",
          },
        }}
      >
        <button onClick={handleClose}>모달창 닫기</button>
        {edit && list[clicked] ? (
          <PostEdit {...list[clicked]} handleClose={handleClose} />
        ) : (
          <>
            {" "}
            <div>
              <Profile src={list[clicked]?.profileImg} alt="profile" />{" "}
              {list[clicked]?.nickName}
              <div>
                <StatusBar>
                  <Status
                    width={`${
                      (list[clicked]?.postingCount / totalNumber) * 100
                    }%`}
                  />
                </StatusBar>
                <span>
                  총 {(list[clicked]?.postingCount / totalNumber) * 100} %
                </span>
              </div>
              <button onClick={() => deletePost(list[clicked]?.postingId)}>
                삭제하기
              </button>
            </div>
            <p>{list[clicked]?.postingContent}</p>
            <img src={list[clicked]?.postingImg} alt="vegan_post" />
            <div>
              <button onClick={check}>인증 확인</button>
              <button onClick={editPost}>인증샷 수정</button>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PostList;

const Profile = styled.img`
  width: 1em;
  height: 1em;
`;

const StatusBar = styled.div`
  width: 5em;
  height: 3em;
  border: 1px solid grey;
  position: relative;
`;

const Status = styled.div`
  position: absolute;
  background-color: gray;
  width: ${(props) => props.width};
  height: 3em;
  top: 0;
  left: 0;
`;
