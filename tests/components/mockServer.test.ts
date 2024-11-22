import MockServer from "../../src/components/mockServer";
import { ServerStatus } from "../../src/enums/serverStatus";
import ServerResponse from "../../src/types/serverResponse";
import ServerRoute from "../../src/types/serverRoute";

describe('MockServer', () => {
    let mockServer: MockServer;

    beforeEach(() => {
        mockServer = new MockServer('TestServer');
    });

    afterEach(async () => {
        if (mockServer.getServerStatus() === ServerStatus.Started) {
            await mockServer.stopServer();
        }
    });

    test('should initialize with default values', () => {
        expect(mockServer.getServerName()).toBe('TestServer');
        expect(mockServer.getServerStatus()).toBe(ServerStatus.Stopped);
        expect(mockServer.getDefaultPort()).toBeNull();
    });

    test('should set and get default port', () => {
        mockServer.setDefaultPort(3000);
        expect(mockServer.getDefaultPort()).toBe(3000);
    });

    test('should reset default port', () => {
        mockServer.setDefaultPort(3000);
        mockServer.resetDefaultPort();
        expect(mockServer.getDefaultPort()).toBeNull();
    });

    test('should start server with default port', async () => {
        mockServer.setDefaultPort(3000);
        const response: ServerResponse = await mockServer.startServer();
        expect(response.status).toBe('Ok');
        expect(response.message).toBe('Port: 3000');
        expect(mockServer.getServerStatus()).toBe(ServerStatus.Started);
    });

    test('should fail to start server without port', async () => {
        const response: ServerResponse = await mockServer.startServer();
        expect(response.status).toBe('Failed');
        expect(response.message).toBe('Port & Default Port are not set.');
        expect(mockServer.getServerStatus()).toBe(ServerStatus.Stopped);
    });

    test('should stop server', async () => {
        mockServer.setDefaultPort(3000);
        await mockServer.startServer();
        const response: ServerResponse = await mockServer.stopServer();
        expect(response.status).toBe('Ok');
        expect(response.message).toBe('Server stopped.');
        expect(mockServer.getServerStatus()).toBe(ServerStatus.Stopped);
    });

    test('should register a new route', async () => {
        const handler = jest.fn();
        await mockServer.registerRouteIfNotExist('get', '/test', handler);
        const routes: ServerRoute[] = mockServer.getRoutes();
        expect(routes.map(route => route.path)).toContain('/test');
    });

    test('should not register an existing route', async () => {
        const handler = jest.fn();
        await mockServer.registerRouteIfNotExist('get', '/test', handler);
        await mockServer.registerRouteIfNotExist('get', '/test', handler);
        const routes = mockServer.getRoutes();
        expect(routes.length).toBe(1);
    });

    test('should return default route handler response', async () => {
        const response = await mockServer.getServerInstance().inject({
            method: 'GET',
            url: '/'
        });
        expect(response.statusCode).toBe(200);
        const jsonResponse = JSON.parse(response.payload);
        expect(jsonResponse).toEqual({});
    });

    test('should return registered routes in default route handler response', async () => {
        const handler = jest.fn();
        await mockServer.registerRouteIfNotExist('get', '/test', handler);
        const response = await mockServer.getServerInstance().inject({
            method: 'GET',
            url: '/'
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            serverName: 'TestServer',
            port: null,
            status: 'Stopped',
            routes: [{ method: 'get', path: '/test' }]
        });
    });

    test('should handle multiple routes', async () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        await mockServer.registerRouteIfNotExist('get', '/test1', handler1);
        await mockServer.registerRouteIfNotExist('post', '/test2', handler2);
        const routes = mockServer.getRoutes();
        expect(routes.length).toBe(2);
        expect(routes.map(route => route.path)).toContain('/test1');
        expect(routes.map(route => route.path)).toContain('/test2');
    });

    test('should handle route with different methods', async () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        await mockServer.registerRouteIfNotExist('get', '/test', handler1);
        await mockServer.registerRouteIfNotExist('post', '/test', handler2);
        const routes = mockServer.getRoutes();
        expect(routes.length).toBe(2);
        expect(routes.filter(route => route.path === '/test').length).toBe(2);
    });
});