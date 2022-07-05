space := ${eval} ${eval}
comma := ,
data_sources := $(sort $(wildcard data/*.m4))
data_defines = '($(subst ${space},${comma},$(notdir ${data_sources:.m4=})))'
includes := -I./utils -I./includes
site_title := MANGA Plus Top 40

M4_CMD = m4 ${includes} -D_site_title_="${site_title}" -D_data_=${data_defines} $< > $@

test: tests/index.html js/data.js

%.html: %.html.m4 ${data_sources}
	$(M4_CMD)

%.js: %.js.m4 ${data_sources}
	$(M4_CMD)
