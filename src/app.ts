import cors from 'cors';
import express from 'express';
import http from 'http';

import { AdminRouter, ClientRouter, MerchantRouter } from './routes';

const App = express();
const server = http.createServer(App);

App.use(express.json({ limit: '15mb' }));
App.use(express.urlencoded({ extended: true }));
App.use(express.static('public'));
App.use(cors());

App.use('/store/api/v1', ClientRouter);
App.use('/merchant/api/v1', MerchantRouter);
App.use('/admin/api/v1', AdminRouter);

export default server;
