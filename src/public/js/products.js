const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");

const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();
    const products = data.payload.docs ?? [];

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
    });
};

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
    console.log("¡Lista recargada!");
});

productsForm.onsubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    const response = await fetch("/api/products", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (data.status === "error") {
        errorMessage.innerText = data.message;
    } else {
        form.reset();
        loadProductsList();
    }
};

loadProductsList();