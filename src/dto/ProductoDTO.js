export class ProductoDTO {
    constructor(producto) {
        this.id = producto._id;
        this.title = producto.title;
        this.description = producto.description;
        this.category = producto.category;
        this.code = producto.code;
        this.price = producto.price;
        this.stock = producto.stock;
        this.status = producto.status;
        this.thumbnail = producto.thumbnail;
    }
}