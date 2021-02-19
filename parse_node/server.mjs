import express from 'express';
import { ParseServer } from 'parse-server';
import http from 'http';

const app = express();
const api = new ParseServer({
  databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
  cloud: './cloud/main.js',
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  javascriptKey: process.env.PARSE_SERVER_JAVASCRIPT_KEY,
  liveQuery: process.env.PARSE_SERVER_LIVE_QUERY,
});

const port = 1337;
const ws_port = 1338;

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

app.listen(port, () => {
  console.log(`parse-server running on port ${port}.`);
});

// initialize live query
const httpServer = http.createServer(app);
httpServer.listen(ws_port);
const parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);
