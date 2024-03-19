const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;
        this.initialize();
    }

    initialize() {
        if (!fs.existsSync(this.path)) {
           
            fs.writeFileSync(this.path, '[]');
        } else {
           
            this.loadProducts();
        }
    }

    loadProducts() {
        fs.readFile(this.path, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al cargar los productos:", err);
                return;
            }
            try {
                this.products = JSON.parse(data);
                if (this.products.length > 0) {
                    this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
                }
            } catch (parseErr) {
                console.error("Error al analizar los datos de productos:", parseErr);
            }
        });
    }

    saveProducts() {
        fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
            if (err) {
                console.error("Error al guardar los productos:", err);
            }
        });
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
            return null;
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

const manager = new ProductManager('./productosasync.json');
