const { message } = require("statuses");
const feriadosService = require("../services/feriadosService");

const saveFe = async (req, res, next) => {
  const { descripcion, fechaI, fechaF, aplicaTodas, filiales } = req.body;
  console.log(req.body);
  try {
    if (!descripcion) {
      return res
        .status(400)
        .json({ error: "la Descripcion del Feriado es requerido" });
    }

    if (!fechaI) {
      return res.status(400).json({ error: "la Fecha Inicial es Requerida" });
    }

    if (!fechaF) {
      return res.status(400).json({ error: "la Fecha Final es Requerida" });
    }

    if (fechaI > fechaF) {
      return res
        .status(400)
        .json({ error: "La Fecha Inicial no puede ser mayor que la final ☻" });
    }
    if (!aplicaTodas && filiales.length == 0) {
      return res
        .status(400)
        .json({ error: "No se especificaron las filiales para este feriado" });
    }

    const datosFeriado = {
      descripcion: descripcion,
      fechaInicio: fechaI,
      fechaFin: fechaF,
      aplicaTodas: aplicaTodas,
      filiales: filiales,
    };
    const feriadoSaved = await feriadosService.guardarFeriados(datosFeriado);

    res.status(200).json({
      message: "Feriado guardado correctamente",
      Valores: feriadoSaved,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const AllFeriados = async (req, res, next) => {
  try {
    const Feriados = await feriadosService.todosLosFeriados();

    const formateados = Feriados.map((f) => ({
      ...f,
      fechaInicio: f.fechaInicio
        ? new Date(f.fechaInicio).toISOString().split("T")[0]
        : null,
      fechaFin: f.fechaFin
        ? new Date(f.fechaFin).toISOString().split("T")[0]
        : null,
    }));

    res.status(200).json({ Feriados: formateados });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFeriado = async (req, res, next) => {
  try {
    const { IDferiado, descripcion, fechaI, fechaF, aplicaTodas, filiales } =
      req.body;
    if (!descripcion) {
      return res
        .status(400)
        .json({ error: "la Descripcion del Feriado es requerido" });
    }

    if (!fechaI) {
      return res.status(400).json({ error: "la Fecha Inicial es Requerida" });
    }

    if (!fechaF) {
      return res.status(400).json({ error: "la Fecha Final es Requerida" });
    }

    if (fechaI > fechaF) {
      return res
        .status(400)
        .json({ error: "La Fecha Inicial no puede ser mayor que la final ☻" });
    }
    if (!aplicaTodas && filiales.length == 0) {
      return res
        .status(400)
        .json({ error: "No se especificaron las filiales para este feriado" });
    }

    const datosFeriado = {
      IDferiado: IDferiado,
      descripcion: descripcion,
      fechaInicio: fechaI,
      fechaFin: fechaF,
      aplicaTodas: aplicaTodas,
      filiales: filiales,
    };

    const feriadoUpdated = await feriadosService.EditarFeriado(datosFeriado);

    res.status(200).json({
      message: "Feriado Actualizado correctamente",
      feriadoUpdated,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteFeriado = async (req, res, next) => {
  console.log(req);
  const { IDferiado } = req.body;
  try {
    await feriadosService.DeleteFeriado(IDferiado);
    res.status(200).json({
      message: "Feriado Eliminado exitosamente",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveFe,
  AllFeriados,
  updateFeriado,
  deleteFeriado,
};
