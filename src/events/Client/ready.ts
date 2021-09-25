import type { IEvent } from "../../types/event";
export const event: IEvent = {
    label: 'ready',
    execute(session): void {
        console.log('Logged in as %s', session.user?.username);
        console.log(session.token);
        return;
    }
}