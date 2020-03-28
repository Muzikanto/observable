export type Event<P> = ((payload: P) => void) & {listeners: Array<(payload: P) => void>};

function createEvent<P>(): Event<P> {
    const listeners: Array<(payload: P) => void> = [];

    const event = (payload: P) => {
        event.listeners.forEach(el => el(payload));
    };
    event.listeners = listeners;

    return event as unknown as Event<P>;
}

export default createEvent;
