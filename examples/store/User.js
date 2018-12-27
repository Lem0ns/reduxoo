import { StateIndex } from '../..';

export default class User extends StateIndex {

  constructor() {
    // We call super, with no initial state
    super();

    // Now fetch our user right away
    this.fetch();
  }

  // Lets make it so we can easily fetch our user
  async fetch() {
    let res = await window.fetch('/me', {
      headers: {
        'Accept': 'application/json',
      }
    });

    // Return the user json if 2xx OK response, else null
    let user = res.ok ? await res.json() : null;

    // Set this ReduxIndex state to the user object we got
    await this.setState(user);
  }

}