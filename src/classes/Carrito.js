const fs = require("fs");
const source = "./src/data/carrito.json";

let id = 1;
let arrayObj = [];

class Carrito {
  async createNewCart(cart) {
    try {
      const data = await this.getAll();
      if (data === false) {
        cart.id = id; 
        cart.timestamp = Date.now();
        arrayObj.push(cart);
        await fs.promises.writeFile(source, JSON.stringify(arrayObj, null, 2));
      } else {
        // Si no está vacio
        let lastItem = data[data.length - 1]; 
        cart.id = lastItem.id + 1; 
        cart.timestamp = Date.now();
        data.push(cart); 
        await fs.promises.writeFile(source, JSON.stringify(data, null, 2));
      }
      return cart;
    } catch (err) {
      return err;
    }
  }

  async createNewProduct(id, newProduct) {
    try {
      let array = await this.getAll();
      if (array === false) {
        return undefined; 
      } else {
        const data = await this.getCartById(id);
        if (data === null) {
          return false; 
        } else {
          array = array.filter((item) => item.id != data.id);
          if (data.productos.length > 0) {
            let lastItem = data.productos[data.productos.length - 1]; 
            newProduct.id = lastItem.id + 1; 
          } else {
            newProduct.id = 1;
          }
          newProduct.timestamp = Date.now(); 
          data.productos.push(newProduct); 
          array.push(data); 
          array.sort((a, b) => a.id - b.id);
          await fs.promises.writeFile(source, JSON.stringify(array, null, 2));
        }
        return newProduct;
      }
    } catch (err) {
      return err;
    }
  }

  async getAll() {
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

  async getCartById(id) {
    try {
      const data = await this.getAll();
      const cart = data.find((obj) => obj.id == id);
      if (cart) {
        return cart; 
      } else {
        return null; 
      }
    } catch (err) {
      return err;
    }
  }

  async getProductsByCartId(id) {
    try {
      const data = await this.getAll();
      if (data === false) {
        return false;
      } else {
        // Hay carritos
        const cart = data.find((obj) => obj.id == id);
        if (cart.productos.length > 0) {
          return cart; 
        } else {
          return null; 
        }
      }
    } catch (err) {
      return err;
    }
  }

  async deleteProductOfCartById(cart_id, prod_id) {
    try {
      let array = await this.getAll();
      if (array == false) {
        return false; 
      } else {
        let data = await this.getCartById(cart_id);
        if (data === null) {
          return null; 
        } else {
          array = array.filter((item) => item.id != cart_id); 
          if (data.productos.find((item) => item.id == prod_id) === undefined) {
            return undefined;
          } else {
            data.productos = data.productos.filter(
              (item) => item.id != prod_id
            );
            array.push(data);
            array.sort((a, b) => a.id - b.id);
            await fs.promises.writeFile(source, JSON.stringify(array, null, 2));
            return true;
          }
        }
      }
    } catch (err) {
      return err;
    }
  }

  async deleteCartById(id) {
    try {
      const cart = await this.getCartById(id);
      if (cart === null) {
        return false; 
      } else {
        let data = await this.getAll();
        if (data === false) {
          return null; 
        } else {
          data = data.filter((item) => item.id != cart.id);
          await fs.promises.writeFile(source, JSON.stringify(data, null, 2));
          return true;
        }
      }
    } catch (err) {
      return err;
    }
  }
}

module.exports = new Carrito();
