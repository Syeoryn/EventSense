var Twitter = require('twit');

var T = new Twitter({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET, 
    access_token:         process.env.ACCESS_TOKEN_KEY,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

var stream = T.stream('user', {track: 'APIRXR'});

stream.on('tweet', function(tweet){
  console.log(tweet);
  console.log('\n\n\n\n\nTweet:', tweet.text);
});
