import StateIndex from "./StateIndex";

const PUSH = "REDUXOO_PUSH";
const UNSHIFT = "REDUXOO_UNSHIFT";
const REMOVE = "REDUXOO_REMOVE";
const CLEAR = "REDUXOO_CLEAR";

export default class ArrayIndex extends StateIndex {

  constructor(initialState = []) {
    super(initialState);
  }

  reduce(action) {
    let state = [...this.state];
    switch (action.type) {
      case PUSH:
        if (!(action.documents instanceof Array)) {
          state.push(action.documents);
        } else {
          state = [...state, ...action.documents];
        }
        break;
      case UNSHIFT:
        if (!(action.documents instanceof Array)) {
          state.unshift(action.documents);
        } else {
          state = [...action.documents, ...state];
        }
        break;
      case REMOVE:
        let i = state.indexOf(action.document);
        state = [...state.slice(0, i), ...state.slice(i + 1)];
        break;
      case CLEAR:
        state = [];
        break;
      default:
        state = super.reduce(action);
        break;
    }
    this.state = state;
    return state;
  }

  push(documents) {
    return this.store.dispatch({
      index: this.index,
      documents: documents,
      type: PUSH
    })
  }

  unshift(documents) {
    return this.store.dispatch({
      index: this.index,
      documents: documents,
      type: UNSHIFT
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