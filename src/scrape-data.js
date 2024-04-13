const fs = require('fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');
const fileExists = async p => !!(await fs.stat(p).catch(e => false));


const ARGS = process.argv.slice(2);
const NO_WRITE = ARGS.includes("-n");
const OVERWRITE = ARGS.includes('-O');
let URL = "https://mangaplus.shueisha.co.jp/favorited";
const now = new Date();
let nowDate = now.toISOString().split('T')[0];
if (ARGS.includes('-a')) {
		const archiveID = ARGS[ARGS.indexOf('-a')+1];
		const old_url = "https://mangaplus.shueisha.co.jp/manga_list/hot"
		URL = "https://web.archive.org/web/"+archiveID+"/"+old_url;
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
	if (!NO_WRITE && await fileExists(outputPath) && !OVERWRITE) {
		process.exit(1);
	}
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(URL, {
		waitUntil: ['domcontentloaded', 'networkidle0'],
	});
	if (URL.endsWith("/manga_list")) { // deprecated since 2023.03.28
		await page.waitForSelector('a[href="/manga_list/hot"]');
		const hottest_btn = await page.$('a[href="/manga_list/hot"]');
		await hottest_btn.click();
	} else if (!URL.endsWith("/manga_list/hot")) { // new approach since 2023.03.28
		await page.waitForSelector('a[href="/ranking"]');
		const hottest_btn = await page.$('a[href="/ranking"]');
		await hottest_btn.click();
	}
	await page.waitForSelector('div[class^=HotTitle-module_container]', {timeout: 5000});
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
