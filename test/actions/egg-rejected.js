import expect from 'expect';
import * as actions from '../../src/code/actions';
import reducer from '../../src/code/reducers/';

const types = actions.actionTypes;

describe('rejectEggFromBasket action', () => {
  it('should create an action to reject the egg from the basket', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = false,
          rejectEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex };

    const dispatch = expect.createSpy();

    actions.rejectEggFromBasket(rejectEggArgs)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(rejectEggAction);
    expect(dispatch.calls.length).toBe(1);
  });

  it('should create an action to reject the egg from the basket and show completion dialog', () => {
    const eggDrakeIndex = 0, basketIndex = 0, isChallengeComplete = true,
          rejectEggArgs = { eggDrakeIndex, basketIndex, isChallengeComplete },
          rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex },
          showCompleteChallengeAction = {
                                          type: types.MODAL_DIALOG_SHOWN,
                                          message: "~ALERT.TITLE.GOOD_WORK",
                                          explanation: "~ALERT.COMPLETE_COIN",
                                          leftButton: {
                                            label: "~BUTTON.TRY_AGAIN",
                                            action: "retryCurrentChallenge"
                                          },
                                          rightButton: {
                                            label: "~BUTTON.NEXT_CASE",
                                            action: "navigateToNextChallenge"
                                          },
                                          top: undefined,
                                          showAward: true
                                        };

    const dispatch = expect.createSpy();
    const getState = () => ({case: 0, challenge: 0, trial: 0, trials: [{}], authoring: [[{}]] });

    actions.rejectEggFromBasket(rejectEggArgs)(dispatch, getState);
    expect(dispatch.calls[0].arguments).toEqual([rejectEggAction]);
    // must call thunk function ourselves
    dispatch.calls[1].arguments[0](dispatch, getState);
    // thunk function dispatches the showCompleteChallengeAction
    expect(dispatch.calls[2].arguments).toEqual([showCompleteChallengeAction]);
    expect(dispatch.calls.length).toBe(3);
  });

  describe('the reducer', () => {
    it('should make the appropriate changes when passed an EGG_REJECTED action', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.set("drakes", [
                            { alleles: "a:T,b:T", sex: 0, isSelected: false },
                            { alleles: "a:t,b:t", sex: 1, isSelected: false }
                          ]);

      const eggDrakeIndex = 0, basketIndex = 0,
            rejectEggAction = { type: types.EGG_REJECTED, eggDrakeIndex, basketIndex },
            nextState = reducer(initialState, rejectEggAction),
            expectedState = initialState.set("errors", 1)
                                        .setIn(["drakes", 0],
                                              { alleles: "a:T,b:T", sex: 0, basket: -1, isSelected: false });
      expect(nextState).toEqual(expectedState);
    });
  });
});
