# MySQL Book Library API

An API that allows user to Create, Read, Update and Delete data in a book library database.

## Instructions

You can make the following requests to the server using Postman or a similar programme:

- GET /(dataType) - Gets all available data of specified type
- POST /(dataType) - Creates a new entry in the database of specified type

- GET/(dataType)/:id - Gets data with the specified id number for the specified data type
- PATCH/(dataType)/:id - Updates data with the specified id number for the specified data type
- DELETE/(dataType)/:id - Updates data with the specified id number for the specified data type

Available data types are:

- author
- book
- genre
- reader

**Note that you will need to set up a local dev environment to make these requests. I intend to create a live demo than can be run from within a browser in the future :)**

## Built with

- Express
- MySQL2
- Sequelize

## Testing Utilities

- Mocha
- Chai
- Supertest

## Packages Used

- dotenv
- nodemon

## Author

Tom Hammersley
