# OlympicGamesStarter

A website that shows statistics of previous Olympics Games.

Made in Angular 18.

## Development server

Don't forget to install your node_modules before starting (`npm install`).
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Project architecture

- `src\app`
  - `core` business logic
    - `models` entities
    - `services` access to data
  - `pages` page components

App component is the entry point of the application. Routes are defined inside app.route.ts file.
