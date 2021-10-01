"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const superagent_1 = (0, tslib_1.__importDefault)(require("superagent"));
const command = {
    label: 'pokedex',
    alias: ['pkm', 'dex', 'poke'],
    options: {
        guildOnly: false,
        adminOnly: false,
        information: {
            descr: 'Comando para buscar un pokémon por su nombre o id',
            short: 'Busca pokemones.',
            usage: '<$Nombre o id>'
        }
    },
    execute: () => async (msg, args) => {
        var _a, _b, _c, _d;
        const search = args.join(' ');
        if (!search)
            return 'Debes ingresar más información del pokémon para buscarlo.';
        const target = parseMessageToPokemon(search);
        const poke = (_a = await getPokemonFromApi(target.id)) !== null && _a !== void 0 ? _a : await getPokemonFromApi(target.specie);
        if (!poke)
            return 'No se pudo encontrar información sobre el pokémon.';
        return new discord_js_1.MessageEmbed()
            .setAuthor((_c = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.displayName) !== null && _c !== void 0 ? _c : 'Sin registro', msg.author.displayAvatarURL())
            .setTitle(`${((_d = poke.name[0]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) + poke.name.slice(1)} #${poke.id}`)
            .setColor('RANDOM')
            .setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
            .setDescription(poke.stats.map(value => `${value.stat.name}: \`${value.baseStat}\``).join('\n'))
            .addFields([
            {
                name: 'Abilities',
                value: poke.abilities.map((ab) => ab.ability.name).join(' ')
            },
            {
                name: 'Types',
                value: poke.types.map((tp) => tp.type.name).join(' ')
            },
            {
                name: 'Etc',
                value: [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}cm`].join('\n')
            }
        ])
            .setImage(poke.sprites.frontDefault)
            .setThumbnail(poke.sprites.frontShiny);
    }
};
async function getPokemonFromApi(pokemon) {
    const pokeAPI = 'https://pokeapi.co/api/v2';
    try {
        const { body } = await superagent_1.default.get(`${pokeAPI}/pokemon/${pokemon}`);
        return body;
    }
    catch (err) {
        return undefined;
    }
}
function parseMessageToPokemon(message) {
    const base = {
        shiny: false,
        mega: false
    };
    if (!isNaN(parseInt(message)))
        return Object.assign(base, {
            id: parseInt(message),
            specie: ''
        });
    else
        return Object.assign(base, {
            id: 0,
            specie: message.toLowerCase()
        });
}
function parsePokemonWeight(weight) {
    let strWeight = weight.toString();
    const len = strWeight.length;
    if (len === 1)
        strWeight = `0.${strWeight}`;
    else if (len >= 2)
        strWeight = strWeight.slice(0, len - 1);
    return strWeight;
}
module.exports = command;
