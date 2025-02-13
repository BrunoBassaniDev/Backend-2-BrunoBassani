export class UsuarioDTO {
    constructor(usuario) {
        this.id = usuario._id;
        this.firstName = usuario.first_name;
        this.lastName = usuario.last_name;
        this.email = usuario.email;
        this.age = usuario.age;
        this.role = usuario.role;
        this.cart = usuario.cart;
    }
}