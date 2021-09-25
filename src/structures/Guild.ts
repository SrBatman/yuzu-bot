import type { Client, Guild } from 'discord.js';
import type { IPrefix } from '../database/models/prefix.model';
import { Structures } from 'discord.js';
import { options } from '../options';
import * as Controller from '../database/controllers/prefix.controller';

export interface GuildStructure extends Guild {
    addPrefix:(content: string) =>  Promise<IPrefix>;
    getPrefix:() => Promise<IPrefix>;
    editPrefix:(prefix: string) => Promise<IPrefix | null>
}

export default Structures.extend('Guild', Base => {
    return class extends Base implements Guild, GuildStructure {
        public prefix: string = options.prefix;
        constructor(client: Client, data: object) {
            super(client, data);
            return this;
        }
        public async addPrefix(content: string) {
            const output = await Controller.add({ prefix: content, server: this.id });
            this.prefix = output.prefix;
            return output;
        }
        public async getPrefix() {
            const output = await Controller.get(this.id);
            if (output) this.prefix = output.prefix;
            return output ?? { prefix: this.prefix, server: this.id } as IPrefix;
        }
        public async editPrefix(prefix: string) {
            const toUpdate = await this.getPrefix();
            if (toUpdate) {
                const output = await Controller.edit(toUpdate, prefix, this.id);
                this.prefix = output?.prefix ?? this.prefix;
                return output;
            }
            return null;
        }
    };
});