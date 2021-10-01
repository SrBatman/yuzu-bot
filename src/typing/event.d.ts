export interface IEvent {
    label: string;
    execute:(...args) => void;
    once?: boolean;
}