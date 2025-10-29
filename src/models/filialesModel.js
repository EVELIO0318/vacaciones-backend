const db = require("../utils/db");

class Filiales {
  static async getAllFiliales() {
    const [rows] = await db.execute("SELECT * FROM filiales");
    return rows;
  }

  static async saveFilial(nombre_filial, tipo) {
    const [result] = await db.execute(
      "INSERT INTO filiales (nombre_filial,tipo) VALUES (?,?)",
      [nombre_filial, tipo]
    );
    return {
      IDfilial: result.insertId,
      nombre_filial,
      tipo,
      estado: 1
    };
  }

  static async filialPorNombre(nombre_filial) {
    const [rows] = await db.execute(
      "SELECT * FROM filiales WHERE nombre_filial=?",
      [nombre_filial]
    );
    return rows[0];
  }

  static async UpdateFilial(IDfilial, nombre_filial, tipo) {
    const [result] = await db.execute(
      "UPDATE filiales SET nombre_filial=?, tipo=? WHERE IDfilial=?",
      [nombre_filial, tipo, IDfilial]
    );
    return result;
  }

  static async DeleteFilial(id) {
    const [result] = await db.execute(
      "UPDATE filiales SET estado=0 WHERE IDfilial=?",
      [id]
    );
    return result;
  }
}

module.exports = Filiales;
