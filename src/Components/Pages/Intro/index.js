import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { articleArticleFetchRequest } from "../../../Actions/article";
import { questionPoolFetchRequest } from "../../../Actions/question";
import { codeFetchRequest } from "../../../Actions/code";
import { Button } from "semantic-ui-react";
import styled from "styled-components";
import { pageNextRequest } from "../../../Actions/page";
import { PAGES } from "../../../Reducers/page";

import intro from "../../../static/intro.png";

const StyledContainer = styled.div`
  padding-top: 3em;
`;

const StyledIntro = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 3em;
  & img {
    display: block;
    max-width: 80%;
  }
`;
const StyledActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const mapStateToProps = (state, ownProps) => {
  return {
    user_detail: state.authReducer.signup.data,
    page: state.pageReducer.data
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const IntroView = ({ user_detail, page, nextPage }) => {
  const {
    id: user_id,
    profile: { article: article_id, research: research_id }
  } = user_detail;
  const { loading } = page;

  const listing = ["1", "a", "i"];
  const instructions = [
    {
      text: "Question before reading (5 min): Title of the article will be persented. After reading the title, raise 3 or more questions on what you expect to read from the article.",
      children: [
      ]
    },
    {
      text: "Question during reading (10 min): Read the article and raise 3 or more questions on what you want to know but the article does not cover.",
      children: [
      ]
    },
    {
      text:
        "Answer to other's questions (5-10 min): Questions generated by other users will be shown. Answer 5 or more questions that can be answered by the article you read.",
      children: [
      ]
    }
  ];

  const recursive_listing = (depth, data) => {
    return (
      <ol type={listing[depth % 3]}>
        {data.map(item => {
          return (
            <React.Fragment>
              <p style={{fontSize:16}}><li>{item.text}<br /></li>
              {item.children &&
                item.children.length > 0 &&
                recursive_listing(depth + 1, item.children)}
                </p>
            </React.Fragment>
          );
        })}
      </ol>
    );
  };

  return (
    <StyledIntro>
      <h1>Instruction - Overview</h1>
      <p style={{fontSize:16}}>In this HIT, you are going to read 1 news story about a scientific
      research. The overall procedure is outlined below.</p>
      <img src={intro} style={{ margin: "0 auto" }} />
      <p style={{fontSize:16}}>The main task is composed of 3 steps.</p>
      {recursive_listing(0, instructions)}
      <StyledActionBar>
        <Button
          onClick={nextPage}
          loading={loading}
          disabled={loading}
          positive
        >
          Next
        </Button>
      </StyledActionBar>
    </StyledIntro>
  );
};

const Intro = connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroView);

export default Intro;
