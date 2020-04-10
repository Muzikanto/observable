import combine from '../../src/combine';
import userStore from './user.store';

export interface GlobalState {
   userData: null | string;
}

const makeStore = (initialState: Partial<GlobalState>) => {
   return combine({
      userData: userStore(initialState.userData),
   });
};

export default makeStore;
