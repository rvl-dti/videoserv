const axios = require('axios');
const JSSoup = require('jssoup').default;
const ytdl = require('youtube-dl');
const path = require('path');

const videoPlayerUrlPrefix = 'https://twitter.com/i/videos/tweet/';

fetch = (url, dir) => {
  const tweetId = url.split('/').slice(-1)[0];
  return new Promise((resolve, reject)=>{
    const videoPlayerUrl = videoPlayerUrlPrefix + tweetId;
    axios.get(videoPlayerUrl)
        .then((res)=>{
          const soup = new JSSoup(res.data);
          const jsFileUrl = soup.find('script')['attrs']['src'];
          return axios.get(jsFileUrl);
        })
        .then((res)=>{
          const apiUrl = 'https://api.twitter.com/1.1/videos/tweet/config/' + tweetId + '.json';
          const bearerTokenRegex = new RegExp('Bearer ([a-zA-Z0-9%-])+');
          const bearerToken = bearerTokenRegex.exec(res.data)[0];
          return axios({method: 'get', url: apiUrl,
            headers: {'Authorization': bearerToken}});
        })
        .then((res)=>{
          const playbackUrl = res.data.track.playbackUrl;
          const filename = path.join(dir, tweetId + '.mp4');
          ytdl.exec(playbackUrl, ['-o' + filename], {}, function(err, output) {
            if (err) reject(new Error(err));
            resolve(filename);
          });
        })
        .catch((err)=>{
          reject(new Error(err));
        });
  });
};

exports.fetch = fetch;
