import MockManager from "./components/mockManager";
import UserServiceMockServer from "../demos/userServiceMockServer";
import ProductServiceMockServer from "../demos/productServiceMockServer";

const mockManagerServer = new MockManager();

const demoUserServiceMockServer = new UserServiceMockServer();
const demoProductServiceMockServer = new ProductServiceMockServer();

mockManagerServer.registerMockServer(demoUserServiceMockServer);
mockManagerServer.registerMockServer(demoProductServiceMockServer);

mockManagerServer.startServer();