import type { ICommand } from '../../types/command';
import type { IPrefix } from '../../database/models/prefix.model';
import type { GuildStructure } from '../../structures/Guild';
import { options } from '../../options';
import '../../structures/Guild';
export const command: ICommand = {
    label: 'prefix',
    alias: ['setprefix'],
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: () => async (msg, args) => {
        if (args[1])
            return 'No soportamos prefijos multi-línea, ¡lo sentimos!';
        const guild = msg.guild as GuildStructure;
        const prefix = args[0];
        const customPrefix: IPrefix | null = await guild.getPrefix();
        if (!prefix && customPrefix?.prefix)
            return `El prefix es **${customPrefix?.prefix}**`;
        if (!prefix)
            return `El prefix no ha sido cambiado aún así que es **${options.prefix}**`;
        if (!guild)
            return 'No encontré los datos del servidor, ¿Probaste en ejecutar el comando dentro de un servidor?';
        if (!msg.member?.permissions.has('ADMINISTRATOR'))
            return 'No tenés permisos para hacer eso, down.';
        if (!customPrefix?.prefix) {
            const newPrefix: IPrefix = await guild.addPrefix(prefix);
            return `El nuevo prefix será **${newPrefix.prefix}**`;
        }
        else {
            await guild.editPrefix({ prefix: prefix, server: guild.id });
            return `Actualicé el prefix de **${customPrefix?.prefix}** a **${prefix}**`;
        }
    }
};