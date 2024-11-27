const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

socket.on("products-list", (data)=>{
    const products = data.products || {};

    productsList.innerText="";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Nombre: ${product.title} -- Código: ${product.code}<br>
        Descripción: ${product.description} <br>
        Categoría: ${product.category} -- Stock: ${product.stock} -- Estado: ${product.status} <br>
        Imagen: <img src="/api/public/images/${product.thumbnail}" alt="image-${product.title}" width="100"></li>`;
    });

});

productsForm.addEventListener("submit", async(event)=>{
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            body: formdata,
        });
        if (!response.ok) {
            const error = await response.json();
            console.log(`Error: ${error.message}`);
            return;
        }
        console.log("Producto agregado con éxito.");
        productsForm.reset();
    } catch (error) {
        console.error("Error al enviar el formulario:", error);
    }
});

btnDeleteProduct.addEventListener("click", ()=>{
    const id = inputProductId.value;
    inputProductId.innerText="";
    errorMessage.innerText="";

    if (id>0) {
        socket.emit("delete-product", { id });
    }

});

socket.on("error-message", (data)=>{
    errorMessage.innerHTML= data.message;
});