import cors from 'cors';
import express from 'express';
import http from 'http';
import Router from 'routes';

const App = express();
const server = http.createServer(App);

App.use(express.json({ limit: '15mb' }));
App.use(express.urlencoded({ extended: true }));
App.use(express.static('public'));
App.use(cors());
App.use(Router);

export default server;
