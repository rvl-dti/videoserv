const extractAudio = require('ffmpeg-extract-audio');

const audio = (source, dest)=>{
  return extractAudio({
    input: source,
    output: dest
  })
}

exports.audio = audio;