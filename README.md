# Olympic Games App

Vous trouverez dans le dossier src/app/pages les deux page de cette application "home" et "details".
Ces classes font appel à des services qui sont centralisés dans le dossier src/app/core/services.
Vous trouverez au même niveau le dossier contenant les modèles.
NGXData correspond au format de données utilisé par le pie chart (home), quand NGXLineData correspond au line chart (details).

Pour lancer le serveur angular : npm start ou ng serve selon votre configuration
Pour compiler le projet : ng build



En cas de doute, consulter la partie de ce README générée automatiquement par Angular :

# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Where to start

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)

I suggest you to start by understanding this starter code. Pay an extra attention to the `app-routing.module.ts` and the `olympic.service.ts`.

Once mastered, you should continue by creating the typescript interfaces inside the `models` folder. As you can see I already created two files corresponding to the data included inside the `olympic.json`. With your interfaces, improve the code by replacing every `any` by the corresponding interface.

You're now ready to implement the requested features.

Good luck!
