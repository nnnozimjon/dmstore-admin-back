import dotenv from 'dotenv';
import path from 'path';

import server from './src/app';

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '../', '.env'),
});

server.listen(parsed!.PORT, () => { });
