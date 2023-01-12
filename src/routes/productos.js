const express = require("express");
const router = express.Router();
const Producto = require("../classes/Producto");
const admin = true;

// GET /api/productos/:id?
router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const data = await Producto.getProductById(id);
    if (data === null) {
      res.status(404).send({ error: "No se encontró el producto." });
    } else {
      res.status(200).json({ data: data });
    }
  } else {
    const data = await Producto.getAllProducts();
    if (data === false) {
      res.status(404).send({ error: "No se encontraron productos." });
    } else {
      res.status(200).json({ data: data });
    }
  }
});

// POST /api/productos/
router.post("/", async (req, res) => {
  if (admin === true) {
    const newProduct = req.body;
    if (
      Object.entries(newProduct).length === 0 ||
      Object.entries(newProduct).length < 7
    ) {
      const data = await Producto.createNewProduct(newProduct);
      res.status(201).json({ newProduct: data });
    } else {
      res.status(422).json({
        error: "No se pudo obtener los atributos del producto correctamente.",
      });
    }
  } else {
    res.status(403).send({
      error: 403,
      description: "Error encontrado.",
    });
  }
});

// PUT /api/productos/:id
router.put("/:id", async (req, res) => {
  if (admin === true) {
    const { id } = req.params;
    let newProduct = req.body;
    const data = await Producto.getAllProducts();
    if (data.length === 0) {
      res.status(404).send({ error: "No se encontraron productos." });
    } else {
      const lastItem = data[data.length - 1];
      if (lastItem.id >= id) {
        const product = await Producto.editProduct(data, id, newProduct);
        res.status(200).json({ updatedProduct: product });
      } else {
        res.status(404).send({ error: "No se encontró el producto." });
      }
    }
  } else {
    res.status(403).send({
      error: 403,
      description: "Error encontrado.",
    });
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res) => {
  if (admin === true) {
    const { id } = req.params;
    if ((await Producto.deleteProductById(id)) === false) {
      res.status(404).send({ error: "No se encontró el producto." });
    } else {
      res
        .status(200)
        .send({ success: "Se eliminó el producto correctamente." });
    }
  } else {
    res.status(403).send({
      error: 403,
      description: "Error encontrado.",
    });
  }
});

module.exports = router;
