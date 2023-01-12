const fs = require("fs");
const source = "./src/data/producto.json";

let id = 1;
let arrayObj = [];

class Producto {
  async createNewProduct(newProduct) {
    try {
      const data = await this.getAllProducts();
      if (data === false) {
        newProduct.id = id;
        newProduct.timestamp = Date.now();
        arrayObj.push(newProduct);
        await fs.promises.writeFile(source, JSON.stringify(arrayObj, null, 2));
      } else {
        let lastItem = data[data.length - 1];
        newProduct.id = lastItem.id + 1; 
        newProduct.timestamp = Date.now();
        data.push(newProduct);
        await fs.promises.writeFile(source, JSON.stringify(data, null, 2));
      }
      return newProduct;
    } catch (err) {
      return err;
    }
  }

  async getAllProducts() {
    try {
      const data = JSON.parse(await fs.promises.readFile(source, "utf-8"));
      if (data.length > 0) {
        return data; 
      } else {
        return false;
      }
    } catch (err) {
      return err;
    }
  }

  async getProductById(id) {
    try {
      const data = await this.getAllProducts();
      const product = data.find((obj) => obj.id == id);
      if (product) {
        return product;
      } else {
        return null;
      }
    } catch (err) {
      return err;
    }
  }

  async editProduct(array, id, product) {
    try {
      const index = array.findIndex((item) => item.id == id);
      array = array.filter((item) => item.id != id); 
      product.id = parseInt(id); 
      product.timestamp = Date.now(); 
      array.splice(index, 0, product); 
      await fs.promises.writeFile(source, JSON.stringify(array, null, 2));
      return product;
    } catch (err) {
      return err;
    }
  }

  async deleteProductById(id) {
    try {
      const obj = await this.getProductById(id); 
      if (obj === null) {
        return false;
      } else {
        const data = await this.getAllProducts();
        if (data) {
          const newArray = data.filter((item) => item.id != obj.id); 
          await fs.promises.writeFile(
            source,
            JSON.stringify(newArray, null, 2)
          );
          return true;
        }
      }
    } catch (err) {
      return err;
    }
  }
}

module.exports = new Producto();
