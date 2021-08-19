import React, { useEffect } from "react";
import styled from "styled-components";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";
import { Helmet } from "react-helmet";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ChallengeDetail from "../pages/ChallengeDetail";
import ChallengeCreate from "../pages/ChallengeCreate";
import ChallengeEdit from "../pages/ChallengeEdit";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Main from "../pages/Main";
import Mypage from "../pages/Mypage";
import SearchChallenge from "../pages/SearchChallenge";

import { userCreators } from "../redux/modules/user";
import { useDispatch } from "react-redux";
import { getCookie } from "./Cookie";

import { ThemeProvider } from "styled-components";
import GlobalStyle from "./GlobalStyle";
import theme from "./theme";
import favicon from "../assets/images/logo/favicon.svg";
import ogImg from "../assets/images/logo/og_image.png";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (getCookie("token")) {
      dispatch(userCreators.loginCheckDB());
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ConnectedRouter history={history}>
        <Helmet
          meta={[
            { property: "og:title", content: "하루조각" },
            { property: "og:description", content: "포스트의 설명입니다." },
            { property: "og:image", content: { ogImg } },
          ]}
        >
          <link rel="icon" href={favicon} />
        </Helmet>
        <Container>
          <Header />
          <Route exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route path="/mypage" component={Mypage} />
          <Route exact path="/challenge" component={ChallengeCreate} />
          <Route
            exact
            path="/search/1/:searchWords"
            component={SearchChallenge}
          />
          <Route path="/challenge/:id" component={ChallengeDetail} />
          <Route exact path="/:id/edit" component={ChallengeEdit} />
          <Footer />
        </Container>
      </ConnectedRouter>
    </ThemeProvider>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  min-height: 100%;
  padding-bottom: 320px;
  ${({ theme }) => theme.device.mobileLg} {
    padding-bottom: 260px;
  }
`;
