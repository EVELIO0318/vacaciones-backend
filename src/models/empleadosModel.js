const db = require("../utils/db");

class Empleados {
  static async findByUser(user) {
    const [rows] = await db.execute(
      "SELECT IDempleado,username,password,estado,rol_sistema FROM usuarios WHERE username=?",
      [user]
    );
    return rows[0];
  }

  static async getUserByAniversary() {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE DAY(fecha_ingreso) = DAY(CURDATE()) AND MONTH(fecha_ingreso) = MONTH(CURDATE())"
    );
    return rows;
  }

  static async getAllUser() {
    const [rows] = await db.execute(
      "SELECT u.IDempleado,u.Identidad AS Identidad, u.nombre AS empleado, u.filial_id AS IDfilial, f.nombre_filial AS filial,u.fecha_ingreso, u.puesto_id AS IDpuesto, p.nombre AS puesto,u.username AS username, u.jefe_inmediato AS IDjefe, j.nombre AS jefe_inmediato_nombre,u.rol_sistema AS rol,u.estado AS estado FROM usuarios u INNER JOIN filiales f ON u.filial_id = f.IDfilial INNER JOIN puestos p ON u.puesto_id = p.IDpuesto LEFT JOIN usuarios j ON u.jefe_inmediato = j.IDempleado GROUP BY u.IDempleado, u.Nombre, f.nombre_filial, p.nombre, j.Nombre ORDER BY u.Nombre"
    );
    return rows;
  }

  static async getAllBosses() {
    const [rows] = await db.execute(
      "SELECT IDempleado,Nombre FROM usuarios WHERE rol_sistema='GERENCIAL' AND estado=1"
    );
    return rows;
  }

  static async saveUser(
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol
  ) {
    const [result] = await db.execute(
      "INSERT INTO usuarios (Identidad,Nombre,filial_id,fecha_ingreso,puesto_id,jefe_inmediato,username,rol_sistema) VALUES(?,?,?,?,?,?,?,?)",
      [Identidad, Nombre, filial, fechaI, puesto, jefe_inmediato, username, rol]
    );
    return {
      IDusuario: result.insertId,
      Identidad,
      Nombre,
      filial,
      fechaI,
      puesto,
      jefe_inmediato,
      username,
      rol,
    };
  }

  static async updateUser(
    IDusuario,
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol
  ) {
    const [result] = await db.execute(
      "UPDATE usuarios SET Identidad=?,Nombre=?,filial_id=?,fecha_ingreso=?,puesto_id=?,jefe_inmediato=?,username=?,rol_sistema=? WHERE IDempleado=?",
      [
        Identidad,
        Nombre,
        filial,
        fechaI,
        puesto,
        jefe_inmediato,
        username,
        rol,
        IDusuario,
      ]
    );
    return result;
  }

  static async updatedPassword(IDusuario, password) {
    const [result] = await db.execute(
      "UPDATE usuarios SET password=? WHERE IDempleado=?",
      [password, IDusuario]
    );
    return result;
  }

  static async deleteUser(IDusuario) {
    const [result] = await db.execute(
      "UPDATE usuarios SET estado=0 WHERE IDempleado=?",
      [IDusuario]
    );
    return result;
  }

  static async getUserbyBoss(id_jefe) {
    const [rows] = await db.execute(
      "SELECT e.nombre AS empleado, f.nombre_filial AS filial, p.nombre AS puesto, SUM(v.dias_tomados) AS dias_tomados, SUM(v.dias_restantes) AS dias_restantes FROM usuarios e INNER JOIN filiales f ON e.filial_id = f.IDfilial INNER JOIN puestos p ON e.puesto_id = p.IDpuesto INNER JOIN vacaciones v ON e.IDempleado = v.usuario_id WHERE e.jefe_inmediato = ? GROUP BY e.IDempleado, e.nombre, f.nombre_filial, p.nombre;",
      [id_jefe]
    );
    return rows;
  }
}

module.exports = Empleados;
