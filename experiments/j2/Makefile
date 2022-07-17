SITE_CONF := site.yml
INCLUDES := layouts
EXCLUDES :=
SRC := src
OUT := out

TMP := .tmp
GLOBAL_EXCLUDES := *.meta
GLOBAL_SOURCES := ${TMP}/site.json
GLOBAL_TARGET := ${TMP}/globals.json
ALL_EXCLUDES := $(patsubst %, -E '%', ${GLOBAL_EXCLUDES} ${EXCLUDES})
COPY_SOURCES = $(shell fd . ${SRC} -tf -E '*.j2' ${ALL_EXCLUDES})
TEMPLATE_SOURCES = $(patsubst %.j2, %, $(shell fd . ${SRC} -e j2 -tf ${ALL_EXCLUDES}))
TARGETS = $(patsubst ${SRC}/%,${OUT}/%, ${COPY_SOURCES} ${TEMPLATE_SOURCES})


all: ${TMP} ${GLOBAL_TARGET} $(patsubst %, ${TMP}/%, ${INCLUDES}) ${OUT} ${TARGETS}

${TMP}:
	@mkdir -p $@

${TMP}/site.json: ${SITE_CONF}
	@yj $< | jq '. | { site: . }' > $@

${GLOBAL_TARGET}: ${GLOBAL_SOURCES}
	@jq -s add $^ > $@

${TMP}/%: %
	@cp -r '$<' '$@'

${OUT}:
	@mkdir -p $@

${OUT}/%: ${SRC}/%.j2
	@printf "Processing '%s'\n" '$<'
	@echo > ${TMP}/page.json
	@if test -f '$<'.meta; then \
		yj '$<'.meta | jq '. | { page: . }' > ${TMP}/page.json; \
	fi
	@cp '$<' ${TMP}/input.j2
	@jq -s add ${GLOBAL_TARGET} ${TMP}/page.json > ${TMP}/input.json
	@jinja2 --format json '${TMP}/input.j2' '${TMP}/input.json' > ${TMP}/output
	@mkdir -p '$(@D)'
	@cp '${TMP}/output' '$@'

${OUT}/%: ${SRC}/%
	@printf "Copying '%s'\n" '$<'
	@cp -r '$<' '$@'
