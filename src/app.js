import ProductManager from "./ProductManager.js";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("Usuarios.json");

app.get("/", (req, res) => {
	res.send("Server active.");
});

app.get("/products", async (req, res) => {
	try {
		const { limit } = req.query;
		let products = await productManager.getProducts();

		if (limit && !isNaN(limit) && limit > 0) {
			products = products.slice(0, Number(limit));
		}

		res.send(products);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error getting products from the file.");
	}
});

app.get("/products/:pid", async (req, res) => {
	try {
		const pid = Number(req.params.pid);
		const product = await productManager.getProductById(pid);

		if (Object.keys(product).length > 0) {
			res.send(product);
		} else {
			res.status(404).send(`The product with id: ${pid} was not found.`);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Error getting products from the file.");
	}
});

const port = 8080;

app.listen(port, () => {
	console.log(`Server active on port: ${port}`);
});
