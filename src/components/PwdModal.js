import React, { useRef, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { consoleLogger, history } from "../redux/configureStore";

import { useDispatch, useSelector } from "react-redux";
import { actionCreator as challengeDetailActions } from "../redux/modules/challengeDetail";

const PwdModal = (props) => {
  const { challengeTitle, challengePassword, challengeId } = props;

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const pwdInput = useRef();

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  // modal창 닫기,
  const handleClose = () => {
    setOpen(false);
  };

  //비밀번호 작성후 챌린지 신청
  const takePartInPwd = () => {
    if (pwdInput.current?.value === challengePassword) {
      dispatch(
        challengeDetailActions.takeInPartChallengeDB(
          challengeId,
          challengePassword
        )
      );
    } else {
      window.alert("비밀번호가 올바르지 않습니다!");
    }
  };

  //챌린지 신청히기, 비공개의 경우 비밀번호 모달창 띄우기
  const takePartIn = () => {
    if (challengePassword) {
      setOpen(true);
    } else {
      dispatch(challengeDetailActions.takeInPartChallengeDB(challengeId));
      window.alert(`${challengeTitle} 챌린지 신청 완료!`);
      history.push("/mypage");
    }
  };

  return (
    <>
      <button onClick={takePartIn}>챌린지 신청하기</button>
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
        <label htmlFor="challengePwd">비밀번호</label>
        <input
          id="challengePwd"
          ref={pwdInput}
          type="password"
          placeholder="비밀스러운 챌린지~"
        />
        <button onClick={takePartInPwd}>신청하기</button>
      </Dialog>
    </>
  );
};

export default PwdModal;