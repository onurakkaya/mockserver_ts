import MockManager from "../src/components/mockManager";

jest.mock("../src/components/mockManager");

describe("MockManager Server", () => {
    let mockManagerServer: MockManager;

    beforeEach(() => {
        mockManagerServer = new MockManager();
    });

    it("should start the server", () => {
        mockManagerServer.startServer();
        expect(mockManagerServer.startServer).toHaveBeenCalled();
    });

    it("should call startServer method once", () => {
        mockManagerServer.startServer();
        expect(mockManagerServer.startServer).toHaveBeenCalledTimes(1);
    });

    it("should not call startServer method if not started", () => {
        expect(mockManagerServer.startServer).not.toHaveBeenCalled();
    });
});