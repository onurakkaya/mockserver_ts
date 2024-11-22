import MockServer from '../src/components/mockServer';

export default class ProductServiceMockServer extends MockServer {
    constructor() {
        super("ProductService");
        this.setDefaultPort(4001);
        this.registerRouteIfNotExist("get", "/products", this.handleGetProducts.bind(this));
        this.registerRouteIfNotExist("get", "/products/:id", this.handleGetProductById.bind(this));
        this.registerRouteIfNotExist("post", "/products", this.handleCreateProduct.bind(this));
        this.registerRouteIfNotExist("delete", "/products/:id", this.handleDeleteProduct.bind(this));
    }

    private handleGetProducts(request: any, reply: any) {
        const authHeader = request.headers['authorization'];
        if (!authHeader || authHeader !== 'Bearer valid-token') {
            reply.status(401).send("Unauthorized");
            return;
        }

        reply.status(200).send([
            { id: 1, name: "Product 1" },
            { id: 2, name: "Product 2" }
        ]);
    }

    private handleGetProductById(request: any, reply: any) {
        const authHeader = request.headers['authorization'];
        if (!authHeader || authHeader !== 'Bearer valid-token') {
            reply.status(401).send("Unauthorized");
            return;
        }

        const productId = request.params.id;
        const product = [
            { id: 1, name: "Product 1" },
            { id: 2, name: "Product 2" }
        ].find(p => p.id === Number(productId));
        if (product) {
            reply.status(200).send(product);
        } else {
            reply.status(404).send("Product not found");
        }
    }


    private handleCreateProduct(request: any, reply: any) {
        const authHeader = request.headers['authorization'];
        if (!authHeader || authHeader !== 'Bearer valid-token') {
            reply.status(401).send("Unauthorized");
            return;
        }

        const newProduct = request.body;
        if (!newProduct || typeof newProduct.id !== 'number' || typeof newProduct.name !== 'string') {
            reply.status(400).send("Invalid product data");
            return;
        }

        reply.status(201).send(newProduct);
    }


    private handleDeleteProduct(request: any, reply: any) {
        const authHeader = request.headers['authorization'];
        if (!authHeader || authHeader !== 'Bearer valid-token') {
            reply.status(401).send("Unauthorized");
            return;
        }
        
        const productId = request.params.id;
        const products = [
            { id: 1, name: "Product 1" },
            { id: 2, name: "Product 2" }
        ];
        const productIndex = products.findIndex(p => p.id === Number(productId));
        if (productIndex >= 0) {
            products.splice(productIndex, 1);
            reply.status(204).send();
        } else {
            reply.status(404).send("Product not found");
        }
    }
}