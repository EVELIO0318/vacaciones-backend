const db = require("../utils/db");

class SolicitudVacaciones {
  static async crearSolicitud({
    usuario_id,
    jefe_id,
    fecha_inicio,
    fecha_fin,
    dias_calculados,
    pdf_solicitud,
  }) {
    const [result] = await db.execute(
      "INSERT INTO vacaciones_solicitudes (usuario_id,jefe_id,fecha_inicio,fecha_fin,dias_calculados,pdf_solicitud)VALUES(?,?,?,?,?,?)",
      [
        usuario_id,
        jefe_id,
        fecha_inicio,
        fecha_fin,
        dias_calculados,
        pdf_solicitud,
      ]
    );
    return result.insertId;
  }

  static async getSolicitudById(IDsolicitud) {
    const [rows] = await db.execute(
      "SELECT * FROM vacaciones_solicitudes WHERE IDsolicitud=?",
      [IDsolicitud]
    );
    return rows[0];
  }

  static async getSolicitudByUser(IDempleado) {
    const [rows] = await db.execute(
      "SELECT * FROM vacaciones_solicitudes WHERE usuario_id=?",
      [IDempleado]
    );

    return rows;
  }

  static async UpdateSolicitudVacaciones(
    IDsolicitud,
    fecha_inicio,
    fecha_fin,
    diasEfectivos,
    pdf_solicitud = null
  ) {
    let query =
      "UPDATE vacaciones_solicitudes SET fecha_inicio=?,fecha_fin=?,dias_calculados=?";

    let params = [fecha_inicio, fecha_fin, diasEfectivos];

    if (pdf_solicitud) {
      query += ",pdf_solicitud=?";
      params.push(pdf_solicitud);
    }

    query += " WHERE IDsolicitud=?";
    params.push(IDsolicitud);

    console.log(query);
    console.log(params);

    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  static async deleteSolicitud(IDsolicitud) {
    await db.execute("DELETE FROM vacaciones_solicitudes WHERE IDsolicitud=?", [
      IDsolicitud,
    ]);
    return true;
  }

  static async solicitudMensual(mes, anio) {
    const [rows] = await db.execute(
      "SELECT u.IDempleado, u.Nombre, f.nombre_filial, p.nombre AS nombre_puesto,SUM(dias_calculados)AS dias_calculados FROM vacaciones_solicitudes vs INNER JOIN usuarios u ON vs.usuario_id = u.IDempleado LEFT JOIN filiales f ON u.filial_id = f.IDfilial LEFT JOIN puestos p ON u.puesto_id = p.IDpuesto WHERE YEAR(vs.fecha_inicio) = ? AND MONTH(vs.fecha_inicio) = ? GROUP BY u.IDempleado, u.Nombre, f.nombre_filial, p.nombre ORDER BY u.Nombre",
      [anio, mes]
    );
    console.log(rows);
    return rows;
  }
}

module.exports = SolicitudVacaciones;
