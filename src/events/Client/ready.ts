import type { IEvent } from "../../types/event";
export const event: IEvent = {
    label: 'ready',
    execute: function(s) {
        console.log('Logged in as %s', s.user?.username);
        return;
    }
}