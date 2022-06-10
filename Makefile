.PHONY: today archived yaml

today:
	@echo Fetching: today
	@node src/scrap-data.js -o

archived:
	@for entry in $(shell cat archived.ls); do \
		echo Fetching: $${entry}; \
		node src/scrap-data.js -a $${entry}; \
	done

yaml:
	@node src/process-data.js
