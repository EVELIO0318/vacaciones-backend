const db = require("../utils/db");

class Puestos {
  static async getPuestosAll() {
    const [rows] = await db.execute("SELECT * FROM puestos");
    return rows;
  }

  static async getPuestoForName(nombre) {
    const [rows] = await db.execute("SELECT * FROM puestos WHERE nombre=?", [
      nombre,
    ]);
    return rows[0];
  }

  static async guardarPuesto(nombre) {
    const [result] = await db.execute(
      "INSERT INTO puestos (nombre) VALUES (?)",
      [nombre]
    );
    return {
      IDpuesto: result.insertId,
      nombre,
      estado: 1,
    };
  }

  static async updatePuesto(id, nombre) {
    const [result] = await db.execute(
      "UPDATE puestos SET nombre=? WHERE IDpuesto=?",
      [nombre, id]
    );
    return result;
  }

  static async deletePuesto(id) {
    const [result] = await db.execute(
      "UPDATE puestos SET estado=0 WHERE IDpuesto=?",
      [id]
    );
    return result;
  }
}

module.exports = Puestos;
