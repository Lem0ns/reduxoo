import { Store } from '../..';
import User from './User';

// Create the new ReduxStore object
const store = new Store();

// Register our store.user index using the `User` import
store.register(new User());

// Export our store so we can use it elsewhere
export default store;