export default class Cliente {
  constructor({ id, first_name, last_name, email }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name  = last_name;
    this.email      = email;
    this.role       = "cliente";
  }

  getNombreCompleto() {
    return `${this.first_name} ${this.last_name}`;
  }
}
