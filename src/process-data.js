const fs = require('fs/promises');
const path = require('path');
var slugify = require('slugify');
const yaml = require('js-yaml');

const ARGS = process.argv.slice(2);

let INPUT_DIR = "scraped-data";
if (ARGS.includes('-i')) {
	INPUT_DIR = ARGS[ARGS.indexOf('-i')+1];
}
let OUTPUT_DIR = "docs/_data/rankings";
if (ARGS.includes('-o')) {
	OUTPUT_DIR = ARGS[ARGS.indexOf('-o')+1];
}

/* Jekyll Data Scheme
title: <manga title>
ranking:
- { x: <date>, y: <ranking> }
- ...
*/

function remapTitle(title) {
	return title
		.replace(/Dr\.?\s*Stone/i, 'Dr. STONE')
		.replace(/ONE\s*PIECE/i, 'One Piece')
		.replace(/8Kaijuu/i, 'Monster #8')
		.replace(/Samurai\s*8.*/i, 'Samurai 8: The Tale of Hachimaru');
}

const slugifyConfig = {
	replacement: '_',
	lower: true,
	strict: true,
	trim: true
};

function UID(title) {
	return slugify(title, slugifyConfig);
}

async function rreaddir(dir, allFiles = []) {
	const files = (await fs.readdir(dir)).map(f => path.join(dir, f));
	allFiles.push(...files);
	await Promise.all(files.map(async f => (
		(await fs.stat(f)).isDirectory() && rreaddir(f, allFiles)
	)));
	return allFiles;
}

function processRankingData(ranking, date, result) {
	const lines = ranking.trim().split('\n');
	for (const line of lines) {
		const [rank, title] = line.split('\t');
		const remappedTitle = remapTitle(title);
		const uid = UID(remappedTitle);
		if (!(uid in result)) {
			result[uid] = {
				title: remappedTitle,
				ranking: []
			};
		}
		let ranked = false;
		for (const rankInfo of result[uid].ranking) {
			if (rankInfo.x === date) {
				rankInfo.y = Math.min(rankInfo.y, parseInt(rank));
				ranked = true;
				break;
			}
		}
		if (!ranked) {
			result[uid].ranking.push({ x: date, y: parseInt(rank) });
		}
	}
}

function sortData(data) {
	const collator = new Intl.Collator();
	for (const entry of Object.keys(data)) {
		data[entry].ranking.sort((a, b) => collator.compare(a.x, b.x));
	}
}

async function saveTitleData(uid, data) {
	console.log(uid, data);
	const outputPath = path.join(OUTPUT_DIR, uid+'.yml');
	const yamlData = yaml.dump(data);
	await fs.writeFile(outputPath, yamlData, 'utf8');
}

(async () => {
	const data = {};
	const files = await rreaddir(INPUT_DIR);
	for (const file of files) {
		const stat = await fs.stat(file);
		if (stat.isFile()) {
			console.log("Processing '%s'", file);
			const date = path.basename(file).split('.')[0];
			const rankingData = await fs.readFile(file, 'utf8');
			processRankingData(rankingData, date, data);
		}
	}
	sortData(data); // NOTE: The async file operations will mess up the date order.
	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	for (const entry of Object.keys(data)) {
		await saveTitleData(entry, data[entry]);
	}
})();
