const Filiales = require("../models/filialesModel");

exports.getAllFiliales = async () => {
  const filiales = await Filiales.getAllFiliales();
  return filiales;
};

exports.saveFilial = async (nombre_filial, tipo) => {
  const filial = await Filiales.filialPorNombre(nombre_filial);
  if (filial) {
    throw new Error("Filial / Ventanilla ya existe");
  }

  const filialGuardada = await Filiales.saveFilial(nombre_filial, tipo);
  return { message: "Filial Guardada con exito", filialGuardada };
};

exports.actualizarFilial = async (IDfilial, nombre_filial, tipo) => {
  const filialUpdate = await Filiales.UpdateFilial(
    IDfilial,
    nombre_filial,
    tipo
  );
  return filialUpdate;
};

exports.borrarFilial = async (id) => {
  const filialBorrada = await Filiales.DeleteFilial(id);
  return filialBorrada;
};
