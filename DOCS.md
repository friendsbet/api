# Documentation

The Friends Bet API is a RESTful API based on [Sails.js](http://sailsjs.org/).

## Authentication

ToDo

## Resources

**Find records:**
 - *GET /matches*
   * Get the matches list (limited to 30 elements)
 - *GET /matches?pool=A*
   * Get the pool A matches list
 - *GET /matches?where={"venue":{"contains":"Twickenham"}}*
   * Get a matches list that take place at Twickenham
 - *GET /matches?where={"kickOffAt":{">":2015-09-30}}*
   * Get the matches that happen after September 30
 - *GET /matches?sort=kickOffAt%20DESC*
   * Get the matches in descending order
 - *GET /matches?limit=10*
   * Just get a list of 10 matches
 - *GET /matches?skip=10*
   * Skip 10 matches
 - *GET /matches?populate=[teamA]*
   * Get the matches with more informations about one of the Team
 - *GET /matches/:id*
   * Get a precise match
 - *GET /matches/:id/teamB*
   * Get a Team in a match

**Play with instances**
 - *POST /matches*
   * Create a match instance
 - *PUT /matches/:id*
   * Update a match instance
 - *DELETE /matches/:id*
   * Destroy a match instance

You can find more informations on [Sails docs](http://sailsjs.org/#!/documentation/reference/blueprint-api).

### Bet

 - *GET /bets*

**Description**

Get a list of bets.

**Attributes**

| Name       | Description             | Type    | Example | Default | Required | Unique |
|------------|-------------------------|---------|---------|---------|----------|--------|
| scoreTeamA | The score bet on Team A | integer | 15      |         | Yes      | No     |
| scoreTeamB | The score bet on Team B | integer | 7       |         | Yes      | No     |

**Associated resources**

| Name  | Description                 | Type     | Model | Required |
|-------|-----------------------------|----------|-------|----------|
| match | The Match concerned         | Instance | Match | Yes      |
| user  | The User who's done the Bet | Instance | User  | Yes      |

### Group

 - *GET /groups*

**Description**

Get a list of groups.

**Attributes**

| Name        | Description                                  | Type    | Example                                                                    | Default | Required | Unique |
|-------------|----------------------------------------------|---------|----------------------------------------------------------------------------|---------|----------|--------|
| name        | The Group name                               | string  | "The Friends Bet group"                                                    |         | Yes      | Yes    |
| score       | The cumulative score of this Group           | integer | 1024                                                                       | 0       | No       | No     |
| description | Everything you need to know about this group | string  | "The England national rugby union team represents England in rugby union." |         | No       | No     |

**Associated resources**

| Name           | Description                 | Type     | Model      | Required |
|----------------|-----------------------------|----------|------------|----------|
| technicalAdmin | The first User of the Group | Instance | User       | Yes      |
| memberships    | The list of members         | List     | Membership | No       |

### Match

 - *GET /matches*

**Description**

Get a list of matches.

**Attributes**

| Name       | Description                          | Type     | Example                    | Default | Required | Unique |
|------------|--------------------------------------|----------|----------------------------|---------|----------|--------|
| kickOffAt  | The kick off in UTC                  | datetime | "2015-09-18T20:00:00.000Z" |         | Yes      | No     |
| stopBetsAt | When the User can't bet anymore      | datetime | "2015-09-18T20:00:00.000Z" |         | Yes      | No     |
| venue      | The location                         | string   | "Twickenham, London"       |         | Yes      | No     |
| importance | The importance coefficient           | float    | 1.5                        | 1.0     | No       | No     |
| scoreTeamA | The team A score                     | integer  | 15                         | 0       | No       | No     |
| scoreTeamB | The team B score                     | integer  | 7                          | 0       | No       | No     |
| pool       | The pool name during the group stage | string   | "A"                        | ''      | No       | No     |
| isEnded    | Is the match ended?                  | boolean  | true                       | false   | No       | No     |

**Associated resources**

| Name  | Description     | Type     | Model | Required |
|-------|-----------------|----------|-------|----------|
| teamA | The first Team  | Instance | Team  | Yes      |
| teamB | The second Team | Instance | Team  | Yes      |

### Membership

 - *GET /memberships*

**Description**

Get a list of memberships. A membership joins a user and a group. A user can have multiple groups and a group can have many users.

**Attributes**

| Name    | Description                         | Type    | Example | Default | Required | Unique |
|---------|-------------------------------------|---------|---------|---------|----------|--------|
| isAdmin | Is the User an admin of this Group? | boolean | true    | false   | No       | No     |

**Associated resources**

| Name  | Description                              | Type     | Model | Required |
|-------|------------------------------------------|----------|-------|----------|
| user  | The User in the Group                    | Instance | User  | Yes      |
| group | The Group in which the User participates | Instance | Group | Yes      |

### Team

 - *GET /teams*

**Description**

Get a list of teams.

**Attributes**

| Name        | Description                                 | Type   | Example                                                                    | Default | Required | Unique |
|-------------|---------------------------------------------|--------|----------------------------------------------------------------------------|---------|----------|--------|
| name        | The complete name of the Team               | string | "England"                                                                  |         | Yes      | Yes    |
| slug        | A slug is a short name given to a Team      | string | "eng"                                                                      |         | Yes      | Yes    |
| description | Everything you need to know about this team | string | "The England national rugby union team represents England in rugby union." |         | No       | No     |

**Associated resources**

| Name           | Description                                         | Type | Model | Required |
|----------------|-----------------------------------------------------|------|-------|----------|
| matchesAsTeamA | The Matches list associated with this Team as teamA | List | Match | No       |
| matchesAsTeamB | Same thing as teamB                                 | List | Match | No       |

### User

 - *GET /users*

**Description**

Get a list of users.

**Attributes**

| Name        | Description                          | Type    | Example             | Default | Required | Unique |
|-------------|--------------------------------------|---------|---------------------|---------|----------|--------|
| email       | The email adress of the User         | string  | "jon@snow.com"      |         | Yes      | Yes    |
| firstName   | The first name of the User           | string  | "Jon"               |         | Yes      | No     |
| lastName    | His/Her last name                    | string  | "Snow"              |         | Yes      | No     |
| description | Everything the User want you to know | string  | "King of the North" |         | No       | No     |
| score       | The cumulative score of the User     | integer | 127                 | 0       | No       | No     |

**Associated resources**

| Name        | Description                               | Type | Model      | Required |
|-------------|-------------------------------------------|------|------------|----------|
| bets        | The collection of the User Bets           | List | Bet        | No       |
| memberships | The Groups in which the User participates | List | Membership | No       |