/**
 * Represents a simple redux store with a single key/value
 */

const SET_STATE = "REDUXOO_SET_STATE";

export default class StateIndex {

  constructor(initialState = null) {
    this.state = initialState;
    this.index = this.constructor.name.substr(0,1).toLowerCase()
        +this.constructor.name.substr(1);
  }

  /**
   * 
   * @param state The state object of this ReduxIndex
   */
  reduce(action) {
    switch (action.type) {
      case SET_STATE:
        this.state = action.state;
        break;
    }
    return this.state;
  }

  setState(state) {
    return this.store.dispatch({
      type: SET_STATE,
      index: this.index,
      state: state,
    });
  }

  /**
   * Registers the store this object should use
   * @param {ReduxStore} store 
   */
  register(store) {
    this.store = store;
  }

}