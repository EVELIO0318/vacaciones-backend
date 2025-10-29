const Vacaciones = require("../models/vacacionesModel");
const Notificaciones = require("../models/notificacionesModel");
const Empleados = require("../models/empleadosModel");
const { enviarCorreo } = require("../utils/mailer");
const dayjs = require("dayjs");

exports.calculoDias = (anios) => {
  if (anios === 1) return 12;
  if (anios === 2) return 15;
  if (anios === 3) return 20;
  if (anios >= 4) return 25;
  return 0;
};

exports.asignarVacaciones = async () => {
  const usuarios = await Empleados.getUserByAniversary();
  const hoy = dayjs();
  const correos = [
    "talentohumano@cooperativataulabe.hn",
    "eescobar@cooperativataulabe.hn",
  ]; // aqui cambiamos los correos a donde caeran las notificaciones

  for (const usuario of usuarios) {
    const fechaIngreso = dayjs(usuario.fecha_ingreso);

    const anios = hoy.diff(fechaIngreso, "year");

    if (anios >= 1) {
      const ultimaVacacion = await Vacaciones.getUltimaVacacion(
        usuario.IDempleado
      );
      let anioUltima = 0;
      if (ultimaVacacion) {
        // anioUltima=dayjs(ultimaVacacion.periodo_inicio).diff(fechaIngreso,'year')+1
        console.log(ultimaVacacion.periodo_inicio);
        anioUltima =
          Number(ultimaVacacion.periodo_inicio) - fechaIngreso.year() + 1;
        console.log(anioUltima);
      }

      if (anios > anioUltima) {
        for (let anio = anioUltima + 1; anio <= anios; anio++) {
          //aqui abajo se calculan los dias
          const diasAsignados = this.calculoDias(anio);

          const diasRestantes =
            (ultimaVacacion ? ultimaVacacion.dias_restantes : 0) +
            diasAsignados;

          const periodoInicio = fechaIngreso
            .add(anio - 1, "year")
            .format("YYYY-MM-DD");
          const periodoFin = fechaIngreso
            .add(anio, "year")
            .format("YYYY-MM-DD");

          await Vacaciones.saveVacation({
            usuario_id: usuario.IDempleado,
            periodo_inicio: periodoInicio,
            periodo_fin: periodoFin,
            dias_asignados: diasAsignados,
            dias_tomados: 0,
            diasRestantes: diasRestantes,
            fecha_asignacion: hoy.format("YYYY-MM-DD"),
          });

          const mensaje = `Nueva asignacion al empleado ${usuario.Nombre} de ${diasAsignados} dias de vacaciones correspondientes a su ${anio} aniversario.`;
          await Notificaciones.crear(usuario.IDempleado, mensaje);

          await enviarCorreo(correos, "Asignacion de Vacaciones", mensaje);
          console.log("Asignacion completada");
        }
      }
    }
  }
};

exports.VacacionesPorEmpleado = async (IDempleado) => {
  const dias = await Vacaciones.getPeriodosPorUsuario(IDempleado);
  return dias;
};

exports.vacacionesPorEmpleados = async (IDempleado) => {
  const emplsvacas = await Vacaciones.GetVacationByBoss(IDempleado);
  return emplsvacas;
};
