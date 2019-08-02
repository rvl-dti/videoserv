const tdl = require('./tdl');
const ydl = require('./ydl');

const fetch = (url, dir) => {
  return new Promise((resolve, reject)=>{
    if (/https:\/\/www.youtube.com/.test(url)) {
      ydl.fetch(url, dir)
          .then((res)=>resolve(res))
          .catch((err)=>reject(new Error(err)));
    } else if (/https:\/\/twitter.com/.test(url)) {
      tdl.fetch(url, dir)
          .then((res)=>resolve(res))
          .catch((err)=>reject(new Error(err)));
    } else {
      reject(new Error('not able to download from link ' + url));
    }
  });
};

exports.fetch = fetch;
