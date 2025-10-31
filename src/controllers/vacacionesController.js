const VacacionesService = require("../services/vacacionesService");

const ejecutarAsignacion = async (req, res) => {
  try {
    await VacacionesService.asignarVacaciones();
    res.json({
      message: "Asignación de vacaciones ejecutada correctamente",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getDays = async (req, res, next) => {
  const { IDempleado } = req.query;

  if (!IDempleado) {
    return res.status(400).json({
      success: false,
      message: "Parametro Incorrecto.",
    });
  }

  try {
    const days = await VacacionesService.VacacionesPorEmpleado(IDempleado);
    res.status(200).json({
      days,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getHolidaysXemployers = async (req, res, next) => {
  const { IDjefe } = req.query;
  if (!IDjefe) {
    return res.status(400).json({ error: "El Codigo de Jefe es requerido" });
  }
  try {
    const data = await VacacionesService.vacacionesPorEmpleados(IDjefe);
    const dataConIndex = data.map((item, index) => ({
      index: index + 1,
      ...item,
    }));

    return res.status(200).json(dataConIndex);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getHolidaysAll = async (req, res, next) => {
  try {
    const data = await VacacionesService.vacacionesAllEmpleados();
    const dataConIndex = data.map((item, index) => ({
      index: index + 1,
      ...item,
    }));

    return res.status(200).json(dataConIndex);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const pendingDays = async (req, res, next) => {
  const { days } = req.query;
  try {
    if (!days) {
      return res.status(400).json({
        success: false,
        message: "No hay dias",
      });
    }

    const pendingsDays = await VacacionesService.DiasPendientes(days);
    res.status(200).json({
      pendingsDays,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  ejecutarAsignacion,
  getDays,
  getHolidaysXemployers,
  getHolidaysAll,
  pendingDays,
};
