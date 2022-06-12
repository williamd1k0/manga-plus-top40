.PHONY: today yaml archived

today:
	@echo Fetching: today
	@node src/scrap-data.js -o

yaml:
	@rm -r -- docs/_data/rankings
	@node src/process-data.js

archived:
	@for entry in $(shell cat resources/archived.ls); do \
		echo Fetching: $${entry}; \
		node src/scrap-data.js -a $${entry}; \
	done
