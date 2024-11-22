import MockManager from "../../src/components/mockManager";
import MockServer from "../../src/components/mockServer";
import MockServerRequest from "../../src/types/mockServerRequest";
import MockServerResponse from "../../src/types/mockServerResponse";

describe("MockManager", () => {
    let mockManager: MockManager;
    let mockServer: MockServer;

    beforeEach(() => {
        mockManager = new MockManager();
        mockServer = new MockServer("TestServer");
        mockManager.registerMockServer(mockServer);
    });

    test("should register a mock server", () => {
        expect(mockManager["mockServers"].length).toBe(1);
        expect(mockManager["mockServers"][0]).toBe(mockServer);
    });

    test("should get server info by name", () => {
        const server = mockManager.getServerInfoByName("TestServer");
        expect(server).toBe(mockServer);
    });

    test("should return null if server not found by name", () => {
        const server = mockManager.getServerInfoByName("NonExistentServer");
        expect(server).toBeNull();
    });

    test("should start mock servers", async () => {
        jest.spyOn(mockServer, "startServer").mockResolvedValue({ serverName: "TestServer", status: "started", message: "Server started" });
        const mockStartRequest: MockServerRequest = { mockServers: [{ mockServer: "TestServer", customPort: null }] };
        const response: MockServerResponse = await mockManager.startMockServers(mockStartRequest);
        expect(response.mockServers.length).toBe(1);
        expect(response.mockServers[0].status).toBe("started");
    });

    test("should stop mock servers", async () => {
        jest.spyOn(mockServer, "stopServer").mockResolvedValue({ serverName: "TestServer", status: "stopped", message: "Server stopped" });
        const mockStopRequest: MockServerRequest = { mockServers: [{ mockServer: "TestServer", customPort: null }] };
        const response: MockServerResponse = await mockManager.stopMockServers(mockStopRequest);
        expect(response.mockServers.length).toBe(1);
        expect(response.mockServers[0].status).toBe("stopped");
    });

    test("should handle service start", async () => {
        const request = { body: { mockServers: [{ mockServer: "TestServer", customPort: null }] } };
        const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(mockManager, "startMockServers").mockResolvedValue({ mockServers: [{ serverName: "TestServer", status: "started", message: "Server started" }] });
        await mockManager.handleServiceStart(request, reply);
        expect(reply.status).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({ mockServers: [{ serverName: "TestServer", status: "started", message: "Server started" }] });
    });

    test("should handle service stop", async () => {
        const request = { body: { mockServers: [{ mockServer: "TestServer", customPort: null }] } };
        const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(mockManager, "stopMockServers").mockResolvedValue({ mockServers: [{ serverName: "TestServer", status: "stopped", message: "Server stopped" }] });
        await mockManager.handleServiceStop(request, reply);
        expect(reply.status).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({ mockServers: [{ serverName: "TestServer", status: "stopped", message: "Server stopped" }] });
    });

    test("should handle get server info by name", async () => {
        const request = { query: { serverName: "TestServer" } };
        const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await mockManager.handleGetServerInfoByName(request, reply);
        expect(reply.status).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({ mockServerName: "TestServer", status: "0", message: "Portnull, Server Status: Stopped" });
    });

    test("should handle get server info all", async () => {
        const request = {};
        const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await mockManager.handleGetServerInfoAll(request, reply);
        expect(reply.status).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({ mockServers: [{ serverName: "TestServer", status: "0", message: "Portnull, Server Status: Stopped" }] });
    });
});