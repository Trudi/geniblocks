import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import { dismissModalDialog, advanceTrial, navigateToNextChallenge } from '../actions';

const messageProps = {
  MatchDrakeFailure: {
    message: "That's not the drake!",
    explanation: "The drake you have created doesn't match the target drake.\nPlease try again.",
    rightButton: {
      label: "Try again",
      clickFunc: "onDismiss"
    }
  },
  MatchDrakeSuccessLastTrial: {
    message: "Good work!",
    explanation: "The drake you have created matches the target drake.",
    rightButton: {
      label: "Next trial",
      clickFunc: "onAdvanceTrial"
    }
  },
  ChallengeCompleted: {
    message: "Good work!",
    explanation: "You have completed all trials in this challenge.",
    rightButton: {
      label: "Next challenge",
      clickFunc: "onNavigateToNextChallenge"
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
  if (state.itsMessage){
    props = {
      message: "Message from ITS",
      explanation: state.itsMessage.text,
      rightButton: {
        label: "OK",
        clickFunc: "onDismiss"
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
    onDismiss: () => dispatch(dismissModalDialog()),
    onAdvanceTrial: () => dispatch(advanceTrial()),
    onNavigateToNextChallenge: () => dispatch(navigateToNextChallenge())
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps};
  if (stateProps.leftButton) {
    props.onLeftButtonClick = dispatchProps[props.leftButton.clickFunc];
  }
  if (props.rightButton) {
    props.onRightButtonClick = dispatchProps[props.rightButton.clickFunc];
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
