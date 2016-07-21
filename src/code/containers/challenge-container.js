import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake, resetGametes, navigateToCurrentRoute, navigateToChallenge, navigateToNextChallenge, addGameteChromosome, keepOffspring, initiateDelayedFertilization, completeChallenge } from '../actions';

class ChallengeContainer extends Component {
  componentWillMount() {
    if (this.props.routeParams.case && this.props.routeParams.challenge) {
      this.props.navigateToCurrentRoute(this.props.routeParams.case-1, this.props.routeParams.challenge-1);
    } else {
      this.props.navigateToChallenge(0, 0);
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.case !== newProps.routeParams.case-1 ||
      newProps.challenge !== newProps.routeParams.challenge-1) {
      if (newProps.routeParams.case && newProps.routeParams.challenge) {
        this.props.navigateToCurrentRoute(newProps.routeParams.case-1, newProps.routeParams.challenge-1);
      }
    }
  }

  render() {
    if (!this.props.template) return null;

    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="case-backdrop">
        <div id="case-wrapper">
          <Template {...this.props} />
        </div>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      drakes: state.drakes,
      gametes: state.gametes,
      hiddenAlleles: state.hiddenAlleles.asMutable(),
      trial: state.trial,
      trials: state.trials,
      case: state.case,
      challenge: state.challenge,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden,
      transientStates: state.transientStates
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, true)),
    onSexChange: (index, newSex) => dispatch(changeSex(index, newSex, true)),
    onDrakeSubmission: (targetPhenotype, userPhenotype, correct) => dispatch(submitDrake(targetPhenotype, userPhenotype, correct)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge()),
    onCompleteChallenge: () => dispatch(completeChallenge()),
    navigateToChallenge: (_case, challenge) => dispatch(navigateToChallenge(_case, challenge)),
    navigateToCurrentRoute: (_case, challenge) => dispatch(navigateToCurrentRoute(_case, challenge)),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onFertilize: (delay, gamete1, gamete2) => dispatch(initiateDelayedFertilization(delay, gamete1, gamete2)),
    onResetGametes: () => dispatch(resetGametes()),
    onKeepOffspring: (index, success) => dispatch(keepOffspring(index, success))
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
