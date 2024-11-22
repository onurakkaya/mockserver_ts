import fastify, { FastifyInstance } from "fastify";
import fastifyFormbody from "@fastify/formbody";
import { ServerStatus } from "../enums/serverStatus";
import ServerRoute from "../types/serverRoute";
import ServerRouteSimplified from "../types/serverRouteSimplified";
import ServerResponse from "../types/serverResponse";

export default class MockServer {
    private readonly serverName: string = '';
    private server!: FastifyInstance;
    private serverRoutes: ServerRoute[] = [];
    private serverState: ServerStatus = ServerStatus.Stopped;
    private defaultPort: number|null = null;

    constructor(serverName: string) {
        this.serverName = serverName;
        this.newServer();
    }

    private newServer(): void {
        // Server cannot be reopen after closing. So, create a new server instance.
        if (this.serverState === ServerStatus.Stopped) {
            this.server = fastify({ logger: true });
            this.server.register(fastifyFormbody);
            this.registerPreviousRoutes();
            this.server.get('/', this.defaultRouteHandler.bind(this));
        }
    }

    private defaultRouteHandler(request: any, reply: any): any {
        let result = { serverName: this.serverName, port: this.defaultPort, status: ServerStatus[this.serverState], routes: [] as ServerRouteSimplified[] };

        if (this.serverRoutes.length === 0) {
            reply.status(200).send({});
            return;
        }

        result.routes = this.serverRoutes.map((route: ServerRouteSimplified) => {
            return { method: route.method, path: route.path };
        });

        reply.status(200).send(result);
    }

    private registerPreviousRoutes() : void {
        if (this.serverRoutes.length === 0) {
            return;
        }

        const previousRoutes = this.serverRoutes;
        this.serverRoutes = [];
        previousRoutes.forEach((route: any) => this.registerRouteIfNotExist(route.method, route.path, route.handler));
    }

    public setDefaultPort(port: number): void {
        this.defaultPort = port;
    }

    public getDefaultPort(): number|null {
        return this.defaultPort;
    }

    public resetDefaultPort(): void {
        this.defaultPort = null;
    }

    public getServerName(): string {
        return this.serverName;
    }

    public getServerInstance(): FastifyInstance {
        return this.server;
    }

    public getServerStatus(): ServerStatus {
        return this.serverState;
    }

    public getServerStatusString(): string {
        return ServerStatus[this.serverState];
    }

    public getRoutes(): ServerRoute[] {
        return this.serverRoutes;
    }

    public async registerRouteIfNotExist(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: any): Promise<void> {
        if (!this.server.hasRoute({ method, url: path})) {
            this.server[method](path, handler);
            this.serverRoutes.push({ method, path, handler });
        }
    }

    public async startServer(port: number|null = null): Promise<ServerResponse> {
        this.newServer();
        const serverPort: number = port ?? this.defaultPort ?? -1;
        if (serverPort === -1) {
            this.serverState = ServerStatus.Stopped;
            return { serverName: this.serverName, status: 'Failed', message: 'Port & Default Port are not set.' };
        }

        if (this.serverState === ServerStatus.Started) {
            return { serverName: this.serverName, status: 'Failed', message: 'Server already started.' };
        }

        await this.server.listen({ port: serverPort ?? this.defaultPort, host: '0.0.0.0' });
        this.serverState = ServerStatus.Started;
        return { serverName: this.serverName, status: 'Ok', message: `Port: ${serverPort ?? this.defaultPort}` }; 
    }

    public async stopServer(): Promise<ServerResponse> {
        await this.server.close();
        this.serverState = ServerStatus.Stopped;
        return { serverName: this.serverName, status: 'Ok', message: 'Server stopped.' };
    }
}