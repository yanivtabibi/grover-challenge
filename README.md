# Introduction 
This is a solution for the Grover coding task and an Implementation of a RESTful Asset-Reservation API coded using NestJS, EventStore, and PostgreSQL.

To fulfill the scalability and seperation of concerns requirements mentioned the task, I chose to use a Domain-Driven Microservice approach.

The solution is aimed towards Event-Sourcing and CQRS,  

The stock reservation process uses a transactional ACID Database as the 'source of truth', as a conscious choice towards "Strong" consistency, 
rather than "Eventual" consistency which is maybe not an acceptable trade-off in this system. Using a transaction when querying for stock reservation 

Hopefully this can be discussed in detail in the next step of the application.

## The Inventory Domain

The main responsibilities of the Inventory domain is keeping track of Stores, Assets, and Stock amounts of these Assets in any of the Stores.    
Handling Reservations, Backorders, Restocking, Notifications about low-stock assets, etc. 

Currently only a few of these interactions are implemented :   
- Creating a Store  
- Creating an Asset  
- Reserving Stock of a specific Product+Store combination  
- Adding ("Refilling") Stock to a specific Product+Store combination  


## Running the solution
Assuming Node, npm and Docker & Docker-compose dependencies are met -  
 run `npm install` to prepare the environment, and `npm start` to invoke the app.

#### API 
Swagger API Explorer can be accessed from `http://localhost:7070/api/`  
This shows a list of available endpoints with an option to execute them right from the browser. 
It also shows examples of the JSON structures required by the API.
   
Main endpoint for this test is accessible using `POST /v1/inventory/reserve`, and the structure is as follows :
```
{
  "userId": "string",
  "storeId": "string",
  "assets": [
    {
      "assetId": "string",
      "quantity": 0
    }
  ]
}
```
`userId` and `storeId` are optional, the important part is the assets array where asset-stock information is provided, 
and that the assets actually exist and belong to the provided store (or the default store, id='1').

Upon starting the app, it will create a test store and some sample assets just for testing the functionality.

#### EventStore
EventStore is accessible from `http://localhost:2113/`, specifically `http://localhost:2113/web/index.html#/streams/$ce-inventory` for the inventory stream. default login is `admin/changeit`.

Every event that takes place in the system is persisted to the EventStore. This allows creating projections and representing the data in any required way based on the event stream

## Testing
Testing is written using jest and supertest, to provide an end-to-end testing solution supported by NestJS.

It uses separate Docker containers for the EventStore and PostgreSQL DB - using ports 5433, 2114 and 1114.
  
Running `npm test` you can build those containers and run the tests,

Mainly the ReserveStock endpoint was tested, covering validation, happy path (stock reserved), rejection (stock not reserved),  
and transactional edge cases (when a list of assets was requested, unless all of them are in stock - nothing should be reserved).

