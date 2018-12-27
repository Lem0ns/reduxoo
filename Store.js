import { createStore } from 'redux';

const REDUXOO_REFRESH = "REDUXOO_REFRESH";

/**
 * Represents a ReduxStore
 */
export default class Store {

  constructor(initialState = {}) {
    this.initialState = initialState;
    this.dataTypes = {};
    this.subscriptions = new Map();
    this.subscriptions.set('_root', []);

    this.reducer = (oldState = null, action) => {
      oldState = oldState === null ? this.initialState : oldState;
      let state = { ...oldState };
      if (!action.index)
        return;
      let dataType = this.dataTypes[action.index];
      if (dataType) {
        // Send it off to the reducer
        if (action.type !== REDUXOO_REFRESH)
          state[action.index] = dataType.reduce(action);

        // Send the states
        (this.subscriptions.get(action.index) || []).forEach(val => val(state[action.index]));
        (this.subscriptions.get('_root') || []).forEach(val => val(state));
      } else if (action.type === REDUXOO_REFRESH) {
        (this.subscriptions.get('_root') || []).forEach(val => val(state));
      } else {
        console.log("Unknown action", action);
      }
      return state;
    }

    this.store = createStore(this.reducer);
  }

  /**
   * Assigns a key in this objects store for the given ReduxIndex.
   * 
   * @param {ReduxIndex} index The index you wish to register to the system.
   */
  register(index) {
    index.register(this);
    this.dataTypes[index.index] = index;
    this[index.index] = index;
    // Assign the current state to ours
    this.dispatch({
      type: "INIT",
      index: index.index,
      state: index.state
    });
  }

  getState() {
    return this.store.getState();
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  subscribe(index, listener) {
    if (typeof index === "function") {
      listener = index;
      index = '_root';
    }
    let map = this.subscriptions.get(index) || [];
    map.push(listener);
    // Dispatch a refresh command to initialize the new listener without using getStore()
    this.store.dispatch({
      type: REDUXOO_REFRESH,
      index: index
    })
    this.subscriptions.set(index, map);
  }

  unsubscribe(index, listener) {
    if (typeof index === "function") {
      listener = index;
      index = '_root';
    }
    let map = this.subscriptions.get(listener) || [];
    let i = map.indexOf(listener);
    if (i > -1)
      map.splice(i, 1);
  }

}