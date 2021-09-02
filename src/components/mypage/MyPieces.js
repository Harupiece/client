import React, { useState } from "react";
import styled from "styled-components";
import levelData from "../../shared/level";

import { useSelector } from "react-redux";
import { Image } from "../../elements";

function MyPieces(props) {
  const user_info = useSelector((state) => state.user.userInfo);
  const mypageInfo = useSelector((state) => state.mypage.myInfo);

  const [show, setShow] = useState(false);

  const userLevel = user_info.memberLevel;
  const levelDivided5 = parseInt((userLevel - 1) / 5) + 1;

  //다음 레벨까지 얼마나 남았는지 계산
  let levelState = 0;
  if (userLevel <= 5) {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100);
  } else if (5 < userLevel && userLevel <= 10) {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100) + 500;
  } else if (10 < userLevel && userLevel <= 15) {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100) + 1500;
  } else if (15 < userLevel && userLevel <= 20) {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100) + 3000;
  } else if (20 < userLevel && userLevel <= 25) {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100) + 5000;
  } else {
    levelState = (((userLevel - 1) % 5) + 1) * (levelDivided5 * 100) + 7500;
  }

  // 사용자의 level에 맞게 구슬 보여주기 위한 함수
  const levelArray = Array.from({ length: levelDivided5 }, (item, idx) => {
    return idx;
  });

  return (
    <Container>
      <PointGrid>
        <InfoBox mainGreen>
          <p style={{ cursor: "default" }}>나의 하루조각 등급은?</p>
          <strong>
            {userLevel}({mypageInfo.memberHistoryResponseDto?.rank}위)
          </strong>
        </InfoBox>
        <InfoBox>
          <p style={{ cursor: "default" }}>하루조각 총 개수</p>
          <strong>{user_info.point}개</strong>
        </InfoBox>
        <InfoBox>
          <p style={{ cursor: "default" }}>다음 등급까지 필요 개수</p>
          <strong> {levelState - user_info.point}개</strong>
        </InfoBox>
        <InfoBox>
          <p style={{ cursor: "default" }}>내가 모은 구슬</p>
          <MarbleList>
            {levelArray.map((idx) => (
              <Image
                key={idx}
                width="3.13vw"
                height="3.13vw"
                borderRadius="30px"
                marbleBorder={levelArray.length < 2 ? "2px solid #fff" : null}
                margin="0 0 0 -1.8vw"
                src={levelData[idx].img}
                alt="level_img"
              />
            ))}
          </MarbleList>
        </InfoBox>
      </PointGrid>
      <PointHistory>
        <Header>
          <h2 style={{ cursor: "default" }}>조각 히스토리</h2>
          <button onClick={() => setShow(!show)}>
            {show ? "접어두기" : "펼치기"}
          </button>
        </Header>
        {show ? (
          <>
            {mypageInfo.memberHistoryResponseDto.pointHistoryList.length !==
            0 ? (
              <HistoryBox>
                {mypageInfo.memberHistoryResponseDto.pointHistoryList?.map(
                  (history) => (
                    <p key={history.pointHistoryId}>
                      [{history.challengeTitle}]챌린지를 통해 {history.getPoint}
                      조각 획득
                    </p>
                  )
                )}
              </HistoryBox>
            ) : (
              <NoPointMent>
                아직 모은 조각이 없어요.
                <br /> 챌린지를 달성하고 조각을 모아서 구슬을 만들어 보세요!
              </NoPointMent>
            )}
          </>
        ) : null}
      </PointHistory>
    </Container>
  );
}

MyPieces.defaultProps = {
  memberLevel: 3,
  point: 350,
  pointHistoryList: [
    {
      pointHistoryId: 1,
      createdAt: "2021-07-31",
      challengeTitle: "달리는게 좋아",
      point: 1,
    },
  ],
};

export default MyPieces;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PointGrid = styled.section`
  width: 66.67vw;
  height: auto;
  display: grid;
  gap: 0.83vw;
  grid-template-columns: repeat(4, 16.04vw);
  grid-template-rows: repeat(1, 16.11vh);
  margin-bottom: 5.55vh;
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    gap: 4.44vw;
    grid-template-columns: repeat(2, 43.33vw);
    grid-template-rows: repeat(2, auto);
    margin-bottom: 5.55vh;
  }
`;

const InfoBox = styled.div`
  width: 16.04vw;
  height: 16.11vh;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.mainGreen
      ? props.theme.colors.mainGreen
      : props.theme.colors.lightGray};
  color: ${(props) =>
    props.mainGreen ? props.theme.colors.white : props.theme.colors.mainGreen};
  p {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: 2.22vh;
  }
  strong {
    font-weight: bold;
    font-size: 48px;
  }
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    max-height: 173px;
    p {
      text-align: center;
      font-size: 14px;
      margin-bottom: 2.22vh;
    }
    strong {
      font-weight: bold;
      font-size: 28px;
    }
  }

  ${({ theme }) => theme.device.desktop} {
    p {
      font-size: 16px;
    }
    strong {
      font-size: 32px;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    p {
      font-size: 14px;
    }
    strong {
      font-size: 28px;
    }
  }
`;

const MarbleList = styled.div`
  width: 9.38vw;
  display: flex;
  justify-content: center;
  margin-left: 1.8vw;
  ${({ theme }) => theme.device.mobileLg} {
    margin-left: 4.6vw;
    img {
      width: 8.33vw;
      height: 8.33vw;
      margin-left: -4.6vw;
    }
  }
`;

const PointHistory = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.22vh;
  h2 {
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  button {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.gray};
  }
  ${({ theme }) => theme.device.mobileLg} {
    h2 {
      font-size: 16px;
    }
    button {
      font-size: 12px;
    }
  }

  ${({ theme }) => theme.device.desktop} {
    h2 {
      font-size: 18px;
    }
    button {
      font-size: 14px;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    h2 {
      font-size: 16px;
    }
    button {
      font-size: 12px;
    }
  }
`;

const NoPointMent = styled.p`
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray};
  font-weight: bold;
  line-height: normal;
  cursor: default;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    height: 25vh;
  }
  ${({ theme }) => theme.device.desktop} {
    font-size: 18px;
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 16px;
  }
`;

const HistoryBox = styled.div`
  width: 100%;
  height: auto;
  grid-template-rows: repeat(1, 5.55vh);
  grid-auto-rows: 5.55vh;
  gap: 1.48vh;
  p {
    height: 5.55vh;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.DarkGray};
    padding: 2.13vh 0 1.85vh 0.99vw;
    margin-bottom: 1.48vh;
  }
`;
