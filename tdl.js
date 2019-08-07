const ytdl = require('youtube-dl');
const path = require('path');
const videoPlayerUrlPrefix = 'https://twitter.com/i/videos/tweet/';

const fetch = (url, dir) => {
  const tweetId = url.split('/').slice(-1)[0];
  const finalUrl = videoPlayerUrlPrefix + tweetId;
  return new Promise((resolve, reject) => {
    const filename = path.join(dir, tweetId + '.mp4');
    ytdl.exec(finalUrl, ['-o' + filename], {}, function(err, output) {
      if (err) reject(new Error(err));
      resolve(filename);
    });
  });
};

exports.fetch = fetch;
