# reduxoo

Make using redux a little more OOP.

# Installation

Use npm:
```sh
npm install reduxoo
```

# Core Usage

Reduxoo uses a `Reduxoo.Store` object in place of a store, and has no traditional
reducers or actions. Everything is handled by `Reduxoo.StateIndex`'s. Lets create a simple
redux store using `Reduxoo.Store`!

## Setting up our store object

First we need to setup a `Reduxoo.Store`, and define our indexes. Don't worry about the `User`
class until the next step.

View the code at [examples/store/index.js](./examples/store/index.js)

## Creating an index

Now our store is setup, now lets setup our `User` index in `User.js`.

View the code at [examples/store/User.js](./examples/store/User.js)

The store now has a `store.user` index that we can subscribe to, and a `store.user.fetch()`
method to update our user index.

Note: the default index is derived from the index's class name, with the first character
lowercase. So `User` became `store.user` as the index.

## Setting state and subscribing to indexes

Now we have a store with an index, lets use it!

View the code at [examples/user.js](./examples/user.js)

Now the user can easily be referenced (via subscriptions) and updates (via `fetch()`
or other methods) throughout a codebase.

That covers basic use of `reduxoo`, now lets build on it.

# Building on `StateIndex`

So, now we have the core mechanisms covered, lets see our other types of indexes
bundled with reduxoo. Remember, you can always make your base indexes, just extend
`Reduxoo.StateIndex`.

Lets start with a common problem, we need a CRUD API for our Documents. We'll choose
the `Reduxoo.MapIndex` index type since we have an unique ID and want decent lookup
times.

View the code at [examples/store/Documents.js](./examples/store/Documents.js)

And we have a basic CRUD index for our Documents, accessible at `store.documents`
just like `store.user`. Now though, we can call:
- `store.documents.create()`
- `store.documents.read()`
- `store.documents.update()`
- `store.documents.delete()`

to manipulate the index. You could expand on this by adding a `store.documents.search()`,
`store.documents.paginate()`, or other methods ya need.

# Tidbits

This stuff doesn't really fit anywhere else, so here it is!

## Subscribe to entire store

You can still subscribe to the entire store, though it's recommended to subscribe to
indexes.

```js
import store from './store/'

// Create a function to subscribe to everything
function onStoreReduce(state) {
  if ('user' in state) {
    // We have a user, log:
    console.log("onStoreRedux found user", state.user);
  }
}

// Subscribe to everything
store.subscribe(onStoreReduce);
```

## Unsubscribe

```js
import store from './store/';

// Unsubscribe like in redux
let unsubscribe = store.subscribe('user', (state) => {});

unsubscribe();

// Or unsubscribe by handing back the same function
let onUser = function onUser(state) {}
store.subscribe('user', onUser);
store.unsubscribe('user', onUser);
```
