import store from './store'

// Subscribe to the user index
store.subscribe('user', (state) => {
  // `state` is the user object we passed to `ReduxStore.setState` earlier.
  console.log("onUser got user", state)
});

// Fetch our user, which will set the indexes state
store.user.fetch();

// Eventually, the subscription will receive the user index's state object.