# NC News Backend Project

## Description

This project is the backend of a news website, providing the data for requests made by the corresponding frontend project via RESTful APIs. As my first ever complete backend server project, I aim to use this as a demonstration of all my learning up to this point, as well as a display of my current capabilities and foundation for my learning journey in backend development.

## Hosted Backend Server

The link to the hosted version of this backend server: https://news-webpage-project.onrender.com

## Frontend Repository

Link to the frontend GitHub repository of NC News: https://github.com/shaquillekiragu/nc-news-frontend

## Minimum Versions

You will need to have these versions or newer for the following technologies in order to run this project:

- Node.js - **v20.9.0** or newer
- PostgreSQL - **v20.x** or later

## Installation

**Instructions:**

1. Clone this repository:

```
https://github.com/shaquillekiragu/nc-news-backend.git
```

2. Once you've opened the repo, at the repository's root create a `.env.test` and `.env.development` file, and declare the variable below in each .env file, assigning the corresponding values to each variable as shown below.

.env.test:

```
PGDATABASE=nc_news_test
```

.env.development:

```
PGDATABASE=nc_news_development
```

3. To install all of the required dependencies for this repo locally, run this command:

```
npm install
```

4. Next, create the test and development databases by running:

```
npm run setup-dbs
```

5. And now seed the databases with this command:

```
npm run seed
```

Installation is now complete.

## Testing

In order to test the API endpoints on this server, run the following command:

```
npm run test

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
```

This command will run the integration tests for the api endpoints, as well as the utilities tests for the seeding functions.
