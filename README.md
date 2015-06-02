# Friends Bet API
[![Build Status](https://travis-ci.org/FriendsBet/API.svg?branch=master)](https://travis-ci.org/FriendsBet/API) [![Coverage Status](https://coveralls.io/repos/FriendsBet/API/badge.svg?branch=master)](https://coveralls.io/r/FriendsBet/API?branch=master)

Friends Bet is an application that allows you and your friends to bet on sport results.

## INSTALLATION

**With [node](http://nodejs.org) installed:**
```sh
# Get the latest stable release of Sails
$ sudo npm install sails -g

# Clone the repo
$ git clone https://github.com/FriendsBet/API.git FriendsBetAPI

# cd into the new folder
$ cd FriendsBetAPI

# Install dependencies
$ npm install
```

## LAUNCHING

**Run MongoDB:**
```sh
# Run your MongoDB server
$ mongod
```

**Lift Sails:**
```sh
# Fire up the server
$ sails lift
```

The API is now running on port 1337.

## TESTING

**With the MongoDB server running:**
```sh
# Launch the tests
$ npm test
```