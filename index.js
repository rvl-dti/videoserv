const express = require('express');
const dotenv = require('dotenv');
const downloader = require('./downloader');
const extract = require('./extractor');
const app = express();
const port = 4000;

dotenv.config();
const videoDir = process.env.VIDEO_FOLDER;
const audioDir = process.env.AUDIO_FOLDER;

app.get('/extract', (request, response) => {
  const q = request.query;
  if (typeof q.id !== 'undefined') {
    const id = decodeURIComponent(q.id);
    const source = videoDir + id + '.mp4';
    const dest = audioDir + id + '.wav';
    extract.audio(source, dest)
        .then((fileName)=>{
          const result = JSON.stringify({status: 'ok', data: id});
          response.send(result);
        })
        .catch((err)=>{
          const errObject = JSON.stringify(err,
              Object.getOwnPropertyNames(err));
          const result = JSON.stringify({status: 'fail', data: errObject});
          response.send(result);
        });
  } else {
    response.send('provide video id to extract');
  }
});

app.get('/download', (request, response) => {
  let url;
  const q = request.query;
  if (typeof q.url !== 'undefined') {
    url = decodeURIComponent(q.url);
    downloader.fetch(url, videoDir)
        .then((fileName)=>{
          const result = JSON.stringify({status: 'ok', data: fileName});
          response.send(result);
        })
        .catch((err)=>{
          const errObject = JSON.stringify(err,
              Object.getOwnPropertyNames(err));
          const result = JSON.stringify({status: 'fail', data: errObject});
          response.send(result);
        });
  } else {
    response.send('hello');
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
