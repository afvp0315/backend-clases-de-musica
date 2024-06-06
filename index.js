const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./database");
const product = require("./product");

//Conectar a la base de datos
connectDB();

// Middleware para permitir CORS
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "https://jymmymurillo.github.io/",
      "https://front-heroes-api.vercel.app",
    ],
  })
);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Middleware para parsear JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Clases de Música");
});

// Obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("Error al obtener la lista de Productos");
  }
});

// Obtener un producto por ID
app.get("/products/:id", async (req, res) => {
  try {
    const product= await product.findById(req.params.id)
    if (!product)
      return res.status(404).send("El producto no fue encontrado");
    res.json(product);
  } catch (error) {
    res.status(500).send("Error al buscar el producto");
  }
});

// Crear un nuevo producto
app.post("/products", async (req, res) => {
  const { name, image, price, description } = req.body;

  // validacion de campos
  if (
    !name ||
    !image ||
    !price ||
    !description ||
    typeof name !== "string" ||
    typeof image !== "string" ||
    typeof price !== "number" ||
    typeof description!== "string" ||
    name.trim() === "" ||
    image.trim() === ""||
    price === null || price === undefined || price === ""||
    description.trim() === "" 
  ) {
    return res
      .status(400)
      .send(
        "Todos los campos son campos obligatorios, no pueden ir vacios"
      );
  }

  try {
    const newProduct = new product({ name, image,price,description});
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send("Error crear Producto");
  }
});

// Actualizar un producto existente
app.put("/products/:id", async (req, res) => {
  const { name, image,price,description } = req.body;

  // validacion de campos
  if (
    !name ||
    !image ||
    !price ||
    !description ||
    typeof name !== "string" ||
    typeof image !== "string" ||
    typeof price !== "number" ||
    typeof description!== "string" ||
    name.trim() === "" ||
    image.trim() === ""||
    price === null || price === undefined || price === ""||
    description.trim() === "" 
  ) {
    return res
      .status(400)
      .send(
        "Todos los campos son campos obligatorios, no pueden ir vacios"
      );
  }

  try {
    const updatedProduct = await product.findByIdAndUpdate(req.params.id, {name, image,price,description}, {new:true})
    if (!updatedProduct) return res.status(404).send("El Producto no fue encontrado");
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
  }
});


// Eliminar un producto
app.delete("/products/:id", async(req, res) => {
  try {
    const deletedProduct = await product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.status(404).send("El Producto no fue encontrado");
    res.status(201).json({ message: "Producto eliminado"});
  } catch (error) {
    res.status(500).send("Error al actualizar el Producto");
  }
});
