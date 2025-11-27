const products = [
    {
        id: 101,
        name: "Laptop Pro",
        price: 1200,
        category: "Electronics",
        inStock: true,
    },
    {
        id: 102,
        name: "T-shirt Black",
        price: 25,
        category: "Apparel",
        inStock: true,
    },
    {
        id: 103,
        name: "Coffee Mug",
        price: 10,
        category: "Home",
        inStock: false,
    },
    {
        id: 104,
        name: "Smartphone X",
        price: 800,
        category: "Electronics",
        inStock: true,
    },
    {
        id: 105,
        name: "Jeans Blue",
        price: 75,
        category: "Apparel",
        inStock: true,
    },
];

console.log("--- Task 1 ---");

const calculateDiscount = (price, discountRate) => price - price * discountRate;

console.log("Discounted Price:", calculateDiscount(100, 0.1));

const getProductDescription = (product) => {
    return `The ${product.name} (${product.id}) is in the ${
        product.category
    } category and is currently ${
        product.inStock ? "in stock" : "out of stock"
    }. It costs $${product.price}.`;
};

console.log(getProductDescription(products[3]));

console.log("\n--- Task 2 ---");

const { name, price, category } = products[1];

console.log("Destructured Variables:", name, price, category);

const logFirstProductNameAndPrice = ([{ name, price }]) => {
    console.log(`First Product: ${name}, Price: $${price}`);
};

logFirstProductNameAndPrice(products);

console.log("\n--- Task 3 ---");

const inStockElectronics = products.filter(
    (product) => product.category === "Electronics" && product.inStock === true
);
console.log("In-Stock Electronics:", inStockElectronics);

const productSummaries = inStockElectronics.map(
    (product) => `Product ID: ${product.id}, Name: ${product.name}`
);
console.log("Summaries:", productSummaries);

const totalOrderPrice = products.reduce((accumulator, currentProduct) => {
    return accumulator + currentProduct.price;
}, 0);

console.log("Total Price of all products:", totalOrderPrice);

console.log("\n--- Task 4 ---");

const newProduct = {
    id: 106,
    name: "Keyboard Mechanical",
    price: 150,
    category: "Electronics",
    inStock: true,
};

const updatedProductsList = [...products, newProduct];

console.log("Updated List Length:", updatedProductsList.length);

const discountedLaptop = {
    ...products[0],
    price: calculateDiscount(products[0].price, 0.15),
};

console.log("Original Laptop Price:", products[0].price);
console.log("Discounted Laptop:", discountedLaptop);
