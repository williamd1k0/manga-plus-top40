.PHONY: today archived

today:
	@echo Fetching: today
	@node src/index.js -o

archived:
	@for entry in $(shell cat archived.ls); do \
		echo Fetching: $${entry}; node src/index.js -a $${entry}; \
	done
