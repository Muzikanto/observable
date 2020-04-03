import Event, {IEvent} from './Event';

function createEvent<P = void>(): IEvent<P> {
    return new Event<P>().call;
}

export default createEvent;
