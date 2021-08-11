import React from "react";
import styled from "styled-components";
import { Formik } from "formik";
import * as Yup from "yup";

import Header from "../components/Header";

import { useDispatch } from "react-redux";
import { userCreators } from "../redux/modules/user";

import Green from "../assets/images/level/green.svg";

import { Button, Image } from "../elements";

const Signup = (props) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Container>
        <div>
          <Image width="162px" height="155px" src={Green} />
        </div>
        <p>매일 달성하는 나만의 하루 조각</p>
        <Formik
          initialValues={{
            email: "",
            nickname: "",
            password: "",
            passwordConfirm: "",
            profileImg: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("올바른 이메일 형식을 작성해주세요.")
              .max(40, "40 글자 이상 작성이 불가능 합니다")
              .required("이메일 작성칸이 빈칸 입니다 입력 해주세요."),

            nickname: Yup.string()
              // .matches(/\W|\s/g, "특수문자 또는 공백은 사용할 수 없습니다")
              .required("닉네임 작성칸이 빈칸 입니다 입력 해주세요."),

            password: Yup.string()
              .max(20, "20 글자 이상 작성이 불가능 합니다")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                "최소 8자 , 하나 이상의 문자, 하나 이상의 숫자 및 특수문자를 포함하여 주십시오"
              )
              .required("비밀번호 작성칸이 빈칸 입니다 입력 해주세요."),

            passwordConfirm: Yup.string()
              .max(20, " 20 글자 이상 작성이 불가능 합니다")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                "최소 8자 , 하나 이상의 문자, 하나 이상의 숫자 및 특수문자를 포함하여 주십시오"
              )
              .required("비밀번호 확인 작성칸이 빈칸 입니다 입력 해주세요.")
              .oneOf(
                [Yup.ref("password"), null],
                "비밀번호가 일치하지 않습니다"
              ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(userCreators.registerDB(values));
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
                  id="nickname"
                  type="nickname"
                  placeholder="닉네임"
                  {...formik.getFieldProps("nickname")}
                />
                {formik.touched.nickname && formik.errors.nickname ? (
                  <ErrorMsg>{formik.errors.nickname}</ErrorMsg>
                ) : null}
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <ErrorMsg>{formik.errors.password}</ErrorMsg>
                ) : null}
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="비밀번호 확인"
                  {...formik.getFieldProps("passwordConfirm")}
                />
                {formik.touched.passwordConfirm &&
                formik.errors.passwordConfirm ? (
                  <ErrorMsg>{formik.errors.passwordConfirm}</ErrorMsg>
                ) : null}
                <Button
                  width="100%"
                  padding="16px 148px"
                  bg="black"
                  color="white"
                  fontsize="ms"
                  type="submit"
                >
                  회원가입
                </Button>
              </div>
            </form>
          )}
        </Formik>
        <LoginText
          onClick={() => {
            props.history.push("/login");
          }}
        >
          로그인 하러 가기
        </LoginText>
      </Container>
    </React.Fragment>
  );
};

export default Signup;

const Container = styled.div`
  width: 100vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10vh;

  & > p {
    margin-top: 3vh;
    margin-bottom: 6vh;
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.54;
    letter-spacing: -1.32px;
  }

  form {
    width: 19.58vw;
  }
`;

const Input = styled.input`
  margin-bottom: 2.34vh;
  width: 100%;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  ::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const ErrorMsg = styled.p`
  margin-bottom: 1vh;
  text-align: center;
  color: red;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const LoginText = styled.div`
  text-align: center;
  margin-top: 3.5vh;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
