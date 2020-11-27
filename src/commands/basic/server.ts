import type { ICommand } from '../../types/command';
import { MessageEmbed } from 'discord.js';
export const command: ICommand = {
	label: 'serverinfo',
	alias: ['sv', 'server'],
    options: {
        guildOnly: true,
        adminOnly: false,
    },
    execute: () => (msg) => {
        const status: { readonly [ k: string ]: number } = {
            'online': msg.guild?.presences.cache.filter(presence => presence.status === 'online' && !presence.user?.bot).size!,
            'idle': msg.guild?.presences.cache.filter(presence => presence.status === 'idle' && !presence.user?.bot).size!,
            'dnd': msg.guild?.presences.cache.filter(presence => presence.status === 'dnd' && !presence.user?.bot).size!
        };
        const channels: { readonly [ k: string ]: number } = {
            'text': msg.guild?.channels.cache.filter(channel => channel.type === 'text').size!,
            'voice': msg.guild?.channels.cache.filter(channel => channel.type === 'voice').size!
        };
        const bots = msg.guild?.members.cache.filter(member => member.user.bot).size!;
        const members = msg.guild?.members.cache.filter(member => !member.user.bot).size!;

        return new MessageEmbed()
            .setAuthor(msg.guild?.name, msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
            .setColor('RANDOM')
            .setThumbnail(msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
            .setTimestamp()
            .addField('Presences', `:green_circle: ${status.online} ㅤ:yellow_circle: ${status.idle} ㅤ:red_circle: ${status.dnd}`)
            .addField(
                'Roles',
                `${msg.guild?.roles.cache.filter(x => !x.managed)
                    .filter(x => x.name  !== '@everyone')
                    .map(x => x.toString())
                    .slice(0, 15)
                    .join(' ')}...`
            )
            .addFields([
                {
                    name: 'Creada',
                    value: msg.guild?.createdAt.toLocaleString('es'),
                    inline: true
                },
                {
                    name: 'Owner',
                    value: msg.guild?.owner?.displayName,
                    inline: true
                },
                {
                    name: 'Bots',
                    value: bots,
                    inline: true
                },
                {
                    name: 'Members',
                    value: members,
                    inline: true
                },
                {
                    name: 'Canales',
                    value: [
                        `**Text**: ${channels.text}`,
                        `**Voice**: ${channels.voice}`
                    ],
                    inline: true
                },
                {
                    name: 'Región',
                    value: REGIONS[msg.guild?.region ?? 'none'],
                    inline: true
                }
            ])
            .setFooter(`ID: ${msg.guild?.id}`);
    }
};

const REGIONS: { readonly [ k: string ]: string } = {
    'brazil': ':flag_br: Brazil',
    'eu-central': ':flag_eu: Central Europe',
    'singapore': ':flag_sg: Singapore',
    'us-central': ':flag_us: U.S. Central',
    'sydney': ':flag_au: Sydney',
    'us-east': ':flag_us: U.S. East',
    'us-south': ':flag_us: U.S. South',
    'us-west': ':flag_us: U.S. West',
    'eu-west': ':flag_eu: Western Europe',
    'vip-us-east': ':flag_us: VIP U.S. East',
    'london': ':flag_gb: London',
    'amsterdam': ':flag_nl: Amsterdam',
    'hongkong': ':flag_hk: Hong Kong',
    'russia': ':flag_ru: Russia',
    'southafrica': ':flag_za: South Africa',
    'frankfurt': ':flag_de: Frankfurt',
    'dubai': ':flag_ae: Dubai',
    'none': ':x:'
};