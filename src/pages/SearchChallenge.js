import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { MainCreators as searchActions } from "../redux/modules/main";
import { Tag, Card } from "../elements";
import { changeForm } from "../components/mypage/ChallengesInProgress";
import { history } from "../redux/configureStore";

function SearchChallenge(props) {
  const dispatch = useDispatch();

  // 검색 키워드
  const searchList = useSelector((state) => state.main.search);

  const [searchParam] = useState(["categoryName", "challengeTitle", "tagList"]);
  const [filterParam, setFilterParam] = useState("All");
  const [filterTerms, setFilterTerms] = useState("All");
  const [filterEtc, setFilterEtc] = useState("All");

  const getCategory = (e) => {
    let category = e.target.textContent;
    if (category === "#금연금주") {
      setFilterParam("NODRINKNOSMOKE");
    } else if (category === "#생활챌린지") {
      setFilterParam("LIVINGHABITS");
    } else if (category === "#운동") {
      setFilterParam("EXERCISE");
    } else {
      return;
    }
  };

  const getTerms = (e) => {
    let category = e.target.textContent;
    if (category === "#1주") {
      setFilterTerms("#1주");
    } else if (category === "#2주") {
      setFilterTerms("#2주");
    } else if (category === "#3주") {
      setFilterTerms("#3주");
    } else if (category === "#4주 이상") {
      setFilterTerms("#4주 이상");
    } else {
      return;
    }
  };

  const getEtc = (e) => {
    let category = e.target.textContent;
    if (category === "#공식챌린지") {
      setFilterEtc(["#공식챌린지"]);
    } else if (category === "#인기챌린지") {
      setFilterEtc(["#인기챌린지"]);
    } else {
      return;
    }
  };

  function search(searchList) {
    return searchList.filter((searchLists) => {
      if (
        searchLists.categoryName === filterParam &&
        searchLists.tagList.includes(filterTerms)
      ) {
        return searchParam.some((newList) => {
          return searchLists[newList].toString().toLowerCase();
        });
      } else if (filterParam == "All") {
        return searchParam.some((newList) => {
          return searchLists[newList].toString().toLowerCase();
        });
      }
    });
  }

  // const start = searchList.usermain[category]?.map(
  //   (list) => list.challengeStartDate.split("T")[0]
  // );
  // const end = searchList.usermain[category]?.map(
  //   (list) => list.challengeEndDate.split("T")[0]
  // );

  // const {
  //   _year: start_year,
  //   _month: start_month,
  //   _date: start_date,
  // } = changeForm(start);
  // const {
  //   _year: end_year,
  //   _month: end_month,
  //   _date: end_date,
  // } = changeForm(end);

  return (
    <Container>
      <CategoryContainer>
        <CategoryLeftBox>
          <CategoryTitle>카테고리</CategoryTitle>
          <CategoryTitle>도전기간</CategoryTitle>
          <CategoryTitle>기타</CategoryTitle>
        </CategoryLeftBox>
        <CategoryRightBox>
          <TagBox>
            <Tag onClick={getCategory} bg="white">
              #금연금주
            </Tag>
            <Tag onClick={getCategory} bg="white">
              #생활챌린지
            </Tag>
            <Tag onClick={getCategory} bg="white">
              #운동
            </Tag>
          </TagBox>
          <TagBox>
            <Tag onClick={getTerms} bg="white">
              #1주
            </Tag>
            <Tag onClick={getTerms} bg="white">
              #2주
            </Tag>
            <Tag onClick={getTerms} bg="white">
              #3주
            </Tag>
            <Tag onClick={getTerms} bg="white">
              #4주 이상
            </Tag>
          </TagBox>
          <TagBox>
            <Tag onClick={getEtc} bg="white">
              #공식챌린지
            </Tag>
            <Tag onClick={getEtc} bg="white">
              #인기챌린지
            </Tag>
          </TagBox>
        </CategoryRightBox>
      </CategoryContainer>

      <BoxContainer>
        {searchList &&
          search(searchList).map((l, idx) => {
            return (
              <>
                <Card
                  src={l.challengeImgUrl}
                  title={l.challengeTitle}
                  date="2021.01.01 - 2021.01.01"
                  key={idx}
                  onClick={() => history.push(`/challenge/${l.challengeId}`)}
                ></Card>
              </>
            );
          })}
      </BoxContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 78px;
`;

const CategoryContainer = styled.div`
  width: 66.67vw;
  height: 20.39vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
`;

const CategoryLeftBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 48px;
`;

const CategoryRightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 24px;
`;

const CategoryTitle = styled.div`
  font-size: 18px;
  padding: 17px 0;
  width: 100px;
  text-align: justify;
  font-weight: bold;
`;

const TagBox = styled.div`
  display: flex;
  font-size: 16px;
  padding: 10px 0;
`;

const BoxContainer = styled.div`
  height: 200px;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 40px;
  grid-column-gap: 40px;
  padding-top: 40px;

  Card {
    margin-right: 0px;
  }
`;

export default SearchChallenge;
