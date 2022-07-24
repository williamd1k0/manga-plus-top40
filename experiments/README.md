# Future version without Jekyll (blegh)

> DONE (FAIL)
## M4
I tried to improvise a template processor using M4.
It worked, but in an absurdly chaotic and unstable way.

> DONE (OK)
## Make
Make will be used for building.
It already managed to be able to build the M4 experiment.

> DONE (OK)
## Jinja
I tried using a standalone jinja2 (template engine) cli implementation and it worked great.
Alongside with jinja2-cli, I'm using fd-find (to find all site resources), yj (to convert yaml to json), jq (to parse/extract json data) and make (to build everything).