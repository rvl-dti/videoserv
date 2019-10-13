const ytdl = require('youtube-dl');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const {exec} = require('child_process');
const videoPlayerUrlPrefix = 'https://twitter.com/i/videos/tweet/';

const videoFormat = (fullname)=>{
  return new Promise((resolve, reject) =>{
    ffmpeg.ffprobe(fullname, function(err, metadata) {
      if (err) {
        reject(err);
      }
      resolve(metadata.format.format_name);
    });
  });
};

const replaceExt = (fullname, ext)=>{
  const arr = fullname.split('\\');
  const path = arr.slice(0, arr.length-1).join('\\');
  const filename = arr[arr.length-1];
  return path + '\\' + filename.split('.')[0] + '.' + ext;
};

const rename = (fullname, ext)=>{
  return new Promise((resolve, reject)=>{
    const outname = replaceExt(fullname, ext);
    fs.rename(fullname, outname, (err)=>{
      if (err) reject(err);
      resolve(outname);
    });
  });
};

const convert = (fullname) => {
  return new Promise((resolve, reject)=>{
    const outname = replaceExt(fullname, 'mp4');
    const codecs = '-acodec copy -vcodec copy';
    const command = ['ffmpeg -i', fullname, codecs, outname].join(' ');
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(outname);
      }
    });
  });
};

const fetch = (url, dir) => {
  const tweetId = url.split('/').slice(-1)[0];
  const finalUrl = videoPlayerUrlPrefix + tweetId;
  return new Promise((resolve, reject) => {
    const filename = path.join(dir, tweetId + '.mp4');
    ytdl.exec(finalUrl, ['-o' + filename], {}, function(err, output) {
      if (err) reject(new Error(err));
      videoFormat(filename)
          .then((format)=>{
            if (format == 'mpegts') {
              return rename(filename, 'ts');
            } else {
              resolve(filename);
            }
          })
          .then((outname)=>{
            return convert(outname);
          })
          .then((outname)=>{
            fs.unlinkSync(replaceExt(outname, 'ts'));
            resolve(outname);
          })
          .catch((err)=>reject(err));
    });
  });
};

exports.fetch = fetch;
