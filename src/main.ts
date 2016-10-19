/// <reference path="../typings.d.ts" />

import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; 

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch((err: any) => console.error(err));