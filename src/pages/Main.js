import React, { useEffect } from "react";
import styled from "styled-components";

import MainSlider from "../components/mainpage/MainSlider";
import Category from "../components/mainpage/Category";
import Popular from "../components/mainpage/Popular";
import Info from "../components/mainpage/Info";

import { getCookie } from "../shared/Cookie";
import { history } from "../redux/configureStore";
import { MainCreators } from "../redux/modules/main";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../elements";
import Loader from "../shared/Loader";

const Main = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.main.is_loading);

  useEffect(() => {
    dispatch(MainCreators.loading(true));
    dispatch(MainCreators.guestLoadDB());
  }, [dispatch]);

  const is_login = getCookie("token") ? true : false;

  const goToCreate = () => {
    history.push("/challenge");
  };

  const goToLogin = () => {
    history.push("/login");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <ContainerLeft>
            <MainSlider />
            <Category />
          </ContainerLeft>
          <ContainerRight>
            <Info />
            {is_login ? (
              <>
                <ButtonBox>
                  <Button
                    width="16.15vw"
                    height="6.27vh"
                    margin="0px 0px 20px 0px"
                    _onClick={goToCreate}
                  >
                    챌린지등록하기+
                  </Button>
                </ButtonBox>
              </>
            ) : (
              <>
                <ButtonBox>
                  <Button
                    width="16.15vw"
                    height="6.27vh"
                    margin="0px 0px 20px 0px"
                    _onClick={goToLogin}
                  >
                    로그인 하기
                  </Button>
                </ButtonBox>
              </>
            )}
            <Popular />
          </ContainerRight>
        </Container>
      )}
    </>
  );
};

export default Main;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 78vh;
  margin-top: 30px;

  ${({ theme }) => theme.device.mobileLg} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    /* margin-top: 25vh; */
  }
`;

const ContainerLeft = styled.div`
  width: 49.48vw;
  margin-right: 1.04vw;

  ${({ theme }) => theme.device.mobileLg} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    margin-right: 0px;
  }
`;

const ContainerRight = styled.div`
  width: 16.15vw;
  ${({ theme }) => theme.device.mobileLg} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    margin-right: 0px;
  }
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.device.mobileLg} {
    display: none;
  }
`;
