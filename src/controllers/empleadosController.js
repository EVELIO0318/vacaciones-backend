const { message } = require("statuses");
const empleadoService = require("../services/empleadosService");

const logeo = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    const token = await empleadoService.login(username, password);

    res.json({
      success: true,
      message: "login exitoso",
      token,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const AllUser = async (req, res, next) => {
  try {
    const usuarios = await empleadoService.traerUsuarios();
    res.status(200).json({
      usuarios,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const saveUsuario = async (req, res, next) => {
  const {
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol,
  } = req.body;
  try {
    if (!Identidad) {
      return res.status(400).json({ error: "la Identidad es requerida" });
    }
    if (!Nombre) {
      return res.status(400).json({ error: "El Nombre es requerido" });
    }

    if (!filial) {
      return res.status(400).json({ error: "Debe escoger una filial" });
    }

    if (!fechaI) {
      return res
        .status(400)
        .json({ error: "La Fecha de Ingreso es requerida" });
    }

    if (!puesto) {
      return res.status(400).json({ error: "El Puesto es requerido" });
    }

    if (!jefe_inmediato) {
      return res.status(400).json({ error: "Debe asignarle un jefe" });
    }

    if (!username) {
      return res.status(400).json({ error: "El Usuario es requerido" });
    }

    if (!rol) {
      return res.status(400).json({ error: "Escoja un rol" });
    }

    const usuariosaved = await empleadoService.guardarUsuarios(req.body);
    res.status(200).json({
      message: "Empleado guardado exitosamente",
      usuariosaved,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const editUser = async (req, res, next) => {
  console.log(req.body);
  const {
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol,
  } = req.body;
  try {
    if (!Identidad) {
      return res.status(400).json({ error: "la Identidad es requerida" });
    }
    if (!Nombre) {
      return res.status(400).json({ error: "El Nombre es requerido" });
    }

    if (!filial) {
      return res.status(400).json({ error: "Debe escoger una filial" });
    }

    if (!fechaI) {
      return res
        .status(400)
        .json({ error: "La Fecha de Ingreso es requerida" });
    }

    if (!puesto) {
      return res.status(400).json({ error: "El Puesto es requerido" });
    }

    if (!jefe_inmediato) {
      return res.status(400).json({ error: "Debe asignarle un jefe" });
    }

    if (!username) {
      return res.status(400).json({ error: "El Usuario es requerido" });
    }
    if (!rol) {
      return res.status(400).json({ error: "La clave es requerida" });
    }

    const usuariosaved = await empleadoService.editarUsuario(req.body);
    res.status(200).json({
      message: "Empleado actualizado",
      usuariosaved,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const actualizarpass = async (req, res, next) => {
  const { IDempleado, password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: "La clave es requerida" });
    }
    const passwordupdated = await empleadoService.editarPassword(
      IDempleado,
      password
    );
    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
      passwordupdated,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  const { IDempleado } = req.body;

  try {
    if (!IDempleado) {
      return res.status(400).json({ error: "No hay ID valido" });
    }

    const empleadoDeleted = await empleadoService.borrarUsuario(IDempleado);
    res.status(200).json({
      message: "Usuario Inactivado exitosamente",
      empleadoDeleted,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const UserbyBossandHolidays = async (req, res, next) => {
  const { jefe_inmediato } = req.body;
  try {
    const empleadosByBoss = await empleadoService.traerUsuariosPorJefe(
      jefe_inmediato
    );
    res.status(200).json({
      empleados: empleadosByBoss,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getBosses = async (req, res, next) => {
  try {
    const bosses = await empleadoService.traerTodosLosJefes();
    res.status(200).json({
      bosses,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  logeo,
  AllUser,
  saveUsuario,
  editUser,
  actualizarpass,
  deleteUser,
  UserbyBossandHolidays,
  getBosses,
};
