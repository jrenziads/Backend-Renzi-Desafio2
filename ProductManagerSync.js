const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
            }
        } catch (err) {
            console.error("Error al cargar los productos:", err);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error("Error al guardar los productos:", err);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(existingProduct => existingProduct.code === product.code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...updatedProduct, id };
            this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

const manager = new ProductManager('productossync.json');

manager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 10,
    thumbnail: "thumbnail1.jpg",
    code: "ABC123",
    stock: 20
});

manager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 15,
    thumbnail: "thumbnail2.jpg",
    code: "DEF456",
    stock: 15
});

manager.addProduct({
    title: "Producto 3",
    description: "Descripción del producto 3",
    price: 20,
    thumbnail: "thumbnail3.jpg",
    code: "GHI789",
    stock: 25
});

console.log(manager.getProducts());
console.log(manager.getProductById(2));
console.log(manager.getProductById(4));

manager.updateProduct(2, { title: "Nuevo Producto 2", price: 25 });
console.log(manager.getProducts());

manager.deleteProduct(3);
console.log(manager.getProducts());
