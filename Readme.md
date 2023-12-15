# SVG2TS

This library collects .svg icons from the folder you specify into a single index.ts file, so you can use your .svg icons in the project without loading time.

## Installation

```sh
npm install @yartasdev/svg2ts
```

## Usage

If you want to separate .svg icons by creating more than one .ts file, you can make more than one definition in the svg2ts.config.js file.

```json
"scripts": {
  "svg2ts": "svg2ts",
  "prestart": "npm run svg2ts"
},
```

> Note: This library creates .ts files from the .svg files by using the SVGO library.

### Folder Structure

```
📦 src
├─ assets
│  └─ svg
│     ├─ logo
│     │  ├─ logo.svg
│     │  ├─ youtube.svg
│     │  └─ wikipedia.svg
│     └─ icons
│        ├─ user.svg
│        └─ calendar.svg
└─ app
   ├─ app.ts
   └─ svg
      ├─ logo
      │  └─ index.ts
      └─ icons
         └─ index.ts
```

### Config File 
`svg2ts.config.js` You can review the [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig#readme) documentation for more information about the config file.

```javascript
module.exports = [
  {
    target: "src/assets/svg/logo",
    output: "src/app/svg/logo",
    prefix: "logo",
    svgo: {
      // [SVGO Config](https://github.com/svg/svgo)
      plugins: ["removeDimensions"],
    },
  },
  {
    target: "src/assets/svg/icons",
    output: "src/app/svg/icons",
    prefix: "icon",
    svgo: {
      // [SVGO Config](https://github.com/svg/svgo)
      plugins: ["cleanupAttrs"],
    },
  },
];
```
### Output

`./app/svg/logo/index.ts`

```javascript
export const logoLogo = `<svg>...</svg>`;
export const logoYoutube = `<svg>...</svg>`;
export const logoWikipedia = `<svg>...</svg>`;
```

`./app/svg/icons/index.ts`

```javascript
export const iconUser = `<svg>...</svg>`;
export const iconCalendar = `<svg>...</svg>`;
```