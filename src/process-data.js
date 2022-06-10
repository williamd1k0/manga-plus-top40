const fs = require('fs/promises');
const path = require('path');
var slugify = require('slugify');
const yaml = require('js-yaml');

const INPUT_DIR = "scraped-data";
const OUTPUT_DIR = "_data/rankings";
/* Jekyll Data Scheme
title: <manga title>
ranking:
- [<date>, <ranking>]
- ...
*/

const slugifyConfig = {
	replacement: '_',
	lower: true,
	strict: true,
	trim: true
}

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
};

function processRankingData(ranking, date, result) {
	const lines = ranking.trim().split('\n');
	for (const line of lines) {
		const [rank, title] = line.split('\t');
		const uid = UID(title);
		if (!(uid in result)) {
			result[uid] = {
				title: title,
				ranking: []
			};
		}
		let ranked = false;
		for (const rankInfo of result[uid].ranking) {
			if (rankInfo[0] === date) {
				rankInfo[1] = Math.min(rankInfo[1], parseInt(rank));
				ranked = true;
				break;
			}
		}
		if (!ranked) {
			result[uid].ranking.push([date, parseInt(rank)]);
		}
	}
};

async function saveTitleData(uid, data) {
	console.log(uid, data);
	const outputPath = path.join(OUTPUT_DIR, uid+'.yml');
	const yamlData = yaml.dump(data);
	await fs.writeFile(outputPath, yamlData, 'utf8');
};

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
	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	for (const entry of Object.keys(data)) {
		await saveTitleData(entry, data[entry]);
	}
})();
