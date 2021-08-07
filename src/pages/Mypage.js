import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ChallengesInProgress from "../components/mypage/ChallengesInProgress";
import UpcomingChallenge from "../components/mypage/UpcomingChallenge";
import CompletedChallenge from "../components/mypage/CompletedChallenge";
import MyPassword from "../components/mypage/MyPassword";
import MyPieces from "../components/mypage/MyPieces";
import camera from "../images/icons/camera.svg";
import { Button, Image } from "../elements";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as myInfo } from "../redux/modules/mypage";
import { Link, Route, Switch } from "react-router-dom";
import levelData from "../shared/level";

function Mypage(props) {
  const dispatch = useDispatch();
  const {
    match: { path, url },
    location: { pathname },
  } = props;

  // 유저의 챌린지들 가져오기
  // useEffect(() => {
  //   dispatch(myInfo.getMyInfoDB());
  // }, []);

  //  1. 완료한 챌린지 시작날짜 끝날짜

  // 2. 참여중인 인원수 보여주기(participateSize)

  // 3. 참여중인 유저 이미지 들어갈 4개 원 만들기

  const [editMode, setEditMode] = useState(false);

  const myInfoList = useSelector((state) => state.mypage.myInfo);
  const nickName = myInfoList.nickname;

  const [newNickName, setNewNickName] = useState(nickName);

  const convertEditMode = () => {
    setNewNickName(nickName);
    setEditMode(!editMode);
  };

  // 프로필 수정 모드
  const editComment = (e) => {
    e.preventDefault();
    convertEditMode();
  };

  const fileInput = React.useRef();

  const selectFile = () => {
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    if (!file) {
      return;
    }

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      dispatch(myInfo.setPreview(reader.result));
    };
  };

  // 프로필 preview 상태 값
  const preview = useSelector((state) => state.mypage.preview);

  // 수정 완료 버튼
  const editProfile = () => {
    const file = fileInput.current.files[0];
    if (newNickName === nickName) {
      setNewNickName(nickName);
    }
    if (!file) {
      dispatch(
        myInfo.editMyProfileDB({ newNickName, file: myInfoList.profileImage })
      );
    } else {
      dispatch(myInfo.editMyProfileDB({ newNickName, file }));
      dispatch(myInfo.setPreview(""));
    }
    convertEditMode();
  };

  console.log(pathname.includes("/now"));

  return (
    <Container>
      <UserInfoContainer>
        {!editMode ? (
          <>
            {" "}
            <Image
              width="9.69vw"
              height="17.13vh"
              borderRadius="50%"
              margin="0 0 0 4.38vw"
              src={
                myInfoList.profileImage
                  ? myInfoList.profileImage
                  : levelData[9].img
              }
              alt="defaultProfile"
            />
            <UserInfo>
              <strong>{myInfoList.nickname}</strong>님<br />
              현재 등급은 노랑 입니다.
            </UserInfo>
            <Button
              width="16.15vw"
              height="5.93vh"
              color="white"
              bg="mainGreen"
              margin="0 3.23vw 0 2.08vw"
              _onClick={convertEditMode}
            >
              프로필 수정하기
            </Button>
          </>
        ) : (
          <>
            {" "}
            <EditProfile>
              <Image
                width="9.69vw"
                height="17.13vh"
                borderRadius="50%"
                margin="0 0 0 4.38vw"
                src={preview ? preview : myInfoList.profileImage}
                alt="editProfile"
              />
              <Button width="56px" height="56px" borderRadius="50%" bg="white">
                <label htmlFor="ex_file">
                  <Image
                    width="27px"
                    height="26px"
                    src={camera}
                    alt="cameraBtn"
                  />
                </label>
              </Button>
            </EditProfile>
            <UserInfo>
              <NickInput
                type="text"
                placeholder={newNickName}
                // value={newNickName}
                maxLength="20"
                onChange={(e) => setNewNickName(e.target.value)}
                onSubmit={editComment}
              />
              님 <br />
              현재 등급은 노랑 입니다.
            </UserInfo>
            <input
              ref={fileInput}
              onChange={selectFile}
              type="file"
              id="ex_file"
              style={{ display: "none" }}
            />
            <Button
              width="16.15vw"
              height="5.93vh"
              color="white"
              bg="mainGreen"
              margin="0 3.23vw 0 2.08vw"
              _onClick={editProfile}
            >
              프로필 저장하기
            </Button>
          </>
        )}
      </UserInfoContainer>
      <ChallengeCategory>
        <Item clicked={pathname.includes("/now") ? true : false}>
          <Link to={`${path}/now`}>진행중인 챌린지</Link>
        </Item>
        <Item clicked={pathname.includes("/upcoming") ? true : false}>
          <Link to={`${path}/upcoming`}>진행 예정 챌린지</Link>
        </Item>
        <Item clicked={pathname.includes("/completed") ? true : false}>
          <Link to={`${path}/completed`}>완료한 챌린지</Link>
        </Item>
        <Item clicked={pathname.includes("/pieces") ? true : false}>
          <Link to={`${path}/pieces`}>조각 모음</Link>
        </Item>
        <Item clicked={pathname.includes("/password") ? true : false}>
          <Link to={`${path}/password`}>비밀번호 변경</Link>
        </Item>
      </ChallengeCategory>
      <Section>
        <Switch>
          <Route path={`${path}/now`} component={ChallengesInProgress} />
          <Route path={`${path}/upcoming`} component={UpcomingChallenge} />
          <Route path={`${path}/completed`} component={CompletedChallenge} />
          <Route path={`${path}/pieces`} component={MyPieces} />
          <Route path={`${path}/password`} component={MyPassword} />
        </Switch>
      </Section>
    </Container>
  );
}

export default Mypage;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 9.44vh;
`;

const UserInfoContainer = styled.div`
  width: 66.67vw;
  height: 26.85vh;
  background-color: #2c2c2c;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const UserInfo = styled.p`
  color: ${({ theme }) => theme.colors.white};
  line-height: normal;
  font-size: 42px;
  strong {
    font-weight: bold;
  }
`;

const EditProfile = styled.p`
  position: relative;
  line-height: normal;
  button {
    position: absolute;
    bottom: 0;
    left: 11.35vw;
  }
`;

const NickInput = styled.input`
  width: 20vw;
  height: 4.5vh;
  padding: 2vh;
  border-bottom: 2px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  ::placeholder {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.gray};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
  }
`;

const ChallengeCategory = styled.ul`
  width: 66.67vw;
  height: 7.04vh;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  margin: 0;
  list-style: none;
`;

const Item = styled.li`
  width: 29.84vw;
  height: 100%;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
  border-bottom: 4px solid
    ${(props) =>
      props.clicked ? props.theme.colors.mainGreen : props.theme.colors.gray};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Section = styled.div`
  width: 100%;
  height: 100vh;
  padding: 20px;
`;
