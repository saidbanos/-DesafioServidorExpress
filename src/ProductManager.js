import fs from "fs";

class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}

	addProduct = async (title, description, price, thumbnail, code, stock) => {
		if (!title || !description || !price || !thumbnail || !code || !stock) {
			console.log("All fields are mandatory.");
			return;
		}

		let allCodes = [];
		this.products.forEach((element) => {
			allCodes.push(element.code);
		});

		if (allCodes.includes(code)) {
			console.log(`The code: - ${code} - already exist, enter a new code.`);
			return;
		}

		if (fs.existsSync(this.path)) {
			const myNewObject = {
				title: title,
				description: description,
				price: price,
				thumbnail: thumbnail,
				code: code,
				stock: stock,
			};

			if (this.products.length === 0) {
				myNewObject.id = 1;
			} else {
				myNewObject.id = this.products[this.products.length - 1].id + 1;
			}

			this.products.push(myNewObject);

			await fs.promises.writeFile(this.path, JSON.stringify(this.products));
		}
	};

	getProducts = async () => {
		if (fs.existsSync(this.path)) {
			const products = await fs.promises.readFile(this.path, "utf-8");
			if (products.length > 0) {
				return JSON.parse(products);
			} else {
				console.log("No products in the file");
				return [];
			}
		} else {
			console.log("The file does not exist");
			return [];
		}
	};

	getProductById = async (id) => {
		if (fs.existsSync(this.path)) {
			const products = JSON.parse(
				await fs.promises.readFile(this.path, "utf-8")
			);

			for (const element of products) {
				if (element.id == id) {
					return element;
				}
			}
			return {};
		} else {
			return {};
		}
	};

	updateProduct = async (id, fieldToUpdate) => {
		if (!fs.existsSync(this.path)) {
			console.log("The file does not exist.");
			return;
		}

		let products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

		let product = products.find((product) => product.id === id);

		if (!product) {
			console.log(`Product with id ${id} not found`);
			return;
		}

		let invalidFields = [];

		for (let key in fieldToUpdate) {
			if (product.hasOwnProperty(key)) {
				product[key] = fieldToUpdate[key];
			} else {
				invalidFields.push(key);
			}
		}

		if (invalidFields.length > 0) {
			console.log(`Invalid field(s) provided: ${invalidFields.join(", ")}`);
			return;
		}

		await fs.promises.writeFile(this.path, JSON.stringify(products));
	};

	deleteProduct = async (id) => {
		if (!fs.existsSync(this.path)) {
			console.log("The file does not exist.");
			return;
		}

		let products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

		const productIndex = products.findIndex((product) => product.id === id);

		if (productIndex === -1) {
			console.log(`Product with id ${id} not found`);
			return;
		}

		products.splice(productIndex, 1);

		await fs.promises.writeFile(this.path, JSON.stringify(products));
	};
}

export default ProductManager;
