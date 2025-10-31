const solicitudVacacionesService = require("../services/solicitudVacaciones");

const crearSolicitud = async (req, res, next) => {
  const { usuario_id, filial_id, jefe_id, fecha_inicio, fecha_fin } = req.body;

  const pdf_solicitud = req.file.filename;
  try {
    if (!usuario_id) {
      return res.status(400).json({ error: "Falta el ID del usuario" });
    }

    if (!filial_id) {
      return res.status(400).json({ error: "Falta el ID de la filial" });
    }

    if (!jefe_id) {
      return res.status(400).json({ error: "Falta el ID del jefe inmediato" });
    }

    if (!fecha_inicio) {
      return res.status(400).json({ error: "Falta la fecha de Inicio" });
    }

    if (!fecha_fin) {
      return res.status(400).json({ error: "Falta la fecha de Inicio" });
    }

    if (fecha_fin < fecha_inicio) {
      return res
        .status(400)
        .json({ error: "La fecha Final no puede ser mayor a la inicial" });
    }
    if (!pdf_solicitud || pdf_solicitud.length === 0) {
      return res
        .status(400)
        .json({ error: "Debe adjuntar al menos un archivo." });
    }

    const resultado = await solicitudVacacionesService.solicitarVacaciones({
      usuario_id,
      filial_id,
      jefe_id,
      fecha_inicio,
      fecha_fin,
      pdf_solicitud,
    });

    res.status(200).json({
      message: "Vacaciones asignadas correctamente",
      resultado,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const actualizarSolicitud = async (req, res, next) => {
  const { IDsolicitud, fecha_inicio, fecha_fin, filial_id } = req.body;

  const pdf_solicitud = req.file ? req.file.filename : null;
  try {
    if (!IDsolicitud) {
      return res.status(400).json({ error: "Falta el ID de la solicitud" });
    }

    if (!fecha_inicio) {
      return res.status(400).json({ error: "Falta la Fecha de Inicio" });
    }

    if (!fecha_fin) {
      return res.status(400).json({ error: "Falta la Fecha de finalización" });
    }

    if (!filial_id) {
      return res.status(400).json({ error: "falta el ID de la solicitud" });
    }

    if (fecha_fin < fecha_inicio) {
      return res
        .status(400)
        .json({ error: "La fecha Final no puede ser mayor a la inicial" });
    }

    const resultadoUP = await solicitudVacacionesService.editarSolicitud({
      IDsolicitud,
      fecha_inicio,
      fecha_fin,
      filial_id,
      pdf_solicitud,
    });

    res.status(200).json({
      message: "Vacaciones Actualizadas correctamente",
      resultadoUP,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSolicitud = async (req, res, next) => {
  const { IDsolicitud } = req.body;

  try {
    if (!IDsolicitud) {
      return res.status(400).json({ error: "Falta el ID de la solicitud" });
    }
    await solicitudVacacionesService.eliminarSolicitud(IDsolicitud);
    res.status(200).json({
      message: "Solicitud Eliminada exitosamente",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getSolicitudByUser = async (req, res, next) => {
  const { IDempleado } = req.query;
  try {
    if (!IDempleado) {
      return res.status(400).json({ error: "Falta el ID del empleado" });
    }

    const solicitudes = await solicitudVacacionesService.solicitudesPorUsuario(
      IDempleado
    );
    res.status(200).json({
      solicitudes,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const daysByDates = async (req, res, next) => {
  const { mes, anio } = req.query;
  try {
    if (!mes) {
      return res.status(400).json({ error: "Falta el Mes" });
    }
    if (!anio) {
      return res.status(400).json({ error: "Falta el Año" });
    }
    const data = await solicitudVacacionesService.DiasPorMes(mes, anio);
    res.status(200).json({
      data,
    });
    res;
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  crearSolicitud,
  actualizarSolicitud,
  deleteSolicitud,
  getSolicitudByUser,
  daysByDates,
};
