const db = require("../utils/db");

class Vacaciones {
  static async saveVacation(data) {
    // console.log(data);
    const {
      usuario_id,
      periodo_inicio,
      periodo_fin,
      dias_asignados,
      dias_tomados,
      diasRestantes,
      fecha_asignacion,
    } = data;
    // console.log(usuario_id,periodo_inicio,periodo_fin,dias_asignados, dias_tomados,dias_restantes,fecha_asignacion)
    const [result] = await db.execute(
      "INSERT INTO vacaciones( usuario_id, periodo_inicio, periodo_fin, dias_asignados, dias_tomados,dias_restantes, fecha_asignacion) VALUES (?,?,?,?,?,?,?)",
      [
        usuario_id,
        periodo_inicio,
        periodo_fin,
        dias_asignados,
        dias_tomados,
        diasRestantes,
        fecha_asignacion,
      ]
    );
    return result.insertId;
  }

  static async getUltimaVacacion(usuario_id) {
    const [rows] = await db.execute(
      "SELECT * FROM vacaciones WHERE usuario_id=? ORDER BY fecha_asignacion DESC,IDvacaciones DESC LIMIT 1",
      [usuario_id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  //traer la informacion del usuario y de sus dias de vacaciones
  static async getPeriodosPorUsuario(usuario_id) {
    const [rows] = await db.execute(
      "SELECT * FROM vacaciones WHERE usuario_id=?",
      [usuario_id]
    );
    return rows;
  }

  static async actualizarDias(IDvacaciones, diasTomados) {
    await db.execute(
      "UPDATE vacaciones SET dias_tomados = dias_tomados + ?, dias_restantes = dias_restantes - ? WHERE IDvacaciones=?",
      [diasTomados, diasTomados, IDvacaciones]
    );
  }

  static async updateDiasRestantes(IDvacaciones, dias_restantes, dias_tomados) {
    await db.execute(
      "UPDATE vacaciones SET dias_restantes=?,dias_tomados=? WHERE IDvacaciones=?",
      [dias_restantes, dias_tomados, IDvacaciones]
    );

    return true;
  }

  static async GetVacationByBoss(IDjefe) {
    const [rows] = await db.execute(
      "SELECT v.IDvacaciones, u.IDempleado, u.Nombre, u.Filial_id, f.nombre_filial, u.fecha_ingreso, u.puesto_id, p.nombre AS nombre_puesto, SUM(v.dias_asignados) AS total_asignados, SUM(v.dias_tomados) AS total_tomados, SUM(v.dias_restantes) AS total_restantes FROM usuarios u LEFT JOIN vacaciones v ON u.IDempleado = v.usuario_id LEFT JOIN filiales f ON u.Filial_id = f.IDfilial LEFT JOIN puestos p ON u.puesto_id = p.IDpuesto WHERE u.jefe_inmediato = ? GROUP BY u.IDempleado, u.Nombre, u.Filial_id, f.nombre_filial, u.fecha_ingreso, u.puesto_id, p.nombre",
      [IDjefe]
    );

    return rows;
  }
}

module.exports = Vacaciones;
