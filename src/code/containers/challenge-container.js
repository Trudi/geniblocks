import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake, navigateToNextChallenge } from '../actions';

class ChallengeContainer extends Component {
  render() {
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
    template: PropTypes.string.isRequired
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      drakes: state.drakes,
      hiddenAlleles: state.hiddenAlleles.asMutable(),
      trial: state.trial,
      trials: state.trials,
      challenge: state.challenge,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, true)),
    onSexChange: (index, newSex) => dispatch(changeSex(index, newSex, true)),
    onDrakeSubmission: (targetPhenotype, userPhenotype, correct) => dispatch(submitDrake(targetPhenotype, userPhenotype, correct)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge())
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
