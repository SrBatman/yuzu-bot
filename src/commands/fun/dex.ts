import type { ICommand } from '../../types/command';

import { MessageEmbed } from 'discord.js';
import { default as superagent } from 'superagent';

export const command: ICommand = {
    label: 'pokedex',
    alias: ['pkm', 'dex', 'poke'],
    options: {
        guildOnly: false,
        adminOnly: false
    },
    execute: () => async (msg, args) => {

        const search = args.join(' ');
        if (!search)
            return 'Debes ingresar más información del pokémon para buscarlo.';

        const target: IPokemonTarget = parseMessageToPokemon(search);
        const poke: IPokemon | undefined = await getPokemonFromApi(target.specie) ?? await getPokemonFromApi(target.id);

        if (!poke)
            return 'No se pudo encontrar información sobre el pokémon.';

        return new MessageEmbed()
            .setAuthor(msg.member?.displayName, msg.author.displayAvatarURL())
            .setTitle(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
            .setColor('RANDOM')
            .setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
            .setDescription(poke.stats.map(value => `${value.stat.name}: \`${value.base_stat}\``))
            .addField('Abilities', poke.abilities.map((ab: IPokemonAbility) => ab.ability.name), true)
            .addField('Types', poke.types.map((tp: IPokemonType) => tp.type.name), true)
            .addField('More', [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}cm`], true)
            .setImage(poke.sprites.front_default)
            .setThumbnail(poke.sprites.front_shiny);
    }
};

// FUNCTIONS

async function getPokemonFromApi(pokemon: string | number): Promise<IPokemon | undefined> {
    const pokeAPI = 'https://pokeapi.co/api/v2';
    try {
        const { body } = await superagent.get(`${pokeAPI}/pokemon/${pokemon}`);
        return body as IPokemon;
    } // ts-ignore
    catch (err: unknown) { // new feature lol
        console.error('Query to PokeAPI rejected!\n %s', err);
        return;
    }
}
function parseMessageToPokemon(message: string): IPokemonTarget {
    const data: IPokemonTarget = {
        id: 0,
        specie: '',
        shiny: false,
        mega: false
    };
    if (!isNaN(parseInt(message))) data.id = parseInt(message);
    else data.specie = message.toLowerCase();
    return data;
}
function parsePokemonWeight(weight: number): string {
    let strWeight: string = weight.toString();
    const len: number = strWeight.length;

    if (len == 1) strWeight = `0.${strWeight}`;
    else if (len >= 2) strWeight = strWeight.slice(0, len - 1);
    return strWeight;
}

// TYPING

type IApiResource = {
    name: string,
    url: string
};

type IPokemon = {
    id: number,
    name: string,
    base_experience: number,
    height: number,
    is_default: boolean,
    order: number,
    weight: number,
    sprites: IPokemonSprites,
    abilities: IPokemonAbility[],
    stats: IPokemonStat[],
    types: IPokemonType[]
};

type IPokemonAbility = {
    is_hidden: boolean,
    slot: number,
    ability: IApiResource
};

type IPokemonSprites = {
    front_default: string,
    front_shiny: string,
    front_female?: string,
    front_shiny_female?: string,

    back_default: string,
    back_shiny: string,
    back_female?: string,
    back_shiny_female?: string
};

type IPokemonStat = {
    base_stat: number,
    effort: number,
    stat: IApiResource,
};

type IPokemonType = {
    slot: number,
    type: IApiResource
};

type IPokemonTarget = {
    id: number,
    specie: string,
    shiny: boolean,
    mega: boolean
};