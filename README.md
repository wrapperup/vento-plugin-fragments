<h1>
<img align="left" width="40" src="https://raw.githubusercontent.com/ventojs/vento/main/docs/icon.svg"></img>
Vento Template Fragments
</h1>

[![Deno Version](https://deno.land/badge/vento_plugin_fragments/version)](https://deno.land/x/vento_plugin_fragments)
[![NPM Version](https://img.shields.io/npm/v/vento-plugin-fragments)](https://www.npmjs.com/package/vento-plugin-fragments)

A plugin for [Vento](https://vento.js.org) that allows you to render out small portions of a template.
Useful for hypermedia-oriented front-end libraries like [htmx](https://htmx.org).

This implementation is based on htmx's
[template fragments](https://htmx.org/essays/template-fragments/) essay.

## Installation ##

### Deno

```js
import fragments from "https://deno.land/x/vento_plugin_fragments@0.1.0/mod.ts"

env.use(fragments());
```

### Node

```bash
npm install vento-plugin-fragments
```
Then simply import the plugin.
```js
import fragments from "vento-plugin-fragments";

env.use(fragments());
```

## Usage

Add `{{ fragment }}` tags to mark sections of the template you want to render individually:

```nunjucks
<html>
    {{ fragment list }}
        {{ for user in users }}
            <li>{{ user }}</li>
        {{ /for }}
    {{ /fragment }}
</html>
```
Then use the `#` query parameter to render out the fragment:

```js
const users = ["Jared", "Kim", "Bob"];

const fragment = await env.run("template.vto#list", { users }).content;
```

Which renders only the fragment:

```html
<li>Jared</li>
<li>Kim</li>
<li>Bob</li>
```

