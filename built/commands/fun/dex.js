"use strict";
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const superagent_1 = tslib_1.__importDefault(require("superagent"));
const command = {
    label: 'pokedex',
    alias: ['pkm', 'dex', 'poke'],
    options: {
        guildOnly: false,
        adminOnly: false
    },
    information: {
        descr: 'Comando para buscar un pokémon por su nombre o id',
        short: 'Busca pokemones.',
        usage: '<$Nombre o id>'
    },
    execute: () => (msg, args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const search = args.join(' ');
        if (!search)
            return 'Debes ingresar más información del pokémon para buscarlo.';
        const target = parseMessageToPokemon(search);
        const poke = (_a = yield getPokemonFromApi(target.specie)) !== null && _a !== void 0 ? _a : yield getPokemonFromApi(target.id);
        if (!poke)
            return 'No se pudo encontrar información sobre el pokémon.';
        return new discord_js_1.MessageEmbed()
            .setAuthor((_b = msg.member) === null || _b === void 0 ? void 0 : _b.displayName, msg.author.displayAvatarURL())
            .setTitle(`${((_c = poke.name[0]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) + poke.name.slice(1)} #${poke.id}`)
            .setColor('RANDOM')
            .setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
            .setDescription(poke.stats.map(value => `${value.stat.name}: \`${value.base_stat}\``))
            .addField('Abilities', poke.abilities.map((ab) => ab.ability.name), true)
            .addField('Types', poke.types.map((tp) => tp.type.name), true)
            .addField('More', [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}cm`], true)
            .setImage(poke.sprites.front_default)
            .setThumbnail(poke.sprites.front_shiny);
    })
};
function getPokemonFromApi(pokemon) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const pokeAPI = 'https://pokeapi.co/api/v2';
        try {
            const { body } = yield superagent_1.default.get(`${pokeAPI}/pokemon/${pokemon}`);
            return body;
        }
        catch (err) {
            console.error('Query to PokeAPI rejected!\n %s', err);
            return;
        }
    });
}
function parseMessageToPokemon(message) {
    const data = {
        id: 0,
        specie: '',
        shiny: false,
        mega: false
    };
    if (!isNaN(parseInt(message)))
        data.id = parseInt(message);
    else
        data.specie = message.toLowerCase();
    return data;
}
function parsePokemonWeight(weight) {
    var strWeight = weight.toString();
    const len = strWeight.length;
    if (len == 1)
        strWeight = `0.${strWeight}`;
    else if (len >= 2)
        strWeight = strWeight.slice(0, len - 1);
    return strWeight;
}
module.exports = command;
