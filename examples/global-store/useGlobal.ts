import useGlobalBase from '../../src/useGlobal';
import { GlobalState } from './store';

const useGlobal = <Part>(selector: (globalState: GlobalState) => Part) =>
   useGlobalBase<GlobalState, Part>(selector);

export default useGlobal;
