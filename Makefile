.PHONY: today archived yaml

today:
	@echo Fetching: today
	@node src/scrap-data.js -o

archived:
	@for entry in $(shell cat resources/archived.ls); do \
		echo Fetching: $${entry}; \
		node src/scrap-data.js -a $${entry}; \
	done

yaml:
	rm -r -- docs/_data/rankings
	@node src/process-data.js
