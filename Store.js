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
        setImmediate(function (state, action) {
          (this.subscriptions.get(action.index) || []).forEach(val => val(state[action.index]));
          (this.subscriptions.get('_root') || []).forEach(val => val(state));
        }.bind(this), state, action);
      } else if (action.type === REDUXOO_REFRESH) {
        (this.subscriptions.get('_root') || []).forEach(val => val(state));
      } else {
        console.log("Unknown action", action);
      }
      this.state = state;
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
    return this.state;
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
    listener(index === '_root' ? this.state : this.state[index]);
    this.subscriptions.set(index, map);
    return () => {
      this.subscriptions.delete(index);
    };
  }

  unsubscribe(index, listener) {
    if (typeof index === "function") {
      listener = index;
      index = '_root';
    }
    let map = this.subscriptions.get(index) || [];
    let i = map.indexOf(listener);
    if (i > -1)
      map.splice(i, 1);
  }

}