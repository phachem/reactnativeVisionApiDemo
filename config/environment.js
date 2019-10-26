//environment.js
var environments = {
    staging: {
      // REPLACE all these with your own values:
      
      FIREBASE_API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      FIREBASE_AUTH_DOMAIN: 'gt-hackathon-workshop.firebaseapp.com',
      FIREBASE_DATABASE_URL: 'https://gt-hackathon-workshop.firebaseio.com/',
      FIREBASE_PROJECT_ID: 'gt-hackathon-workshop',
      FIREBASE_STORAGE_BUCKET: 'gs://gt-hackathon-workshop.appspot.com/',
      FIREBASE_MESSAGING_SENDER_ID: '920491288477',
      GOOGLE_CLOUD_VISION_API_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    },
    production: {
      // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
    }
  };
  
  function getReleaseChannel() {
    let releaseChannel = Expo.Constants.manifest.releaseChannel;
    if (releaseChannel === undefined) {
      return 'staging';
    } else if (releaseChannel === 'staging') {
      return 'staging';
    } else {
      return 'staging';
    }
  }
  function getEnvironment(env) {
    console.log('Release Channel: ', getReleaseChannel());
    return environments[env];
  }
  var Environment = getEnvironment(getReleaseChannel());
  export default Environment;
