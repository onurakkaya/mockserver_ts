# MockServer TS

This repository contains a baseline source for managing multiple mockservers in a project.

## Table of Contents

- [Setup](#setup)
- [Run](#run)
- [Debug](#debug)
- [Testing](#testing)
- [Description](#description)
- [Demo Mock Servers](#demomockservers)
- [Contributing](#contributing)
- [License](#license)

## Setup

1. The repository should be cloned:
    ```sh
    git clone https://github.com/onurakkaya/mockserver_ts.git
    cd mockserver_ts
    ```

2. Dependencies should be installed:
    ```sh
    yarn install
    ```

## Run

To start the mock server, the following command should be run:
```sh
yarn start
```

The MockManager server will be started on the default port `4040`. The available methods and MockManager server health can be browsed at http://localhost:4000.

## Debug

To debug the server, the built-in TSX debugger via VS Code can be used. A breakpoint should be added to the line which needs to be debugged, then the project should be started from VS Code (F5).

Note: To use the TSX debugger, the tsx node package must be installed globally on the computer.
```sh
npm install -g tsx
```

## Testing

To run the tests, the following command should be used:
```sh
yarn test
```

The tests are configured to be run with Jest, and a coverage report will be generated in the `coverage` directory.

## Description
This concept basically consists of two sections.

### Mock Server
All MockServers must be inherited from this class. The main functionality of a Mock Server is contained within the class.

#### Basic Info
Some basic information can be set or retrieved for the MockServer using the available functions listed below.
 - setDefaultPort(port)
 - getDefaultPort() --> returns port number
 - resetDefaultPort() --> default port is set to null
 - getServerName() --> returns server name
 - getServerInstance() --> returns fastify server object
 - getServerStatus() --> returns 1 if the server is started, 0 if the server is stopped.
 - getServerStatusString() --> returns "Started" or "Stopped" as a string
 - getRoutes() --> returns a list of defined custom routes as a ServerRoute array (method, path, handler)
 - The serverName can only be set in the constructor. If MockServer is extended, it can be set by calling the super() function, e.g., super("serverName").

#### Default Route
MockServer has its own predefined default route "/", which shows all available routes registered to MockServers.

#### Custom Route Registration
Custom routes can be registered via the registerRouteIfNotExists function. The function takes method (get/post/put/delete), path: string, and handler: function parameters.

Note: The path is case-sensitive.

#### Start/Stop Server
MockServer can be started and stopped by predefined StartServer and StopServer functions. StartServer also has an optional customPort parameter.

### Mock Manager
MockManager, which is also extended from MockServer, manages all MockServers registered to itself.

#### Default Route
This is extended from Mock Server.

#### Mock Server Registration
To have your service managed by MockManager, your mock server should be registered with the Mock Manager using the `registerMockServer(mockServer)` function.

#### Routes
#### /startServerByName
Multiple MockServers can be started with this request. The body should be in "MockServerRequest" type. A sample body is shown below:
```json
POST 
{
    "mockServers": [
        {
            "mockServer": "UserService",
            "customPort": null
        },
        {
            "mockServer": "ProductService",
            "customPort": null
        }
    ]
}
```

#### /stopServerByName
Multiple MockServers can be stopped with this request. The body should be in "MockServerRequest" type. A sample body is shown below:
```json
POST 
{
    "mockServers": [
        {
            "mockServer": "UserService",
            "customPort": null
        },
        {
            "mockServer": "ProductService",
            "customPort": null
        }
    ]
}
```
#### /getServerInfoByName
Server health and status information can be retrieved with this request for a specified mock server.
Usage: GET /getServerInfoByName?serverName=#ServerName#

#### /startAll
All registered mock servers can be started with this command.
Usage: GET /startAll

#### /stopAll
All registered mock servers can be stopped with this command.
Usage: GET /stopAll

#### /getServerInfo
Server health and status information for all registered mock servers can be retrieved with this command.
Usage: GET /getServerInfo

## DemoMockServers
Some example mock server implementations are provided.

### UserServiceMockServer
Basic create, read, and delete commands are included in the mock server. The server is registered in `index.ts` by default.

The `UserServiceMockServer` will be available on port `4001` by default. It provides the following endpoints:
- `GET /users`: Retrieve all users.
- `GET /users/:id`: Retrieve a user by ID.
- `POST /users`: Create a new user.
- `DELETE /users/:id`: Delete a user by ID.

### ProductServiceMockServer
Basic create, read, and delete commands, as well as an Authorization header check, are included in the mock server. The server is registered in `index.ts` by default.

The `ProductServiceMockServer` will be available on port `4002` by default. It provides the following endpoints:
- `GET /products`: Retrieve all products.
- `GET /products/:id`: Retrieve a product by ID.
- `POST /products`: Create a new product.
- `DELETE /products/:id`: Delete a product by ID.

## Contributing

Contributions are welcome! Please follow these steps:

1. **The repository should be forked**: Click the "Fork" button at the top right of the repository page.
2. **Your fork should be cloned**:
    ```sh
    git clone https://github.com/onurakkaya/mockserver_ts.git
    cd mockserver_ts
    ```
3. **A branch should be created**:
    ```sh
    git checkout -b your-branch-name
    ```
4. **Your changes should be made**: Implement your feature, bug fix, or documentation update.
5. **Your changes should be committed**:
    ```sh
    git commit -m "Description of your changes"
    ```
6. **Your fork should be pushed**:
    ```sh
    git push origin your-branch-name
    ```
7. **A pull request should be created**: Go to the original repository and click "New Pull Request".

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE.md) file for details.
