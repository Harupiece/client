import React, { useState } from "react";
import styled from "styled-components";
// modal
import Spinner from "../Spinner";
import Dialog from "@material-ui/core/Dialog";
import { Image } from "../../elements";
import close from "../../assets/images/icons/close.svg";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as imageActions } from "../../redux/modules/challengeCreate";

function CreateImgSelect({
  challengeInfo,
  setChallengeInfo,
  id,
  setPlaceholder,
  placeholder,
}) {
  const dispatch = useDispatch();
  const select = useSelector((state) => state.create.thumnailList);
  const challenge_info = useSelector((state) => state.challengeDetail.detail);
  const isLoading = useSelector((state) => state.create.is_loading);

  // modal state
  const [open, setOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState("");
  const [challenge, setChallenge] = useState(challengeInfo);

  const handleClickOpen = () => {
    if (id) {
      setOpen(true);
      setChallenge(challenge_info);
      dispatch(imageActions.getThumnailDb(challenge_info.categoryName));
    } else {
      if (
        !challengeInfo.categoryName ||
        challengeInfo.categoryName === "CATEGORY"
      ) {
        setTimeout(() => window.alert("카테고리를 먼저 정해주세요!"), 300);

        return;
      }
      setChallenge(challengeInfo);
      setOpen(true);
      dispatch(imageActions.getThumnailDb(challengeInfo.categoryName));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 대표이미지 선택
  const selectImg = (img, idx) => {
    setChallengeInfo({
      ...challengeInfo,
      challengeImgUrl: img,
    });
    setImgIdx(idx);
    if (!id) {
      setPlaceholder(`${challengeInfo.categoryName}_${idx + 1}`);
    }
    // setPreview(img);
    handleClose();
  };
  let intViewportWidth = window.innerWidth;

  return (
    <>
      <SubT>대표 이미지 업로드 / 선택</SubT>
      <ImageBtn onClick={handleClickOpen}>
        {placeholder ? placeholder : `${challenge.categoryName}_${imgIdx + 1}`}
      </ImageBtn>
      <Dialog
        open={open}
        maxWidth={false}
        onClose={handleClose}
        disableScrollLock={true}
        aria-labelledby="alert-dialog-title"
        PaperProps={
          intViewportWidth > 720
            ? {
                style: {
                  width: "55.21vw",
                  padding: "32px",
                  borderRadius: "16px",
                },
              }
            : {
                style: {
                  width: "91.11vw",
                  height: "150.00w",
                  padding: "4.44vw",
                  borderRadius: "16px",
                },
              }
        }
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {" "}
            <Container>
              <Title>대표 이미지 설정</Title>
              <Image
                src={close}
                alt="closeBtn"
                onClick={handleClose}
                width="28px"
                height="28px"
                borderRadius="0"
              />
            </Container>
            <ThumbnailModal>
              {select.map((i, idx) => {
                return (
                  <Image
                    key={idx}
                    width="16.67vw"
                    height="16.66vh"
                    borderRadius="16px"
                    src={i}
                    onClick={() => selectImg(i, idx)}
                    alt="challenge_thumbnail"
                  />
                );
              })}
            </ThumbnailModal>
          </>
        )}
      </Dialog>
    </>
  );
}

export default CreateImgSelect;

const SubT = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 8px;
  cursor: default;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: 0px;
  }
`;

const ImageBtn = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.ms};
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.darkGray};
  width: 15vw;
  padding: 11px 0.83vw;
  border-radius: 8px;
  margin-bottom: 2.96vh;
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    height: 6.875vh;
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 5.18vh;
    padding: 1.48vh 4.44vw 1.48vh 4.44vw;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  & > img {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 32px;
  font-weight: bold;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: 22px;
  }
`;

const ThumbnailModal = styled.div`
  width: 100%;
  display: grid;
  gap: 0.83vw;
  grid-template-columns: repeat(3, 16.67vw);
  grid-template-rows: repeat(2, 16.66vh);
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    gap: 3.33vw;
    grid-template-columns: repeat(2, 35.44vw);
    grid-template-rows: repeat(3, 22.22vw);
    & > img {
      width: 35.44vw;
      height: 22.22vw;
    }
  }
`;
