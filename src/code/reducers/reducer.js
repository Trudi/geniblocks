import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import { loadStateFromAuthoring, loadNextTrial } from './loadStateFromAuthoring';
import { updateProgress, getChallengeScore } from './challengeProgress';

import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = Immutable({
  template: null,
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 0,
  moves: 0,
  case: 0,
  challenge: 0,
  challenges: 1,
  challengeProgress: {},
  currentScore: -1,
  showingInfoMessage: false,
  shouldShowITSMessages: true,
  userDrakeHidden: true,
  routing: {},
  authoring: window.GV2Authoring
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  if (action.incrementMoves) {
    state = state.set("moves", state.moves + 1);
  }

  switch(action.type) {
    case LOCATION_CHANGE: {
      return state.set("routing", {locationBeforeTransitions: action.payload});
    }
    case actionTypes.BRED: {
      let mother = new BioLogica.Organism(BioLogica.Species.Drake, action.mother, 1),
          father = new BioLogica.Organism(BioLogica.Species.Drake, action.father, 0),
          children = [];

      for (let i = 0; i < action.quantity; i++) {
        let child = BioLogica.breed(mother, father).getAlleleString();
        children.push(child);
      }

      return state.setIn(["drakes", 1], children);
    }
    case actionTypes.ALLELE_CHANGED: {
      let path = ["drakes", action.index];
      return state.updateIn(path, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chromosome, action.side, action.previousAllele, action.newAllele);
        return {
          alleleString: organism.getAlleleString(),
          sex: organism.sex
        };
      });
    }
    case actionTypes.SEX_CHANGED: {
      let path = ["drakes", action.index, "sex"];
      return state.setIn(path, action.newSex);
    }
    case actionTypes.DRAKE_SUBMITTED: {
      let challengeComplete = false;
      let progress = updateProgress(state);
      let currentScore = getChallengeScore(state.case, state.challenge, state.trials.length, progress);
      if (action.correct && state.trial === state.trials.length-1) {
        challengeComplete = true;
      }
      return state.merge({
        showingInfoMessage: true,
        userDrakeHidden: false,
        trialSuccess: action.correct,
        challengeProgress: progress,
        currentScore,
        challengeComplete
      });
    }
    case actionTypes.MODAL_DIALOG_DISMISSED: {
      return state.merge({
        showingInfoMessage: false,
        userDrakeHidden: true
      });
    }
    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        let progress = updateProgress(state);
        if (state.trial < state.trials.length - 1) {
          return loadNextTrial(state, action.authoring, progress);
        }
        else {
          return state.merge ({ challengeProgress: progress, challengeComplete: true});
        }
      } else return state;
    }

    case actionTypes.NAVIGATED: {
      let progress = updateProgress(state);
      state = state.merge({
        case: action.case,
        challenge: action.challenge
      });
      return loadStateFromAuthoring(state, state.authoring, progress);
    }

    case actionTypes.SOCKET_RECEIVED: {
      // TODO: If you want to show dialog messages whenever you hear from the ITS...
      if (action.state.data && state.shouldShowITSMessages){
        return state.merge({
          showingInfoMessage: true,
          itsMessage: JSON.parse(action.state.data)
        });
      }
      else
        return state;
    }

    default:
      return state;
  }
}
