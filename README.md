## X API Docs

Welcome to the docs for X API. This RESTFUL API will allow you to perform simple CRUD operations on three resources - Users, Applications and Domains. 

The relationships between these resources has been modelled as follows: 

 - One-to-many relationship between Users and Applications 
 - Many-to-many relationship between Applications and Domains
 - Domains can be private. Private domains are only accessible to Users who have Applications that belong to that Private domain.
 - Public domains are accessible to all users

Tech stack - Node.js API with Sequelize as the ORM and SQLite3 as the database. 

### setting up a local version

Run these steps 

1. ``` $ npm install ``` This should download the dependencies from my package.json file onto your local machine
2. Create a database and connect ???
3. ``` $ npm start ``` This starts the Node server on port 3000


### API Methods

In order to illustrate the functionality of this API, I'll be using some dummy example data. 


### User methods

#### Create a new user

Implemented via HTTP POST request to route ```'/users' ```

General structure: 

| Form Params   | Data type   | Description |
| ------------- |:-------------:| -----:|
| Name     | String| Required |
| Email      | String      |   Required |


##### Example request body
`````` Content-Type: application/json ``````


```
{
  name: 'Michael', 
  email: 'michael@jackson.com'
}
```

##### Example response body

If your request is successful, you will receive:

```
Status Code: 201 - Created
```

```
{
  "user_id": "d9d66fe9-6f0a-4200-8f54-52a5c138fc7c",
  "name": "Michael",
  "email": "michael@jackson",
  "updatedAt": "2017-09-13T08:06:09.449Z",
  "createdAt": "2017-09-13T08:06:09.449Z"
}
```

Note that even though the client sends only name and email, the database creates the following properties for every entry in the User table - user_id, updatedAt and createdAt.

##### Unsuccesful requests

Your request could be unsuccessful in multiple ways. The response you receive for an unsuccessful request depends on the reason why your request was unsuccessful. 

###### Example one

Let's imagine you sent a request that looks like this: 



```
{
  name: 'Michael', 
  email: '22'
}
```

The API would deem this invalid because email is not in the poem format i.e. cat@dog.com

So you would receive a response like this: 

```
Status Code: 400 - Bad Request
```

```
{
  "name": "SequelizeValidationError",
  "errors": [
    {
      "message": "Validation isEmail on email failed",
      "type": "Validation error",
      "path": "email",
      "value": "22",
      "__raw": {}
    }
  ]
}
```  
###### Example two

 
If you sent a request that looks like this: 

```
{
  name: 'Michael' 
}
```
You would receive a response as follows: 

```
Status Code: 400 - Bad Request
```


```
{
  "name": "SequelizeValidationError",
  "errors": [
    {
      "message": "email cannot be null",
      "type": "notNull Violation",
      "path": "email",
      "value": null
    }
  ]
}
```
because both name and email are required inputs for creating a User resource. 


#####  Find all Users 
 - Implemented via HTTP GET request to ```'/users'```

If successful, you will receive an array of User objects in this format

```
Status Code: 200 - OK
```


```
 [
  {
    "user_id": "d9d66fe9-6f0a-4200-8f54-52a5c138fc7c",
    "name": "Michael",
    "email": "michael@jackson.com",
    "createdAt": "2017-09-12T17:28:14.497Z",
    "updatedAt": "2017-09-12T17:28:14.497Z"
  },
  {
    "user_id": "f3b17c76-9f34-4c9c-8e9c-bafa8fc5a145",
    "name": Andres,
    "email": andres@iniesta.com,
    "createdAt": "2017-09-13T08:05:10.693Z",
    "updatedAt": "2017-09-13T08:05:10.693Z"
  },
  {
    "user_id": "b65aea62-aa80-42e2-a97a-51efa7697424",
    "name": Isco,
    "email": isco@disco.com,
    "createdAt": "2017-09-13T08:05:48.664Z",
    "updatedAt": "2017-09-13T08:05:48.664Z"
  }
 ]
 
```
If unsuccessful, you would receive this: 

```
TOBI UPDATE THISSSS
```

##### Find a Specific User 
-   Implemented via HTTP GET request to ```'users/:user_id'```

Example request to route 'users/b13ca26e-4c1f-4d25-8214-48af17ef4002'  

Successful response: 

```
Status Code: 200 - OK
```


```
{
  "user_id": "d9d66fe9-6f0a-4200-8f54-52a5c138fc7c",
  "name": "Michael",
  "email": "michael@jackson.com",
  "createdAt": "2017-09-12T17:28:14.497Z",
  "updatedAt": "2017-09-12T17:28:14.497Z"
}

```

If unsuccesful, you will receive: 

```
Status Code: 500 - Internal Server Error
```

```
{
  "error": "Could not find a User in the database with that id"
}
```

#### Updating a specific User

Implemented via HTTP PATCH request to ```'users/:user_id'```

Let's imagine that we want to update our attributes on the User we previously created (Michael Jackson). We

Example request

```
{
  updates: {
    'name': 'Tom',
    'email: tom@jones.com
  }
}
```

to route ```users/d9d66fe9-6f0a-4200-8f54-52a5c138fc7c ``` 
(where this id maps to the Michael Jackson User instance)

If successful, you will receive: 


```
Status Code: 200 - OK
```

```
{
  "successfulUpdate": true,
  "updatedUser": {
    "user_id": "d9d66fe9-6f0a-4200-8f54-52a5c138fc7c",
    "name": "Tom",
    "email": "tom@jones.com",
    "createdAt": "2017-09-13T19:49:08.244Z",
    "updatedAt": "2017-09-13T20:11:55.815Z"
  }
}
```

If unsuccessful, you will receive an error object and a boolean indicating a failed update. This might look something like this - 

```
{
  "successfulUpdate": false,
  "err": {
    "name": "SequelizeValidationError",
    "errors": [
      {
        "message": "Validation isAlpha on name failed",
        "type": "Validation error",
        "path": "name",
        "value": "Tom@ba.com",
        "__raw": {}
      }
    ]
  }
}

```
In this example, the update failed because the client sent  ```name: 'Tom@ba.com``` which fails the alpha validation criterion that is defined in the User model.


#### Deleting a specific User

Implemented via HTTP DELETE request to ```'users/:user_id'```

If you wanted to delete the Michael Jackson example user, you would make the DELETE request to ```users/d9d66fe9-6f0a-4200-8f54-52a5c138fc7c```

If successful, you would receive something like this: 

```
Status Code: 200 - OK
```

```
{
  "message": "User was successfully deleted"
}
```


If unsuccessful, you would receive something like this: 

```
Status Code: 500 - Internal server error
```


```
{
  "message": "Could not delete User with id: 1521fcf5-358f-4559-897e-55750e14c49b"
}
```

#to be completed


#### Application methods

Create application


Implemented via HTTP POST request to ```users/:user_id/applications```

--- when you create an application, you can create and associate domains with that application

General structure: 

| Form Params   | Data type   | Description |
| ------------- |:-------------:| -----:|
| Name     | String| Required |
| Description     | String      |   Required |
| Domains? ?   | String      |   Required |
| Description     | String      |   Required |


Find all

Find one

Update

Delete


#### Domain methods

Find

Create



  
  
  
### Tests


### Testing this API

### Future plans for development

- Pagination - how? to limit x
- Security - how? SSL 
- Authentication for Private domains. 
- Caching/rate-limiting to prevent too many requests
- More data validations to confirm the nature of info
- More elegant error handling 
