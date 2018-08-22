import React from "react";
import { Button, Form, Input } from "semantic-ui-react";
import styled from "styled-components";
import SuggestionPreview from "../SuggestionPreview";
import { quesitonType, poolFoldingOpen } from "../../../Actions/question";
import { connect } from "react-redux";
import { colors } from "../../Configs/var";
import { StyledAside, StyledSticky } from "../../Atoms/StyledAside";
import AnswererQuestion from "../../Molecules/AnswererQuestion";
import { shownFetchRequest, shownExpandToggle } from "../../../Actions/shown";

const mapStateToProps = (state, ownProps) => {
  return {
    article: state.articleReducer.data,
    typed: state.questionReducer.typed,
    showns: state.shownReducer.data,
    questions: state.questionReducer.data,
    highlights: state.answerHighlightReducer,
    takeInProgress: state.takeReducer.inProgress.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchShowns: () => dispatch(shownFetchRequest()),
    expandShown: shown_id => dispatch(shownExpandToggle(shown_id))
  };
};

class AnswerPoolCycle extends React.Component {
  componentDidMount() {
    const { fetchShowns } = this.props;
    fetchShowns();
  }
  render() {
    return <AnswerPoolView {...this.props} />;
  }
}

const AnswerPoolView = ({
  //ownProps
  startHighlight,
  cancelHighlight,
  onConfirmHighlight,

  //stateToProps
  article: { title, sentences: content },
  questions,
  highlights: {
    inProgress: { active: highlightMode, shown: targetShown, data: sentenceIds }
  },
  showns,
  fetchShowns,
  expandShown
}) => {
  const highlightedSentences = content
    .filter(sentence => sentenceIds.indexOf(sentence.id) > -1)
    .map(sentence => sentence.text);
  const latestShown = showns.map(shown => ({
    ...shown,
    _latest_take: shown.takes.reduce((a, b) => (b.id > a.id ? b : a))
  }));
  if (highlightMode && targetShown !== null) {
    return (
      <StyledAside>
        <StyledSticky>
          <SuggestionPreview
            targetQuestion={targetShown.question}
            highlightedSentences={highlightedSentences}
          />

          <StyledSticky.Footer>
            <Button onClick={cancelHighlight}>Cancel</Button>
            <Button
              disabled={highlightedSentences.length === 0}
              onClick={onConfirmHighlight}
            >
              Confirm
            </Button>
          </StyledSticky.Footer>
        </StyledSticky>
      </StyledAside>
    );
  } else {
    return (
      <StyledAside>
        <StyledSticky>
          <h3>Choose questions you can answer</h3>
          <StyledSticky.Scrollable style={{ background: "#eeeeee" }}>
            <StyledSticky.ScrollablePane>
              {latestShown.map(shown => (
                <AnswererQuestion
                  key={shown.question.id}
                  question={shown.question}
                  startHighlight={startHighlight.bind(this, shown)}
                  answered={shown._latest_take.taken}
                  expanded={shown._expanded}
                  onExpandChange={() => expandShown(shown.id)}
                />
              ))}
            </StyledSticky.ScrollablePane>
          </StyledSticky.Scrollable>

          <StyledSticky.Footer />
        </StyledSticky>
      </StyledAside>
    );
  }
};

const AnswerPool = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnswerPoolCycle);
export default AnswerPool;