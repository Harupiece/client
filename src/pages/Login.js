import React from "react";
import styled from "styled-components";
import { Formik } from "formik";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
import { userCreators } from "../redux/modules/user";

import Green from "../assets/images/level/green.svg";

import { Button, Image } from "../elements";

const Login = (props) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Container>
        <div>
          <Image width="162px" height="155px" src={Green} />
        </div>
        <p>로그인</p>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string().required(
              "이메일 작성칸이 빈칸 입니다 입력 해주세요."
            ),

            password: Yup.string().required(
              "비밀번호 작성칸이 빈칸 입니다 입력 해주세요."
            ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            dispatch(userCreators.setLoginDB(values));
            setSubmitting(false);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div>
                <Input
                  id="email"
                  type="text"
                  placeholder="이메일"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <ErrorMsg>{formik.errors.email}</ErrorMsg>
                ) : null}
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <ErrorMsgBO>{formik.errors.password}</ErrorMsgBO>
                ) : null}
                <Button
                  width="100%"
                  height="48px"
                  bg="black"
                  color="white"
                  fontsize="ms"
                  type="submit"
                >
                  로그인
                </Button>
              </div>
            </form>
          )}
        </Formik>
        <LoginText
          onClick={() => {
            props.history.push("/signup");
          }}
        >
          회원가입 하러 가기
        </LoginText>
      </Container>
    </React.Fragment>
  );
};

export default Login;

const Container = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10.833vh;

  & > p {
    margin-top: 2.4vh;
    margin-bottom: 5.37vh;
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.54;
    letter-spacing: -1.32px;
    ${({ theme }) => theme.device.mobileLg} {
      font-size: 35.5px;
    }
  }

  form {
    width: 19.58vw;
  }
  ${({ theme }) => theme.device.mobileLg} {
    width: 100%;
    height: 100%;
    padding: 0 4.44vw 0 4.44vw;
    form {
      width: 100vw;
      padding: 0 4.44vw 0 4.44vw;
    }
  }
`;

const Input = styled.input`
  margin-bottom: 0.92vh;
  width: 100%;
  padding: 1.35vw 1.2vh 0.83vw 1.2vh;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes.ms};

  ::placeholder {
    font-size: ${({ theme }) => theme.fontSizes.ms};
    color: rgba(0, 0, 0, 0.4);
  }
  ${({ theme }) => theme.device.mobileLg} {
    padding: 3.06vw;
    font-size: 15.75px;
    ::placeholder {
      font-size: 15.75px;
    }
  }
`;

const ErrorMsg = styled.p`
  margin-bottom: 1vh;
  margin-left: 1.11vw;
  text-align: center;
  color: red;
  font-size: ${({ theme }) => theme.fontSizes.ms};
  ${({ theme }) => theme.device.mobileLg} {
    margin-left: 3.06vw;
    font-size: 15.75px;
  }
`;

const ErrorMsgBO = styled.p`
  margin-bottom: 2.96vh;
  margin-left: 0.68vw;
  color: red;
  font-size: ${({ theme }) => theme.fontSizes.ms};
  ${({ theme }) => theme.device.mobileLg} {
    margin-left: 3.06vw;
    font-size: 15.75px;
  }
`;

const LoginText = styled.div`
  text-align: center;
  margin-top: 2.96vh;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
  ${({ theme }) => theme.device.mobileLg} {
    font-size: 14px;
  }
`;
