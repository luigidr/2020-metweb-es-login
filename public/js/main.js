'use strict';

import App from './app.js';

const appContainer = document.querySelector('#app-container');
const navLinks = document.querySelector('#nav-links');

// creating our app
const app = new App(appContainer, navLinks);
