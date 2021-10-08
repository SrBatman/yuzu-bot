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
			usage: '<Nombre o id>'
		}
	},
	execute: () => async (msg, args) => {

		const search = args.join(' ');
		if (!search)
			return 'Debes ingresar más información del pokémon para buscarlo.';

		const target = parseMessageToPokemon(search);
		const poke = await getPokemonFromApi(target.id) ?? await getPokemonFromApi(target.specie);

		if (!poke)
			return 'No se pudo encontrar información sobre el pokémon.';

		return new MessageEmbed()
			.setAuthor(msg.member?.displayName ?? 'Sin registro', msg.author.displayAvatarURL())
			.setTitle(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
			.setColor('RANDOM')
			.setFooter('Thanks to PokéAPI for existing!', 'https://pokeapi.co/static/pokeapi_256.888baca4.png')
			.setDescription(poke.stats.map(value => `${value.stat.name}: \`${value.baseStat}\``).join('\n'))
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
			.setImage(poke.sprites.frontDefault)
			.setThumbnail(poke.sprites.frontShiny);
	}
};
async function getPokemonFromApi(pokemon: string | number): Promise<IPokemon | undefined> {
	const pokeAPI = 'https://pokeapi.co/api/v2';
	try {
		const { body } = await superagent.get(`${pokeAPI}/pokemon/${pokemon}`);
		return <IPokemon> body;
	}
	catch (err: unknown) { return undefined; }
}
function parseMessageToPokemon(message: string): IPokemonTarget {
	const base = {
		shiny: false,
		mega: false
	};
	if (!isNaN(parseInt(message)))
		return <IPokemonTarget> Object.assign(base, {
			id: parseInt(message),
			specie: ''
		});

	else
		return <IPokemonTarget> Object.assign(base, {
			id: 0,
			specie: message.toLowerCase()
		});
}
function parsePokemonWeight(weight: number): string {
	let strWeight = weight.toString(); // var prevent shadowing
	const len = strWeight.length;

	if (len === 1) strWeight = `0.${strWeight}`;
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
	baseExperience: number,
	height: number,
	isDefault: boolean,
	order: number,
	weight: number,
	sprites: IPokemonSprites,
	abilities: IPokemonAbility[],
	stats: IPokemonStat[],
	types: IPokemonType[]
};

type IPokemonAbility = {
	isHidden: boolean,
	slot: number,
	ability: IApiResource
};

type IPokemonSprites = {
	frontDefault: string,
	frontShiny: string,
	frontFemale?: string,
	frontShinyFemale?: string,

	backDefault: string,
	backShiny: string,
	backFemale?: string,
	backShinyFemale?: string
};

type IPokemonStat = {
	baseStat: number,
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