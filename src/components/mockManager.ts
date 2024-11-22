import MockServer from "./mockServer";
import ServerResponse from "../types/serverResponse";
import MockServerRequest from "../types/mockServerRequest";
import MockServerResponse from "../types/mockServerResponse";

export default class MockManager extends MockServer {
    private readonly mockServers: MockServer[] = [];

    constructor() {
        super("MockManager");
        this.setDefaultPort(4040);
        this.registerRouteIfNotExist("post", "/startServerByName", this.handleServiceStart.bind(this));
        this.registerRouteIfNotExist("post", "/stopServerByName", this.handleServiceStop.bind(this));
        this.registerRouteIfNotExist("get", "/getServerInfoByName", this.handleGetServerInfoByName.bind(this));
        this.registerRouteIfNotExist("get", "/startAll", this.handleServiceStartAll.bind(this));
        this.registerRouteIfNotExist("get", "/stopAll", this.handleServiceStopAll.bind(this));
        this.registerRouteIfNotExist("get", "/getServerInfo", this.handleGetServerInfoAll.bind(this));
    }

    public registerMockServer(mockServer: MockServer): void {
        this.mockServers.push(mockServer);
    }

    public getServerInfoByName(mockServer: string): MockServer|null {
        return this.mockServers.find((server: MockServer) => server.getServerName() === mockServer) ?? null;
    }

    public async startMockServers(mockStartRequest: MockServerRequest): Promise<MockServerResponse> {
        const mockServerResponse: MockServerResponse = { mockServers: [] };
        for (const mockServerItem of mockStartRequest.mockServers) {
            const server: MockServer|null = this.getServerInfoByName(mockServerItem.mockServer);
            if (server) {
                console.log(`Request: Start: ${mockServerItem.mockServer} Server on port ${mockServerItem.customPort ?? server.getDefaultPort()}`);
                const response: ServerResponse = await server.startServer(mockServerItem.customPort);
                mockServerResponse.mockServers.push({ serverName: mockServerItem.mockServer, status: response.status, message: response.message });
            }
        }
        return Promise.resolve(mockServerResponse);
    }

    public async stopMockServers(mockStopRequest: MockServerRequest): Promise<MockServerResponse> {
        let mockServerResponse: MockServerResponse = { mockServers: [] };
        for (const mockServerItem of mockStopRequest.mockServers) {
            const server: MockServer|null = this.getServerInfoByName(mockServerItem.mockServer);
            if (server) {
                console.log(`Request: Stop: ${mockServerItem.mockServer} Server`);
                const response: ServerResponse = await server.stopServer();
                mockServerResponse.mockServers.push({ serverName: mockServerItem.mockServer, status: response.status, message: response.message });
            }
        }
        return Promise.resolve(mockServerResponse);
    }

    public async handleServiceStart(request: any, reply: any): Promise<void> {
        const mockStartRequest: MockServerRequest = request.body;
        const serviceResponse: MockServerResponse = await this.startMockServers(mockStartRequest);
        reply.status(200).send(serviceResponse);
    }

    public async handleServiceStartAll(request: any, reply: any): Promise<void> {
        const mockStartRequest: MockServerRequest = { mockServers: [] };
        this.mockServers.forEach((server: MockServer) => mockStartRequest.mockServers.push({ mockServer: server.getServerName(), customPort: null }));
        const serviceResponse: MockServerResponse = await this.startMockServers(mockStartRequest);
        reply.status(200).send(serviceResponse);
    }
    
    public async handleServiceStop(request: any, reply: any): Promise<void> {
        const mockStopRequest: MockServerRequest = request.body;
        const serviceResponse: MockServerResponse = await this.stopMockServers(mockStopRequest);
        reply.status(200).send(serviceResponse);
    }

    public async handleServiceStopAll(request: any, reply: any): Promise<void> {
        const mockStopRequest: MockServerRequest = { mockServers: [] };
        this.mockServers.forEach((server: MockServer) => mockStopRequest.mockServers.push({ mockServer: server.getServerName(), customPort: null }));
        const serviceResponse: MockServerResponse = await this.stopMockServers(mockStopRequest);
        reply.status(200).send(serviceResponse);
    }

    public async handleGetServerInfoByName(request: any, reply: any): Promise<void> {
        const queryServerName: string = request.query.serverName;
        const server: MockServer|null = this.getServerInfoByName(queryServerName);
        if (server) {
            reply.status(200).send({ mockServerName: server.getServerName(), status: server.getServerStatus().toString(), message: `Port${server.getDefaultPort()}, Server Status: ${server.getServerStatusString()}` });
        } else {
            reply.status(200).send({ mockServerName: queryServerName, status: null, message: `Server ${queryServerName} not found` });
        }
    }

    public async handleGetServerInfoAll(request: any, reply: any): Promise<void> {
        const mockServerResponse: MockServerResponse = { mockServers: [] };
        this.mockServers.forEach((server: MockServer) => mockServerResponse.mockServers.push({ serverName: server.getServerName(), status: server.getServerStatus().toString(), message: `Port${server.getDefaultPort()}, Server Status: ${server.getServerStatusString()}` }));
        reply.status(200).send(mockServerResponse);
    }
}