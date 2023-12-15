# SVG2TS

This library collects .svg icons from the folder you specify into a single index.ts file, so you can use your .svg icons in the project without loading time.

## Installation

```sh
npm install @yartasdev/svg2ts
```

## Usage

If you want to separate .svg icons by creating more than one .ts file, you can make more than one definition in the svg2ts.config.js file.

> Note: This library creates .ts files from the .svg files by using the SVGO library.

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

```javascript
module.exports = {
  configs: [
    {
      target: 'src/assets/svg/logo',
      output: 'src/app/svg/logo', 
      prefix: 'logo',
      svgo: { // [SVGO Config](https://github.com/svg/svgo)
        plugins: ['removeDimensions']
      }
    },
    {
      target: 'src/assets/svg/icons',
      output: 'src/app/svg/icons', 
      prefix: 'icon',
      svgo: { // [SVGO Config](https://github.com/svg/svgo)
        plugins: ['cleanupAttrs']
      }
    }
  ]
}

```