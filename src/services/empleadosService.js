const Empleados = require("../models/empleadosModel");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.login = async (user, password) => {
  const empleado = await Empleados.findByUser(user);
  if (!empleado) {
    throw new Error("Usuario o contraseña incorrecto");
  }

  if (empleado.estado === 0) {
    throw new Error("Usuario Inactivo, Contacte a Talento Humano");
  }

  if (empleado.password !== password) {
    throw new Error("Usuario o contraseña incorrecto");
  }

  const token = jwt.sign(
    {
      id: empleado.IDempleado,
      username: empleado.username,
      rol: empleado.rol_sistema,
    },
    config.jwsecret,
    { expiresIn: "2h" }
  );
  return token;
};

exports.traerUsuarios = async () => {
  const todosUsuarios = await Empleados.getAllUser();
  return todosUsuarios;
};

exports.guardarUsuarios = async (datos) => {
  const {
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol,
  } = datos;
  const empleado = await Empleados.findByUser(username);
  if (empleado) {
    throw new Error("El Nombre de este usuario ya esta en uso");
  }

  const usuarioguardado = await Empleados.saveUser(
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol
  );
  return usuarioguardado;
};

exports.editarUsuario = async (datos) => {
  const {
    IDempleado,
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol,
  } = datos;

  const usuarioeditado = await Empleados.updateUser(
    IDempleado,
    Identidad,
    Nombre,
    filial,
    fechaI,
    puesto,
    jefe_inmediato,
    username,
    rol
  );
  return usuarioeditado;
};

exports.editarPassword = async (IDempleado, password) => {
  const passwordeditado = await Empleados.updatedPassword(IDempleado, password);
  return passwordeditado;
};

exports.borrarUsuario = async (IDempleado) => {
  const usuario = await Empleados.deleteUser(IDempleado);
  return usuario;
};

exports.traerUsuariosPorJefe = async (IDjefe) => {
  const empleadosVac = await Empleados.getUserbyBoss(IDjefe);
  return empleadosVac;
};

exports.traerTodosLosJefes = async () => {
  const jefes = await Empleados.getAllBosses();
  return jefes;
};
