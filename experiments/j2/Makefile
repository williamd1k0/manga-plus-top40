# Default configs
SITE_CONF := site.yml
INCLUDES :=
EXCLUDES :=
SRC := src
DATA :=
OUT := out
TMP := .tmp

# User-defined configs
include build.mk

ALL_INCLUDES := $(patsubst %, ${TMP}/%, $(shell fd -tf . ${INCLUDES}))
GLOBAL_EXCLUDES := *.meta
DATA_SOURCES := $(wildcard ${DATA}/*.yml)
DATA_TARGETS := $(patsubst ${DATA}/%.yml, ${TMP}/data/%.json, ${DATA_SOURCES})
GLOBALS_SOURCES := ${TMP}/site.json ${TMP}/data.json
GLOBALS_TARGET := ${TMP}/globals.json
ALL_EXCLUDES := $(patsubst %, -E '%', ${GLOBAL_EXCLUDES} ${EXCLUDES})
COPY_SOURCES := $(shell fd . ${SRC} -tf -E '*.j2' ${ALL_EXCLUDES})
TEMPLATE_SOURCES = $(patsubst %.j2, %, $(shell fd . ${SRC} -e j2 -tf ${ALL_EXCLUDES}))
TARGETS = $(patsubst ${SRC}/%,${OUT}/%, ${COPY_SOURCES} ${TEMPLATE_SOURCES})


all: ${GLOBALS_TARGET} ${ALL_INCLUDES} ${TARGETS}

${TMP}/site.json: ${SITE_CONF}
	@mkdir -p ${TMP}
	@yj $< | jq '. | { site: . }' > $@

${TMP}/data/%.json: ${DATA}/%.yml
	@mkdir -p ${TMP}/data
	@yj $< | jq '. | { $(patsubst %.yml, %, ${<F}): . }' > $@

${TMP}/data.json: ${DATA_TARGETS}
	@jq -s add $^ | jq '. | { data: . }' > $@

${GLOBALS_TARGET}: ${GLOBALS_SOURCES}
	@jq -s add $^ > $@

${TMP}/%: %
	@cp -r '$<' '$@'

${OUT}/%: ${SRC}/%.j2 ${GLOBALS_TARGET} ${ALL_INCLUDES}
	@printf "Processing '%s'\n" '$<'
	@echo > ${TMP}/page.json
	@if test -f '$<'.meta; then \
		yj '$<'.meta | jq '. | { page: . }' > ${TMP}/page.json; \
	fi
	@cp '$<' ${TMP}/input.j2
	@jq -s add ${GLOBALS_TARGET} ${TMP}/page.json > ${TMP}/input.json
	@jinja2 --format json '${TMP}/input.j2' '${TMP}/input.json' > ${TMP}/output
	@mkdir -p '$(@D)'
	@cp '${TMP}/output' '$@'

${OUT}/%: ${SRC}/%
	@printf "Copying '%s'\n" '$<'
	@mkdir -p '$(@D)'
	@cp '$<' '$@'
