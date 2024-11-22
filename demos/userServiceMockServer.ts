import MockServer from '../src/components/mockServer';

type User = {
    id: number;
    name: string;
};

export default class UserServiceMockServer extends MockServer {
    private readonly users: User[] = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" }
    ];

    constructor() {
        super("UserService");
        this.setDefaultPort(4000);
        this.registerRouteIfNotExist("get", "/users", this.handleGetUsers.bind(this));
        this.registerRouteIfNotExist("get", "/users/:id", this.handleGetUserById.bind(this));
        this.registerRouteIfNotExist("post", "/users", this.handleCreateUser.bind(this));
        this.registerRouteIfNotExist("delete", "/users/:id", this.handleDeleteUser.bind(this));
    }

    private handleGetUsers(request: any, reply: any) {
        reply.status(200).send(this.users);
    }

    private handleGetUserById(request: any, reply: any) {
        const userId = request.params.id;
        const user = this.users.find(u => u.id === Number(userId));
        if (user) {
            reply.status(200).send(user);
        } else {
            reply.status(404).send("User not found");
        }
    }

    private handleCreateUser(request: any, reply: any) {
        const newUser = request.body as User;
        if (!newUser || typeof newUser.id !== 'number' || typeof newUser.name !== 'string') {
            reply.status(400).send("Invalid user data");
            return;
        }

        this.users.push(newUser);
        reply.status(201).send(newUser);
    }

    private handleDeleteUser(request: any, reply: any) {
        const userId = request.params.id;
        const userIndex = this.users.findIndex(u => u.id === Number(userId));
        if (userIndex >= 0) {
            this.users.splice(userIndex, 1);
            reply.status(204).send();
        } else {
            reply.status(404).send("User not found");
        }
    }
}
