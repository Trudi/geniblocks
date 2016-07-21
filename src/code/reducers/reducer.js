import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import { loadStateFromAuthoring, loadNextTrial } from './loadStateFromAuthoring';
import { updateProgress, setProgressScore } from './challengeProgress';

import routing from './routing';

const initialState = Immutable({
  template: null,
  drakes: [],
  gametes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 0,
  moves: 0,
  case: 0,
  challenge: 0,
  challenges: 1,
  challengeProgress: {},
  showingInfoMessage: false,
  shouldShowITSMessages: true,
  userDrakeHidden: true,
  transientStates: [],
  authoring: window.GV2Authoring
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  state = state.merge({
    routing: routing(state.routing, action)
  });

  if (action.incrementMoves) {
    state = state.set("moves", state.moves + 1);
  }

  switch(action.type) {
    case actionTypes.PLAYGROUND_COMPLETE:{
      let challengeComplete = true;
      let progress = setProgressScore(state, 0);

      return state.merge({
        showingInfoMessage: true,
        trialSuccess: action.correct,
        challengeProgress: progress,
        challengeComplete
      });
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

    case actionTypes.GAMETE_CHROMOSOME_ADDED: {
      let path = ["gametes", action.index, action.name];
      return state.setIn(path, action.side);
    }

    case actionTypes.ADD_TRANSIENT_STATE: {
      return state.set("transientStates", state.transientStates.concat(action.transientState));
    }

    case actionTypes.REMOVE_TRANSIENT_STATE: {
      return state.set("transientStates", state.transientStates.filter((s) => s !== action.transientState));
    }

    case actionTypes.FERTILIZED: {
      let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[0].alleleString, state.drakes[0].sex).getGenotype().chromosomes,
          chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[1].alleleString, state.drakes[1].sex).getGenotype().chromosomes,
          alleleString = "",
          sex = 1;
      for (let name in chromosomes0) {
        let side = state.gametes[1][name];
        let chromosome = chromosomes0[name][side];
        if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
      }
      for (let name in chromosomes1) {
        let side = state.gametes[0][name];
        if (side === "y") sex = 0;
        let chromosome = chromosomes1[name][side];
        if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
      }

      return state.setIn(["drakes", 2], {
        alleleString,
        sex
      });
    }

    case actionTypes.OFFSPRING_KEPT: {
      let drakeDef = state.drakes[2],
          newOrg = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex),
          newOrgImage = newOrg.getImageName(),
          [,,,...keptDrakes] = state.drakes,
          success = true;
      for (let drake of keptDrakes) {
        let org = new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
        if (org.getImageName() === newOrgImage) {
          success = false;
          break;
        }
      }
      if (success) {
        state = state.set("drakes", state.drakes.concat({
          alleleString: state.drakes[2].alleleString,
          sex: state.drakes[2].sex
        }));
        state = state.set("gametes", [{}, {}]);
        state = state.setIn(["drakes", 2], null);

        if (state.drakes.length === 8) {
          let challengeComplete = true,
              progress = setProgressScore(state, 0);

          state = state.merge({
            showingInfoMessage: true,
            trialSuccess: true,
            challengeProgress: progress,
            challengeComplete
          });
        }
        return state;
      } else {
        return state.merge({
          showingInfoMessage: true,
          message: {
            message: "Uh oh!",
            explanation: "You already have a drake that looks just like that!",
            rightButton: {
              label: "Try again",
              action: "resetGametes"
            }
          }
        });
      }
    }

    case actionTypes.GAMETES_RESET: {
      state = state.set("gametes", [{}, {}]);
      state = state.setIn(["drakes", 2], null);
      state = state.merge({
        showingInfoMessage: false,
        message: null
      });
      return state;
    }

    case actionTypes.DRAKE_SUBMITTED: {
      let challengeComplete = false;
      let progress = updateProgress(state, action.correct);
      if (action.correct && state.trial === state.trials.length-1) {
        challengeComplete = true;
      }
      return state.merge({
        showingInfoMessage: true,
        userDrakeHidden: false,
        trialSuccess: action.correct,
        challengeProgress: progress,
        challengeComplete
      });
    }
    case actionTypes.MODAL_DIALOG_DISMISSED: {
      return state.merge({
        showingInfoMessage: false,
        userDrakeHidden: true,
        itsMessage: null
      });
    }
    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        let progress = updateProgress(state, true);
        if (state.trial < state.trials.length - 1) {
          return loadNextTrial(state, action.authoring, progress);
        }
        else {
          return state.merge ({ challengeProgress: progress, challengeComplete: true});
        }
      } else return state;
    }
    case actionTypes.NAVIGATED: {
      state = state.merge({
        case: action.case,
        challenge: action.challenge
      });
      return loadStateFromAuthoring(state, state.authoring, state.challengeProgress);
    }
    case actionTypes.ADVANCED_CHALLENGE: {
      let nextChallenge = state.challenge + 1;
      let progress = updateProgress(state, true);
      return loadStateFromAuthoring(state, action.authoring, nextChallenge, progress);
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
