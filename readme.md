# Framer ESM Example Setup

This is an example how to set up a repository that builds code which can be consumed in Framer. It builds standard JavaScript into ES Modules that you can both use locally for development or to deploy to any http server for distribution across your team or the internet.

- `yarn run serve` This runs a local web server with the built code.
- `yarn run build` This builds the code in `dist`.

All the magic is in the `esmbuild` folder. Contributions are welcome.

### Features

- Built on `esbuild` for speed and to support JavaScript, TypeScript and JSX.
- Custom plugin to handle ESM imports and rewrite local import paths.
- CSS Modules plugin to support writing css scoped modules.
- GitHub Workflow to deploy versioned code on GitHub pages.

## 🏎 Quickstart

Start the development server with:

```
yarn run serve
```

Open Framer, create a code file and paste the following:

```.tsx
import { addPropertyControls, ControlType } from "framer"
import { Button as ImportedButton } from "http://127.0.0.1:8000/index.js"

export const Button: React.ComponentType = ImportedButton

addPropertyControls(Button, {
    title: {
        title: "Title",
        type: ControlType.String,
        defaultValue: "Title",
    },
})
```

You can now add your component to the canvas and configure it using the defined `propertyControls`. This setup assumes you want to define them only on the Framer side (keeping your code clean) but you can also keep them in the original source.

The imported esm gets cached quite agressively, if you want to make sure you see the latest version you can add a random value to the imported url line:

```.tsx
import { Button } from "http://127.0.0.1:8001/index.js?123"
```

If you forget to start your local server, your component will render with:

```
Error in <name>.tsx Failed to Fetch
```

## Live Reload

To refresh the components on Framer's canvas when you make changes locally, you can use the `useRealtimeComponent` hook. Whenever a build is completed, it will fetch the latest version of that component and automatically re-render on the canvas:

```.tsx
import * as React from "react"
import { addPropertyControls, ControlType, PropertyControls } from "framer"
import { Button as ImportedComponent } from "http://127.0.0.1:8000/Button.js"
import { useRealtimeComponent } from "http://127.0.0.1:8000/utils/live-reload/useRealtimeComponent.js"

const InnerButton = (props) => {
    const Component = useRealtimeComponent(ImportedComponent, "Button")

    return <Component {...props} />
}

export const Button: React.ComponentType = InnerButton

addPropertyControls(InnerButton, ImportedComponent.propertyControls || {})

```

**There is one gotcha**: if you are iterating on property controls, they will not update immediately in Framer's UI. You will need to save the code file in the Framer project again or refresh the project to see the latest changes.

## Deployment

Once you are ready to deploy your code, it should be uploaded to an https endpoint with a versioned url. We have set up a [Workflow](https://github.com/framer/example-framer-esm-setup/actions) to build the code and deploy to [GitHub Pages](https://github.com/framer/example-framer-esm-setup/tree/pages). To ship a next version you simply type:

```
yarn run deploy
```

You'll have to type a new version (let's say `1.0.4`), and soon the code will be deployed to: https://framer.github.io/example-framer-esm-setup/esmbuild@1.0.4/index.js. You can now update your imports to the production url and you'll get the exact same result:

```.tsx
import { Button } from "https://framer.github.io/example-framer-esm-setup/esmbuild@1.0.4/index.js"
```

It's very important to version your code, so endpoints stay stable. To move to a new version, you simply update the import urls wherever you need.

## CSS

You can use the default esbuild [css importer](https://esbuild.github.io/content-types/#css), or you can use a [plugin to use css modules](https://github.com/indooorsman/esbuild-css-modules-plugin), that optionally auto inserts the css as a `<style>` tag (as configured).

## Imports

The `plugin.esm.js` makes sure that your local file imports are translated to esm imports. In the example configurations it works as follows:

#### Externals (for import maps)

```.tsx
import React from "react"
import ReactDOM from "react-dom"
import Framer from "framer"
import motion from "framer-motion"
```

Externals work like externals, so they can be picked up by an [import map](https://github.com/WICG/import-maps). In Framer we defined specific ones in the current import map, so we marked them as externals in the setup here.

#### Node Modules

```.tsx
import * as _ from "lodash"
```

`node_modules` work like you would expect. You can just install them with `yarn` and they'll be inlined in the module that imports them.

#### URLs

```.tsx
import * as _ from "https://ga.jspm.io/npm:lodash@4.17.21/index.js"
```

Url imports will just be kept intact so you can do non local esm imports.

#### ESM

```.tsx
import { Button } from "./Button"
```

Local esm imports will be rewritten to include the file extension:

```.tsx
import { Button } from "./Button.js"
```

## Gotchas

**Private code**: you should keep your source private, but not your built code. Make sure to enable `minify` in the `esmbuild.js` script to minify your code.

**Assets**: you can host your assets (images, movies) anywhere you like and just use the full urls to use them in your components.
