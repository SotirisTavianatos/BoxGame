game in which if the boxes match you win the corresponding prize
## Project scripts

#### `npm run serve`

Runs the webpack dev server with development configuration, source maps, and live reloading. Opens the game automatically in the browser when run. Very useful for rapid development.

#### `npm run build:dev`

Runs `prebuild` script followed by webpack build command with development configuration.
Development build is output in `dist` folder.

#### `npm run build:prod`

Runs `prebuild` script followed by webpack build command with production configuration.
Production build is output in `dist` folder.

#### `npm run clean`

Deletes `dist` folder with all of its contents.

#### `npm run lint`

Enforces eslint formatting on all `.js` source files.

#### `npm run prebuild`

Convenient script which runs `clean` and `lint` scripts sequentially.


