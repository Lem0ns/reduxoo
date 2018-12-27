import StateIndex from "./StateIndex";

const PUSH = "REDUXOO_PUSH";
const REMOVE = "REDUXOO_REMOVE";
const CLEAR = "REDUXOO_CLEAR";

export default class ArrayIndex extends StateIndex {

  constructor(initialState = []) {
    super(initialState)
  }

  reduce(action) {
    let state = [ ...this.state ];
    switch (action.type) {
      case PUSH:
        state.push(action.document);
        break;
      case REMOVE:
        let i = state.indexOf(action.document);
        state = [...state.slice(0, i), ...state.slice(i + 1)];
        break;
      case CLEAR:
        state = [];
        break;
    }
    this.state = state;
    return state;
  }

  push(document) {
    return this.store.dispatch({
      index: this.index,
      document: document,
      type: PUSH
    })
  }

  remove(key) {
    return this.store.dispatch({
      index: this.index,
      document: document,
      type: REMOVE
    });
  }

  clear() {
    return this.store.dispatch({
      index: this.index,
      type: CLEAR
    })
  }

}