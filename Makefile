.PHONY: yaml archived test

SCRAPED_DIR := scraped-data
PROCESSED_DIR := docs/_data/rankings
TODAY := $(shell date +%Y-%m-%d)
YEAR := $(shell date +%Y)
TODAY_TARGET := ${OUT_DIR}/${YEAR}/${TODAY}.tsv

today: ${TODAY_TARGET}

${TODAY_TARGET}:
	@echo Fetching: ${TODAY}
	@node src/scrap-data.js -d ${SCRAPED_DIR}
	@echo Saved to: $@

yaml:
	@rm -rf -- ${PROCESSED_DIR}
	@node src/process-data.js -i ${SCRAPED_DIR} -o ${PROCESSED_DIR}

archived:
	@for entry in $(shell cat resources/archived.ls); do \
		echo Fetching: $${entry}; \
		node src/scrap-data.js -d ${SCRAPED_DIR} -a $${entry}; \
	done

test:
	@node src/scrap-data.js -n
