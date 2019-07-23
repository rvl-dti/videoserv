const express = require('express');
const downloader = require('./downloader');
const extract = require('./extractor')
const app = express();
const port = 4000;

app.get('/extract', (request, response) => {
  let url;
  const q = request.query;
  if (typeof q.id !== 'undefined') {
    const id = decodeURIComponent(q.id);
    const source = './video/' + id + '.mp4';
    const dest = './audio/' + id + '.wav';
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
    downloader.fetch(url, './video')
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
