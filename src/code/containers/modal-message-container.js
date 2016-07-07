import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import * as actions from '../actions';

const messageProps = {
  MatchDrakeFailure: {
    message: "That's not the drake!",
    explanation: "The drake you have created doesn't match the target drake.\nPlease try again.",
    top: "475px",
    rightButton: {
      label: "Try again",
      action: "dismissModalDialog"
    }
  },
  MatchDrakeSuccessLastTrial: {
    message: "Good work!",
    explanation: "The drake you have created matches the target drake.",
    top: "475px",
    rightButton: {
      label: "Next trial",
      action: "advanceTrial"
    }
  },
  ChallengeCompleted: {
    message: "Good work!",
    explanation: "You have completed all trials in this challenge.",
    rightButton: {
      label: "Next challenge",
      action: "navigateToNextChallenge"
    },
    challengeAwards: {caseId: 0, challengeId:0, challengeCount: 0, progress: -1}
  },
  CaseCompleted: {
    message: "Good work!",
    explanation: "You have completed all challenges in this case.",
    rightButton: {
      label: "Next case",
      clickFunc: "onNavigateToNextChallenge"
    },
    challengeAwards: {caseId: 0, challengeId:0, challengeCount: 0, progress: -1}
  }
};

function mapStateToProps (state) {
  var props;
  if (state.message) {
    props = state.message;
  } else if (state.itsMessage){
    props = {
      message: "Message from ITS",
      explanation: state.itsMessage.text,
      rightButton: {
        label: "OK",
        action: "dismissModalDialog"
      }
    };
  } else {
    if (state.challengeComplete){
      if (state.authoring[state.case].length > state.challenge+1) {
        props = messageProps.ChallengeCompleted;
      } else {
        props = messageProps.CaseCompleted;
      }
      props.challengeAwards.caseId = state.case;
      props.challengeAwards.challengeId = state.challenge;
      props.challengeAwards.challengeCount = state.challenges;
      props.challengeAwards.progress = state.challengeProgress;
    } else {
      if (state.trialSuccess) {
        props = messageProps.MatchDrakeSuccessLastTrial;
      } else {
        props = messageProps.MatchDrakeFailure;
      }
    }
  }
  return {
    show: state.showingInfoMessage,
    ...props
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actionCreator: function (actionName) {
      return () =>
        dispatch(actions[actionName]());
    }
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps};
  if (stateProps.leftButton && props.leftButton.action) {
    props.onLeftButtonClick = dispatchProps.actionCreator(props.leftButton.action);
  }
  if (props.rightButton && props.rightButton.action) {
    props.onRightButtonClick = dispatchProps.actionCreator(props.rightButton.action);
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
