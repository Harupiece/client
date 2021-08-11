import React from "react";
import styled from "styled-components";

import level from "../../assets/images/icons/level.svg";
import completed from "../../assets/images/icons/completed.svg";
import levelData from "../../shared/level";
import { Image } from "../../elements";

import { useSelector } from "react-redux";

const StateBox = (props) => {
  const user_info = useSelector((state) => state.user.userInfo);
  const levelState = parseInt((user_info.memberLevel - 1) / 5);

  if (user_info.memberId === null) {
    return (
      <StateContainer>
        <UserStatus>
          <Strong>
            로그인 해서
            <br />
            나에게 맞는 챌린지를
            <br />
            찾아보세요.
          </Strong>
        </UserStatus>
        <Image
          width="6.25vw"
          height="60%"
          borderRadius="50%"
          margin="0 auto"
          src={levelData[0].img}
          alt="level_image"
        />
      </StateContainer>
    );
  } else if (user_info.memberId !== null && user_info.challengeCount > 0) {
    return (
      <StateContainer>
        <UserStatus goodUser>
          <Strong>{user_info.nickname}</Strong>님은
          <br />
          {user_info.challengeCount}의 챌린지 진행중!
        </UserStatus>
        <UserLevel>
          <LevelInfo>
            <p>
              <Image
                width="1.5em"
                height="1.5em"
                margin="2%"
                src={level}
                alt="level"
              />
              등급:{" "}
              {levelData[levelState] &&
                levelData[levelState].name.split(" ")[0]}
            </p>
            <Image
              width="6.25vw"
              height="60%"
              margin="1vh 0 0 0"
              borderRadius="50%"
              src={levelData[levelState].img}
              alt="level_image"
            />
          </LevelInfo>

          <Completed>
            <p>
              <Image
                width="1.5em"
                height="1.5em"
                margin="3%"
                src={completed}
                alt="level"
              />
              조각: {user_info.point}개
            </p>
            <Image
              width="1.57vw"
              height="60%"
              borderRadius="50%"
              src={levelData[levelState].piece}
              alt="level_image"
            />
          </Completed>
        </UserLevel>
      </StateContainer>
    );
  } else {
    return (
      <StateContainer>
        <UserStatus>
          <Strong>{user_info.nickname}</Strong>은<br />
          새로운 챌린지를 찾는 중!
        </UserStatus>
        <Image
          width="6.25vw"
          height="60%"
          borderRadius="50%"
          margin="0 auto"
          src={levelData[0].img}
          alt="level_image"
        />
      </StateContainer>
    );
  }
};

export default StateBox;

const StateContainer = styled.div`
  width: 16.15vw;
  height: 28.7vh;
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 10px;
  position: fixed;
  ${({ theme }) => theme.device.mobileLg} {
    display: none;
  }
`;

const UserStatus = styled.p`
  padding: 7%;
  font-size: ${({ theme }) => theme.fontSizes.md};
  ${(props) =>
    props.goodUser
      ? `border-bottom: 2px solid ${props.theme.colors.lightGray};`
      : null};
`;

const Strong = styled.strong`
  font-weight: bold;
`;

const UserLevel = styled.div`
  height: 100%;
  display: flex;
`;

const LevelInfo = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-right: 2px solid ${({ theme }) => theme.colors.lightGray};
  color: 2px solid ${({ theme }) => theme.colors.darkGray};
  p {
    display: flex;
    width: 100%;
    height: 15%;
    justify-content: center;
    align-items: center;
  }
`;

const Completed = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: 2px solid ${({ theme }) => theme.colors.darkGray};
  p {
    display: flex;
    width: 100%;

    height: 15%;
    justify-content: center;
    align-items: center;
  }
`;
