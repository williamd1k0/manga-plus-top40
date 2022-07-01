const fs = require('fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');
const fileExists = async p => !!(await fs.stat(p).catch(e => false));


const ARGS = process.argv.slice(2);
const NO_WRITE = ARGS.includes("-n");
let URL = "https://mangaplus.shueisha.co.jp/manga_list/hot";
const now = new Date();
let nowDate = now.toISOString().split('T')[0];
if (ARGS.includes('-a')) {
		const archiveID = ARGS[ARGS.indexOf('-a')+1];
		URL = "https://web.archive.org/web/"+archiveID+"/"+URL;
		nowDate = [archiveID.substr(0, 4), archiveID.substr(4, 2), archiveID.substr(6, 2)].join('-');
}
let OUTPUT_DIR = "scraped-data";
if (ARGS.includes('-d')) {
	OUTPUT_DIR = ARGS[ARGS.indexOf('-d')+1];
}
const year = nowDate.split('-')[0];
const dir = path.join(OUTPUT_DIR, year);
const outputPath = path.join(dir, nowDate+'.tsv');


(async () => {
	if (await fileExists(outputPath) && !ARGS.includes('-O')) {
		process.exit();
	}
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(URL, {
		timeout: 0,
		waitUntil: ['domcontentloaded', 'networkidle0'],
	});
	await page.waitForTimeout(1000);
	const entries = await page.$$('div[class^=HotTitle-module_container]');
	let rank = 1;
	let content = '';
	for (let entry of entries) {
		const title = await entry.$eval('p[class^=HotTitle-module_title]', (e) => e.innerText);
		console.log(rank, title);
		content += rank+'\t'+title+'\n';
		rank++;
	}
	if (!NO_WRITE) {
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(outputPath, content);
	}

	await browser.close();
})();
