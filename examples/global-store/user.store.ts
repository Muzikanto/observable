import createStore from '../../src/createStore';
import createEvent from '../../src/createEvent';

export type UserState = string | null;

const changeUser = createEvent<UserState>();

function userStore(initialState?: UserState) {
   const store = createStore<UserState>(initialState || null);

   store.on(changeUser, (state, payload) => payload);

   return store;
}

export default userStore;
