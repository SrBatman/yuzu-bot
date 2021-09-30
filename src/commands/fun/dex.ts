import type { ICommand } from '../../typing/command.d';
import { MessageEmbed } from 'discord.js';
import superagent from 'superagent';
const command: ICommand = {
    label: 'pokedex',
    alias: ['pkm', 'dex', 'poke'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Comando para buscar un pokémon por su nombre o id',
            short: 'Busca pokemones.',
            usage: '<$Nombre o id>',
        },
    },
    execute: () => async (msg, args) => {

        const search = args.join(' ');
        if (!search)
            return 'Debes ingresar más información del pokémon para buscarlo.';

        const target = parseMessageToPokemon(search);
        const poke = await getPokemonFromApi(target.specie) ?? await getPokemonFromApi(target.id);

        if (!poke)
            return 'No se pudo encontrar información sobre el pokémon.';

        return new MessageEmbed()
            .setAuthor(msg.member?.displayName ?? 'Sin registro', msg.author.displayAvatarURL())
            .setTitle(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
            .setColor('RANDOM')
            .setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
            .setDescription(poke.stats.map(value => `${value.stat.name}: \`${value.base_stat}\``).join('\n'))
            .addFields([
                {
                    name: 'Abilities',
                    value: poke.abilities.map((ab: IPokemonAbility) => ab.ability.name).join(' ')
                },
                {
                    name: 'Types',
                    value: poke.types.map((tp: IPokemonType) => tp.type.name).join(' ')
                },
                {
                    name: 'Etc',
                    value: [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}cm`].join('\n')
                }
            ])
            .setImage(poke.sprites.front_default)
            .setThumbnail(poke.sprites.front_shiny);
    }
};
async function getPokemonFromApi(pokemon: string | number): Promise<IPokemon | undefined> {
    const pokeAPI = 'https://pokeapi.co/api/v2';
    try {
        const { body } = await superagent.get(`${pokeAPI}/pokemon/${pokemon}`);
        const outp = <IPokemon> body;
        return outp;
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
    var strWeight = weight.toString(); // var prevent shadowing
    const len = strWeight.length;

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

export = command;