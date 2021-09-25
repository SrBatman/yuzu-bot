import type { ICommand } from '../../types/command';
import type { Message, Client } from 'discord.js';
import { command } from '../base';

@command('ping')
class cmd implements ICommand {
    public execute = (_session: Client) => {
        return (_msg: Message, _args: readonly string[]) => 'Pong!';
    }
}
export = cmd;