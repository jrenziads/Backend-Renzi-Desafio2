const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const fileExists = await fs.access(this.path).then(() => true).catch(() => false);
            if (!fileExists) {
                console.log("El archivo de productos no existe. Se creará uno nuevo.");
                return;
            }

            const data = await fs.readFile(this.path, 'utf8');
            if (data.trim() === "") {
                console.log("El archivo de productos está vacío.");
                return;
            }
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
            }
        } catch (err) {
            console.error("Error al cargar los productos:", err);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Productos guardados correctamente.");
        } catch (err) {
            console.error("Error al guardar los productos:", err);
        }
    }

    async addProduct(product) {
        try {
            const arrayProducts = await this.getProducts();

            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                return console.error("Todos los campos son obligatorios.");
            }

            if (arrayProducts.some(existingProduct => existingProduct.code === product.code)) {
                return console.error("Ya existe un producto con el mismo código.");
            }

            product.id = arrayProducts.length ? arrayProducts[arrayProducts.length - 1].id + 1 : 1;
            arrayProducts.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
            
            console.log('Producto agregado satisfactoriamente');
        } catch (error) {
            console.error(error);
        }
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }

    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...updatedProduct, id };
            await this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

const manager = new ProductManager('productosasync.json');

(async () => {
    await manager.addProduct({
        title: "Producto 1",
        description: "Descripción del producto 1",
        price: 10,
        thumbnail: "thumbnail1.jpg",
        code: "ABC123",
        stock: 20
    });

    await manager.addProduct({
        title: "Producto 2",
        description: "Descripción del producto 2",
        price: 15,
        thumbnail: "thumbnail2.jpg",
        code: "DEF456",
        stock: 15
    });

    await manager.addProduct({
        title: "Producto 3",
        description: "Descripción del producto 3",
        price: 20,
        thumbnail: "thumbnail3.jpg",
        code: "GHI789",
        stock: 25
    });

    console.log(await manager.getProducts());
    console.log(await manager.getProductById(2));
    console.log(await manager.getProductById(4));

    await manager.updateProduct(2, { title: "Nuevo Producto 2", price: 25 });
    console.log(await manager.getProducts());

    await manager.deleteProduct(3);
    console.log(await manager.getProducts());
})();
