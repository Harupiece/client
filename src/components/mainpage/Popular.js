import React from "react";
import styled from "styled-components";

import { history } from "../../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../../shared/Cookie";

const Popular = (props) => {
  const dispatch = useDispatch();

  const hot_list = useSelector((state) => state.main);

  const is_login = getCookie("token") ? true : false;

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
                    <div key={idx}>
                      <CardBox>
                        <div>
                          <img src={l.challengeImgUrl} alt="" />
                        </div>
                        <CardTitle>
                          <div>{l.challengeTitle}</div>
                          <div>{l.challengeMember}명이 참여중</div>
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
                    <div key={idx}>
                      <CardBox>
                        <div>
                          <img src={l.challengeImgUrl} alt="" />
                        </div>
                        <CardTitle>
                          <div>{l.challengeTitle}</div>
                          <div>{l.challengeMember}명이 참여중</div>
                        </CardTitle>
                      </CardBox>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </Contain>
    </>
  );
};

export default Popular;

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
`;

const Title = styled.div`
  width: 9vw;
  height: 5.3vh;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  span {
    color: ${({ theme }) => theme.colors.mainGreen};
  }
`;

const CardBox = styled.div`
  width: 13.02vw;
  display: flex;

  div {
    img {
      border-radius: 10px;
      width: 100px;
      height: 100px;
      margin-top: 10px;
    }
  }
`;

const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  div:nth-child(2) {
    padding-top: 13px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;
