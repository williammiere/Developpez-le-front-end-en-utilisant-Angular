import 'zone.js/testing'; // Remplacez cette ligne
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import './app/app.component.spec';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
//const context = require.context('./', true, /\.spec\.ts$/);
//context.keys().forEach(context);

