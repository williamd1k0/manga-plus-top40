# Future version without Jekyll (blegh)

> DONE (FAIL)
## M4
I tried to improvise a template processor using M4.
It worked, but in an absurdly chaotic and unstable way.

> DONE (OK)
## Make
Make will be used for building.
It already managed to be able to build the M4 experiment.

> TODO
## Jinja
Jinja is a python lib but there are some standalone (and somewhat limited) cli implementations.

### Basic Concepts
- Layouts: can be implemented by processing a layout template after processing the page/content template;
- Page and Layout configs: can be stored the same way as Jekyll (yaml header) and parsed using `csplit` (or something better and simpler from coreutils);
- Configs format: env, json, yaml (idk which one yet, probably env to avoid more deps);
