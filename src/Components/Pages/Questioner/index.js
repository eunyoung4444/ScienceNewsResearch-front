import React from "react";
import { connect } from "react-redux";
import Article from "../../Organisms/Article";
import QuestionPool from "../../Organisms/QuesitonPool";
import {
  questionQuestionCreateRequest,
  questionQuestionUpdateRequest
} from "../../../Actions/question";
import styled from "styled-components";
import OmissionPool from "../../Organisms/OmissionPool";
import {
  questionHighlightModeActivate,
  questionHighlightModeUndo,
  questionHighlightSaveRequest,
  questionHighlightHoverEnter,
  questionHighlightHoverLeave,
  questionHighlightActiveTab,
  questionHighlightMark,
  questionHighlightErase
} from "../../../Actions/questionHighlight";
import { PAGES } from "../../../Reducers/page";
import { colors } from "../../Configs/var";

const StyledQuestioner = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  margin: 0 auto;
`;

const mapStateToProps = (state, ownProps) => {
  return {
    article: state.articleReducer,
    questions: state.questionReducer.data,
    highlights: state.questionHighlightReducer,
    user_detail: state.authReducer.signup.data,
    page: state.pageReducer.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateQuestion: question =>
      dispatch(questionQuestionUpdateRequest(question)),
    addQuestion: (text, phase, research_id, article_id) =>
      dispatch(
        questionQuestionCreateRequest(text, phase, research_id, article_id)
      ),
    activeHighlightMode: ({ article_id, question }) =>
      dispatch(questionHighlightModeActivate({ article_id, question })),
    undoHighlightMode: () => dispatch(questionHighlightModeUndo()),
    applyHighlight: (take_id, found, sentences) =>
      dispatch(questionHighlightSaveRequest(take_id, found, sentences)),
    markHighlight: sentence_id => dispatch(questionHighlightMark(sentence_id)),
    eraseHighlight: sentence_id =>
      dispatch(questionHighlightErase(sentence_id)),
    hoverEnter: question_ids =>
      dispatch(questionHighlightHoverEnter(question_ids)),
    hoverLeave: question_ids =>
      dispatch(questionHighlightHoverLeave(question_ids)),
    activeTab: tabIdx => dispatch(questionHighlightActiveTab(tabIdx))
  };
};

const QuestionerView = ({
  article,
  questions,
  highlights,
  user_detail: {
    id: user_id,
    profile: { article: article_id, research: research_id },
    username
  },
  updateQuestion: _updateQuestion,
  addQuestion: _addQuestion,
  activeHighlightMode,
  undoHighlightMode,
  applyHighlight,
  eraseHighlight,
  markHighlight,
  hoverEnter,
  hoverLeave,
  page
}) => {
  const {
    data,
    activeTabIdx,
    inProgress: { active: highlightMode, question, data: sentences }
  } = highlights;

  const addQuestion = (typed, phase) => {
    typed = typed.trim();
    if (typed.length === 0) return;
    _addQuestion(typed, phase, research_id, article_id);
  };

  const startHighlight = (question = null) => {
    if (question === null) {
      activeHighlightMode({ article_id });
    } else {
      activeHighlightMode({ article_id, question: question });
    }
  };

  const cancelHighlight = () => {
    undoHighlightMode();
  };
  const confirmHighlight = () => {
    // todo
    const targetQuestion = data.filter(s => s.id === question.id)[0];
    const remote_sentences = targetQuestion.refText;
    let diff = false;

    diff =
      remote_sentences.reduce(
        (acc, curr) => acc || sentences.indexOf(curr) < 0,
        false
      ) ||
      sentences.reduce(
        (acc, curr) => acc || remote_sentences.indexOf(curr) < 0,
        false
      );

    if (sentences.length === 0 || !diff) {
      cancelHighlight();
    } else {
      applyHighlight({ ...targetQuestion, refText: sentences });
    }
  };

  const isQuestioners = activeTabIdx === 0;

  const sentences_on_highlights = questions
    .filter(q => (isQuestioners ? q.owner === username : q.owner !== username))
    .map(q => q.refText);
  return (
    <React.Fragment>
      {article.data !== null && (
        <React.Fragment>
          <StyledQuestioner>
            {[
              PAGES.QUESTIONER_STEP1,
              PAGES.QUESTIONER_STEP2,
              PAGES.QUESTIONER_STEP3,
              PAGES.QUESTIONER_STEP4
            ].indexOf(page) > -1 && (
              <Article
                fab={true}
                startHighlight={startHighlight}
                highlights={highlights}
                highlightsAll={sentences_on_highlights}
                highlightColor={
                  highlightMode
                    ? colors.yellow
                    : isQuestioners
                      ? colors.yellow
                      : colors.green
                }
                bodyVisible={
                  [PAGES.QUESTIONER_STEP3, PAGES.QUESTIONER_STEP4].indexOf(
                    page
                  ) > -1
                }
                onEraseHighlight={eraseHighlight}
                onMarkHighlight={markHighlight}
                onHoverEnter={hoverEnter}
                onHoverLeave={hoverLeave}
              />
            )}

            {[PAGES.QUESTIONER_STEP1, PAGES.QUESTIONER_STEP2].indexOf(page) >
              -1 && <QuestionPool addQuestion={addQuestion} />}
            {[PAGES.QUESTIONER_STEP3, PAGES.QUESTIONER_STEP4].indexOf(page) >
              -1 && <OmissionPool startHighlight={startHighlight} />}
          </StyledQuestioner>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const Questioner = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionerView);

export default Questioner;