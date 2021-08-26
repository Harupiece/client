import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { history } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { getCookie } from "../../shared/Cookie";

const Popular = (props) => {
  const hot_list = useSelector((state) => state.main);

  const is_login = getCookie("token") ? true : false;

  // slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    slideRef.current.style.transition = "all .5s ease-in-out";
    slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
  }, [currentSlide]);

  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState();

  const onDragStart = (e) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + slideRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e) => {
    if (isDrag) {
      slideRef.current.scrollLeft = startX - e.pageX;
    }
  };

  return (
    <>
      <Contain>
        <Title>
          <span>HOT</span>챌린지
        </Title>
        <div>
          {is_login ? (
            <>
              {hot_list.usermain.popular &&
                hot_list.usermain.popular.map((l, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        history.push(`/challenge/${l.challengeId}/intro`)
                      }
                    >
                      <CardBox>
                        <div>
                          <img src={l.challengeImgUrl} alt="" />
                        </div>
                        <CardTitle>
                          <div>
                            {l.challengeTitle.length > 10
                              ? `${l.challengeTitle.substring(0, 10)}...`
                              : l.challengeTitle}
                          </div>
                          <div>
                            {l.challengeMember.length}명이 챌린지에 참여중
                          </div>
                        </CardTitle>
                      </CardBox>
                    </div>
                  );
                })}
            </>
          ) : (
            <>
              {hot_list.guestmain.popular &&
                hot_list.guestmain.popular.map((l, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        history.push(`/challenge/${l.challengeId}/intro`)
                      }
                    >
                      <CardBox>
                        <div>
                          <img src={l.challengeImgUrl} alt="" />
                        </div>
                        <CardTitle>
                          <div>
                            {l.challengeTitle.length > 10
                              ? `${l.challengeTitle.substring(0, 10)}...`
                              : l.challengeTitle}
                          </div>
                          <div>
                            {l.challengeMember.length}명이 챌린지에 참여중
                          </div>
                        </CardTitle>
                      </CardBox>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </Contain>
      {/* mobile */}
      <MobileBox>
        <Title>
          <span>HOT</span>챌린지
        </Title>
        <CardBox2>
          {is_login ? (
            <>
              <SliderContainer
                ref={slideRef}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
              >
                {hot_list.usermain.popular &&
                  hot_list.usermain.popular.map((l, idx) => {
                    return (
                      <Slide key={idx}>
                        <CardBox
                          onClick={() =>
                            history.push(`/challenge/${l.challengeId}/intro`)
                          }
                        >
                          <div>
                            <img src={l.challengeImgUrl} alt="" />
                          </div>
                          <CardTitle>
                            <div>
                              {l.challengeTitle.length > 10
                                ? `${l.challengeTitle.substring(0, 10)}...`
                                : l.challengeTitle}
                            </div>
                            <div>
                              {l.challengeMember.length}명이 챌린지에 참여중
                            </div>
                          </CardTitle>
                        </CardBox>
                      </Slide>
                    );
                  })}
              </SliderContainer>
            </>
          ) : (
            <>
              <SliderContainer
                ref={slideRef}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
              >
                {hot_list.guestmain.popular &&
                  hot_list.guestmain.popular.map((l, idx) => {
                    return (
                      <Slide key={idx}>
                        <CardBox
                          onClick={() =>
                            history.push(`/challenge/${l.challengeId}/intro`)
                          }
                        >
                          <div>
                            <img src={l.challengeImgUrl} alt="" />
                          </div>
                          <CardTitle>
                            <div>
                              {l.challengeTitle.length > 10
                                ? `${l.challengeTitle.substring(0, 10)}...`
                                : l.challengeTitle}
                            </div>
                            <div>
                              {l.challengeMember.length}명이 챌린지에 참여중
                            </div>
                          </CardTitle>
                        </CardBox>
                      </Slide>
                    );
                  })}
              </SliderContainer>
            </>
          )}
        </CardBox2>
      </MobileBox>
    </>
  );
};

export default Popular;

// mobile
const MobileBox = styled.div`
  ${({ theme }) => theme.device.mobileLg} {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    div {
      span {
        color: ${({ theme }) => theme.colors.mainGreen};
      }
    }
  }
  ${({ theme }) => theme.device.desktopXl} {
    display: none;
  }
  ${({ theme }) => theme.device.desktopLg} {
    display: none;
  }
  ${({ theme }) => theme.device.desktop} {
    display: none;
  }
  ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  display: flex; //이미지들을 가로로 나열합니다.
  ${({ theme }) => theme.device.mobileLg} {
    width: 100vw;
    height: 30vh;
    display: flex;
    overflow-x: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Slide = styled.div`
  width: 950px;
  border-radius: 10px;
  padding-bottom: 20px;
  padding-right: 10px;
  ${({ theme }) => theme.device.mobileLg} {
    width: 42%;
    border-radius: 10px;
    margin-left: 30px;
    padding-right: 0px;
  }
`;

//desktop
const Contain = styled.div`
  width: 16.15vw;
  height: 55.39vh;
  padding: 30px 31px 38px 22px;
  border-radius: 10px;
  border: 2px solid #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${({ theme }) => theme.device.mobileLg} {
    display: none;
  }
  ${({ theme }) => theme.device.desktopLg} {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0px 31px 0px 22px;
  }
`;

const Title = styled.div`
  width: 100%;
  height: 5.3vh;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  letter-spacing: -1.92px;
  line-height: 1.5;
  padding-left: 1vw;

  span {
    padding-right: 0.4vw;
    color: ${({ theme }) => theme.colors.mainGreen};
  }

  ${({ theme }) => theme.device.mobileLg} {
    width: 100vw;
    font-size: 20px;
    display: flex;
    justify-content: flex-start;
    padding-left: 15px;
  }
  ${({ theme }) => theme.device.desktopLg} {
    font-size: 28px;
  }
  ${({ theme }) => theme.device.desktop} {
    font-size: 18px;
  }
  ${({ theme }) => theme.device.tablet} {
    font-size: 12px;
  }
`;

const CardBox = styled.div`
  width: 13.02vw;
  display: flex;
  cursor: pointer;

  div {
    img {
      border-radius: 10px;
      width: 9.8vh;
      height: 9.8vh;
      margin-top: 10px;
      object-fit: cover;
      object-position: center;
    }
  }

  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;

    div {
      img {
        border-radius: 10px;
        width: 38vw;
        height: 17.5vh;
        margin-top: 10px;
      }
    }
  }

  ${({ theme }) => theme.device.desktopLg} {
    width: 100%;
    padding-bottom: 10px;
    font-size: 13px;
    font-weight: bold;
    div {
      img {
        border-radius: 10px;
        width: 7.84vh;
        height: 7.84vh;
        margin-top: 10px;
      }
    }
  }
  ${({ theme }) => theme.device.desktop} {
    width: 100%;
    padding-bottom: 5px;
    font-size: 13px;
    font-weight: bold;
    div {
      img {
        border-radius: 10px;
        width: 5.39vh;
        height: 5.39vh;
        margin-top: 10px;
      }
    }
  }
  ${({ theme }) => theme.device.tablet} {
    width: 100%;
    padding-bottom: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    div {
      img {
        border-radius: 10px;
        width: 45px;
        height: 45px;
        margin-top: 10px;
      }
    }
  }
`;

const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  font-weight: 500;
  div:nth-child(2) {
    padding-top: 13px;
    opacity: 0.6;
    font-size: 16px;
    font-weight: 300;
  }

  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 1.22vh 0 1.39vh 0vw;
    font-size: 15px;
    div:nth-child(2) {
      font-size: 14px;
    }
  }
  ${({ theme }) => theme.device.desktopLg} {
    height: auto;
    div:nth-child(2) {
      font-size: 12px;
    }
  }
  ${({ theme }) => theme.device.desktop} {
    height: auto;
    font-size: 12px;
    div:nth-child(2) {
      font-size: 10px;
    }
  }
  ${({ theme }) => theme.device.tablet} {
    height: auto;
    font-size: 12px;
    div:nth-child(2) {
      font-size: 10px;
    }
  }
`;

const CardBox2 = styled.div`
  height: 34vh;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  padding-top: 1.6vh;
  ${({ theme }) => theme.device.mobileLg} {
    height: auto;
    padding: 0px;
  }
`;
