import Event, {IEvent} from './Event';

function createEvent<P>(): IEvent<P> {
    return new Event<P>().call;
}

export default createEvent;
