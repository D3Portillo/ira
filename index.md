<img width="100%" src="./assets/ira-text.svg"/>

Ira is a **small ~ 3kb** function which enhances current Fetch API with more, more goodies. Ira code isn't chopped, replaced with random chars or similar on .min.js version, it's just minified.

This goodies include debug logs, persistent settings and custom currying to request functions with a set of options. The little wrapper tries to function using current JS Engine features, no babel or typescript used. It's plain vanilla Javascript.


## Npm Install

```
npm install irajs
```

## Yarn Install

```
yarn add irajs
```

## CDN Load

```html
<script src="https://d3portillo.github.io/ira/src/index.min.js"></script>
```

## Usage

```js
import ira from "irajs"
// Requires
const ira = require("irajs")
// Start playing around
ira.get("/stuff")
```

## Documentation

[github.com/D3Portillo/ira/blob/master/README.md](https://github.com/D3Portillo/ira/blob/master/README.md)

[See Full API Reference ↗️](https://github.com/D3Portillo/ira#Ira-API-Reference)

## A First-try Playground

[observablehq.com/@d3portillo/ira-fetch-wrapper](https://observablehq.com/@d3portillo/ira-fetch-wrapper)

## Codepen

<iframe height="518" style="width: 100%;" scrolling="no" title="Ira Fetch" src="https://codepen.io/D3Portillo/embed/poyjxwM?height=518&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/D3Portillo/pen/poyjxwM'>Ira Fetch</a> by Denny Portillo
  (<a href='https://codepen.io/D3Portillo'>@D3Portillo</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
