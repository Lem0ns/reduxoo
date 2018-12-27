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

```js
import { Store } from '../..';
import User from './User';

// Create the new ReduxStore object
const store = new Store();

// Register our store.user index using the `User` import
store.register(new User());

// Export our store so we can use it elsewhere
export default store;
```
View the code at [examples/store/index.js](./examples/store/index.js)

## Creating an index

Now our store is setup, now lets setup our `User` index in `User.js`.

```js
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
```
View the code at [examples/store/User.js](./examples/store/User.js)

The store now has a `store.user` index that we can subscribe to, and a `store.user.fetch()`
method to update our user index.

Note: the default index is derived from the index's class name, with the first character
lowercase. So `User` became `store.user` as the index.

## Setting state and subscribing to indexes

Now we have a store with an index, lets use it!

```js
import store from './store'

// Subscribe to the user index
store.subscribe('user', (state) => {
  // `state` is the user object we passed to `ReduxStore.setState` earlier.
  console.log("onUser got user", state)
});

// Fetch our user, which will set the indexes state
store.user.fetch();

// Eventually, the subscription will receive the user index's state object.
```
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

```js
import { MapIndex } from "../..";

/**
 * A basic CRUD API example with a Reduxoo.MapIndex
 */
export default class Documents extends MapIndex {

  constructor() {
    super(); // Default state is an empty Object
  }

  // This looks just like our simple Index fetch, because it is!
  async read() {
    let res = await window.fetch('/documents');

    // Return the user json if 2xx OK response, else null
    let documents = res.ok ? await res.json() : null;

    // Replaces the existing map with this new document map
    await this.setState(documents);
  }

  // Removes the document from the store
  async delete(document) {
    let res = await window.fetch('/document/' + document._id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok)
      throw new Error("Unable to remove document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Remove from this index
    this.remove(document);
  }

  // Adds a document
  async create(document) {
    let res = await window.fetch('/document', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });

    if (!res.ok)
      throw new Error("Unable to add document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Set the given ID to this
    this.set(json._id, json);
  }

  async update(document) {
    let res = await window.fetch('/document', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });

    if (!res.ok)
      throw new Error("Unable to add document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Set the given ID to this
    this.set(json._id, json);
  }
}
```
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
