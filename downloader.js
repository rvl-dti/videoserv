const fs = require('fs');
const youtubedl = require('youtube-dl');
const path = require('path');

const fetch = (url, dir) => {
  return new Promise((resolve, reject) => {
    console.log('fetching start to ' + dir);
    const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
        ['--format=18'],
        {cwd: dir});

    const fileName = path.join(dir, url.split('=')[1] + '.mp4');
    video.pipe(fs.createWriteStream(fileName));
    video.on('end', ()=> resolve(fileName));
  });
};

exports.fetch = fetch;
