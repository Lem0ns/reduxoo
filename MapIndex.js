import StateIndex from "./StateIndex";

const INSERT = "REDUXOO_INSERT";
const DELETE = "REDUXOO_DELETE";

export default class MapIndex extends StateIndex {

  constructor(initialState = {}) {
    super(initialState)
    this.index = this.constructor.name;
    this.state = initialState;
  }

  reduce(action) {
    let state = { ...this.state };
    switch (action.type) {
      case INSERT:
        state[action.key] = action.document;
        break;
      case DELETE:
        delete state[action.key];
        break;
    }
    this.state = state;
    return state;
  }

  set(key, document) {
    return this.dispatch({
      index: this.index,
      key: key,
      document: document,
      type: INSERT
    })
  }

  delete(key) {
    return this.dispatch({
      index: this.index,
      key: key,
      document: document,
      type: DELETE
    });
  }

}