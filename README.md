# OlympicGamesStarter

The Olympic Medal Dashboard is an Angular application designed to display detailed information about the performance of different countries in the Olympic Games. The application allows users to view statistics such as the total number of participations, total athletes, and total medals for each country. Additionally, the application provides a graphical representation of these statistics using ngx-charts.

## Features
- Country Selection: Users can select a country from a list to view its Olympic statistics.
- Detail View: Detailed statistics for each selected country, including the total number of participations, athletes, and medals.
- Line Chart: A visual representation of the number of medals and athletes over the years for each country.
- Error Handling: Graceful handling of cases where data for a country is not found, with redirection to a custom "Not-Found" page.
- Loading Indicator: A visual indicator to show that data is being loaded.

## Technologies Used
- Angular: 14.1.3
- TypeScript: Programming language used for writing Angular components and services.
- RxJS: Library for reactive programming using Observables, used to manage asynchronous data.
- ngx-charts: Charting library for Angular, used to create visual representations of the data.
- SCSS : Préprocesseur pour CSS, utilisé pour le stylisme de l'application.

## Installation
- install dependencies : npm install

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

- Run the application: ng serve

