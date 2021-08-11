import React, { useEffect } from "react";
import styled from "styled-components";

import InfinityScroll from "../../shared/InfinityScroll";
import PostList from "./PostList";

import { useDispatch, useSelector } from "react-redux";
import { actionCreator as postActions } from "../../redux/modules/post";

const ShotList = (props) => {
  const dispatch = useDispatch();
  const challenge = useSelector((state) => state.challengeDetail.detail);
  const { list, paging, is_loading } = useSelector((state) => state.post);
  console.log(paging);
  const challengeId = props.match.params.id;

  console.log(props);
  // 인증샷 목록 불러오기
  useEffect(() => {
    if (!challengeId) {
      return;
    }
    //
    dispatch(postActions.resetPost([], { page: 1, next: null, size: 6 }));
    dispatch(postActions.getPostDB(challengeId));
    console.log("doing dispatch!");
  }, []);

  //challenge날짜수 계산
  const start = challenge.challengeStartDate.split("T")[0].split("-");
  const date1 = new Date(start[0], start[1][1] - 1, start[2]);

  const end = challenge.challengeEndDate.split("T")[0].split("-");
  const date2 = new Date(end[0], end[1][1] - 1, end[2]);

  const totalSecond = date2.getTime() - date1.getTime();
  const totalDay = totalSecond / 1000 / 60 / 60 / 24;

  const callNext = () => {
    if (paging.next === false) {
      return;
    }
    dispatch(postActions.getPostDB(challengeId));
  };

  return (
    <ChallengeDesc>
      <SectionTitle>인증 목록</SectionTitle>
      <Section>
        <InfinityScroll
          callNext={callNext}
          is_next={paging.next ? true : false}
          loading={is_loading}
        >
          {list.length === 0 ? (
            <NoListMent>
              챌린지의 첫 인증샷을 <br />
              남겨보세요!
            </NoListMent>
          ) : null}
          <PostList
            list={list}
            challengeStatus={challenge.challengeProgress}
            challengeMember={challenge.challengeMember}
            challengeId={challenge.challengeId}
            totalNumber={challenge.challengeMember.length}
            totalDay={totalDay}
          />
        </InfinityScroll>
      </Section>
    </ChallengeDesc>
  );
};

export default ShotList;

const ChallengeDesc = styled.section`
  width: 49.48vw;
  margin-top: 40.55vh;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
  width: 49.48vw;
  text-align: left;
  margin: 40px 0 32px 0;
`;

const Section = styled.section`
  width: 49.48vw;
  display: grid;
  gap: 1.04vw;
  grid-template-columns: repeat(3, 15.78vw);
  grid-template-rows: repeat(1, 28.15vh);
  grid-auto-rows: 28.15vh;
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: bold;
    margin: 1.2em 0;
  }
`;

const NoListMent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray};
  font-weight: bold;
  line-height: normal;
`;
