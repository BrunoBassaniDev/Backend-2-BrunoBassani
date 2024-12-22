const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const cartId = document.querySelector("#vaciar-carrito").dataset.id;

    document
        .querySelector("#productos-carrito")
        .addEventListener("click", (event) => {
            const target = event.target;
            const productId = target.dataset.id;

            if (target.classList.contains("add-product") && productId && cartId) {
                socket.emit("add-product-to-cart", {
                    cartId,
                    productId,
                });
            } else if (
                target.classList.contains("remove-product") &&
                productId &&
                cartId
            ) {
                socket.emit("remove-product-from-cart", {
                    cartId,
                    productId,
                });
            } else if (
                target.matches(".delete-all-from-cart") &&
                productId &&
                cartId
            ) {
                socket.emit("delete-all-products", {
                    cartId,
                    productId,
                });
            }
        });

    socket.on("cart-updated", (data) => {
        // Update the cart UI with the new data
        updateCartUI(data.cart);
    });

    socket.on("error-message", (data) => {
        const errorMessage = document.querySelector("#mensaje-error");
        errorMessage.innerText = data.message;
        errorMessage.style.display = "block";
    });
});

const updateCartUI = (cart) => {
    const cartTableBody = document.querySelector("#productos-carrito");
    cartTableBody.innerHTML = "";

    cart.products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>
                <button class="remove-product" data-id="${product._id}">-</button>
                <span>${product.quantity}</span>
                <button class="add-product" data-id="${product._id}">+</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });
};