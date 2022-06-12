# MANGA Plus Top 40

The purpose of this project is to extract, archive and show data related to the [MANGA Plus Hottest Manga](https://mangaplus.shueisha.co.jp/manga_list/hot) list.

The original Hottest Manga list only shows the current state of the top 40 manga titles, so there is no history/log or charts. Therefore, this project aims to create a data history and generate an interactive chart of the Hottest Manga list.

## Notice of Non-Affiliation and Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with "MANGA Plus by SHUEISHA", SHUEISHA Inc., or any of its subsidiaries or its affiliates. The official MANGA Plus website can be found at https://mangaplus.shueisha.co.jp/.

This project strictly focuses on extracting only the ranking information (manga ranking and titles), no other website resources (such as manga logos and story images) are stored or processed in any way.


## Requirements

Required tools and libraries:

### [Nodejs](https://nodejs.dev/) (for data scraping and processing)

> Tested version: v16.15.1

#### Dependencies:
  - [yarn](https://yarnpkg.com/) (alternative package manager)
  - [puppeteer](https://developers.google.com/web/tools/puppeteer/) (for web scraping)
  - [slugify](https://github.com/simov/slugify) (for title id generation)
  - [js-yaml](https://github.com/nodeca/js-yaml) (for data processing)

Once inside the project directory, install the dependencies by running the following command:
```sh
yarn install
```
or
```sh
npm install
```

### [Jekyll](https://jekyllrb.com/) (for webpage processing)

Jekyll is very bloated software for anyone who wants to run it sporadically. I run and recommend running it inside a container ([Docker](https://www.docker.com/) or [Podman](https://podman.io/)).

I use the following container image: [jekyll/minimal:3](https://hub.docker.com/layers/minimal/jekyll/minimal/3/images/sha256-b2f0232c1cb902d9e9a373441a36cf125853b326fb7ee30ecf0b8244009ee22b?context=explore) (Jekyll 4+ containers seem to be broken)

### [Make](https://www.gnu.org/software/make/) (for tasks)

I like to use Make to write tasks (instead of using nodejs package scripts) because it's simpler and portable.


## Usage

If you just want to see the chart, ignore the following instructions and go here: https://tumeo.space/manga-plus-top40/

Follow the instructions below if you want to run this project locally:

### Scraping ranking data from MANGA Plus website

To scrap new data, stay in the repository root directory and run the following command:
```sh
make today
```
The data will be saved to `scraped-data/YYYY/YYYY-MM-DD.tsv`

>NOTE: This task is performed daily by [GitHub Actions](https://github.com/williamd1k0/manga-plus-top40/actions/workflows/fetch-ranking-workflow.yml).

### Processing scraped data

After scraping the data, it needs to be processed to be easily consumable by the website generator (Jekyll).
>See more about the data format here: https://jekyllrb.com/docs/datafiles/

To process the scraped data, stay in the repository root directory and run the following command:
```sh
make yaml
```
>NOTE: This task is performed daily by [GitHub Actions](https://github.com/williamd1k0/manga-plus-top40/actions/workflows/fetch-ranking-workflow.yml).

### Building the chart webpage

The webpage is built using only Jekyll, no Jekyll plugin/gem or UI framework is required.

The chart library ([Chart.js](https://www.chartjs.org/)) is loaded from a CDN.

>NOTE: Website sources are stored in the `docs` directory due to a GitHub Pages restriction. See more here: https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites

Change to the `docs` directory and run the following commands to either build or test (build and start a local server):

```sh
jekyll build
```
or
```sh
jekyll serve
```

If you chose to use Jekyll inside a container:
```sh
podman run --rm -it -e JEKYLL_ROOTLESS=1 -v $PWD:/srv/jekyll --net=host jekyll/minimal:3 jekyll <build|serve>
```

I don't know the specific parameters for Docker because I only use Podman, so I recommend checking the image repository for more information: https://github.com/envygeeks/jekyll-docker

>NOTE: This task is already performed automatically by GitHub Pages Environment, see the results here: https://tumeo.space/manga-plus-top40/.
