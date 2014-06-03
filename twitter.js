var Twitter = require('twit');
var sentiment = require('sentiment');

var T = new Twitter({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET, 
    access_token:         process.env.ACCESS_TOKEN_KEY,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

var stream = T.stream('user', {track: 'APIRXR'});

var scores = {
  tweetSentiments: []
}

var thresholds = {
  high: 1,
  low: -1
}

stream.on('tweet', function(tweet){
  var newTweet = {
    time: tweet.created_at,
    score: sentiment(tweet.text).score    
  }
  // add new tweet to scores collection
  scores.tweetSentiments.push(newTweet);

  // if tweet score exceeds thresholds, take action
  if(newTweet.score > thresholds.high){
    retweet(tweet);
    console.log('Positive tweet retweeted!');
  } else if(newTweet.score < thresholds.low){
    console.log('Negative tweet!');
  }

  console.log('\n\n\n\n\nTweet:', tweet.text);
  console.log('Score:', tweet.score);
  console.log('Composite Score:', aggregateScore(scores.tweetSentiments));
});

function retweet(tweet){
  T.post('statuses/retweet/' + tweet.id);
}

var aggregateScore = function(collection, start, end){
  // escape aggregateScore if collection is empty or
  // start is in the future
  if(!collection.length || start > new Date()) return 0;
  // start defaults to last midnight
  start = start || new Date((new Date()).setHours(0,0,0,0));
  // end defaults to current time
  end = end || new Date();

  var totalScore = 0;
  var numberOfTweets = 0;

  // check every tweet
  // TODO: Implement binarySearch to find start tweet
  for(var i = 0; i < collection.length; i++){
    var tweetTime = new Date(collection[i].time);
    if(start <= tweetTime <= end ){
      totalScore += collection[i].score;
      numberOfTweets++;
    }
    if(tweetTime > end) break;
  }

  var aggregate = totalScore / numberOfTweets;
  return aggregate;
};