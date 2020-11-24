import { MessageEmbed } from 'discord.js';
import type { ICommand } from '../../types/command';
export const command: ICommand = {
    label: 'avatar',
    options: {
        guildOnly: false,
        adminOnly: false,
    },
    execute: () => (msg) => {
    	const target = msg.mentions.users.first() ?? msg.author;
    	const avatar = target.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' || 'gif' });
    	const embed = new MessageEmbed()
    		.setAuthor(target.tag, avatar)
    		.setColor(msg.member ? msg.member.displayColor : 'RANDOM')
    		.setTitle(`Avatar pedido por ${msg.author.tag}`)
    		.setDescription([
    			`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})`,
    			`[Avatar URL](${avatar})`
    		])
            .setImage(avatar);
    	return embed;
    }
};