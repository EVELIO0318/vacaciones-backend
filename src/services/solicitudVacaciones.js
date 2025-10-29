const vacacionesSolicitudModelo = require("../models/vacacionesSolicitud");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const Feriados = require("../models/feriadosModel");
const Vacaciones = require("../models/vacacionesModel");
const { identity } = require("lodash");
dayjs.extend(isSameOrBefore);

exports.calcularDiasEfectivos = async (fecha_inicio, fecha_fin, filial_id) => {
  const feriadosNacionales = await Feriados.getFeriadosNacionales();
  const feriadosLocales = await Feriados.getFeriadosPorFilial(filial_id);

  const feriados = [...feriadosNacionales, ...feriadosLocales];

  // creamos un arreglo personalizado con set para los feriados
  const feriadosFechas = new Set();
  for (const f of feriados) {
    let fInicio = dayjs(f.fechaInicio);
    let fFin = dayjs(f.fechaFin);
    while (fInicio.isSameOrBefore(fFin)) {
      feriadosFechas.add(fInicio.format("YYYY-MM-DD"));
      fInicio = fInicio.add(1, "day");
    }
  }

  //contamos los dias entre las fechas dadas, sacamos domingos y dias festivos
  let totalDias = 0;
  let fecha = dayjs(fecha_inicio);
  const fin = dayjs(fecha_fin);

  //se verifica cada dia si es domingo o cae feriado para no agregarlo a la resta del total de dias
  while (fecha.isSameOrBefore(fin)) {
    const esDomingo = fecha.day() === 0;
    const esFeriado = feriadosFechas.has(fecha.format("YYYY-MM-DD"));
    if (!esDomingo && !esFeriado) {
      totalDias++;
    }
    fecha = fecha.add(1, "day");
  }

  console.log("Dias calculados con descuento", totalDias);
  return totalDias;
};

//hacemos la solicitud de las vacaciones_solicitudes

exports.solicitarVacaciones = async ({
  usuario_id,
  filial_id,
  jefe_id,
  fecha_inicio,
  fecha_fin,
  pdf_solicitud,
}) => {
  //calculamos los dias efectivos de vacaciones

  const diasEfectivos = await this.calcularDiasEfectivos(
    fecha_inicio,
    fecha_fin,
    filial_id
  );
  //ahora vemos cuantos dias tiene el empleado disponibles

  const periodos = await Vacaciones.getPeriodosPorUsuario(usuario_id);
  if (!periodos.length)
    throw new Error("Este empleado no tiene dias de vacaciones asignados");

  //vemos si los dias solicitados ajustan para los dias que tiene

  let diasRestantesTotales = periodos.reduce(
    (acc, p) => acc + p.dias_restantes,
    0
  );

  if (diasEfectivos > diasRestantesTotales)
    throw new Error("No hay suficientes dias para las vacaciones solicitadas");

  //descontamos los dias por periodo mas antiguo

  let diasPorRestar = diasEfectivos;

  for (const p of periodos) {
    if (diasPorRestar <= 0) break;
    if (p.dias_restantes <= 0) continue;

    const descontar = Math.min(p.dias_restantes, diasPorRestar);
    await Vacaciones.actualizarDias(p.IDvacaciones, descontar);
    diasPorRestar -= descontar;
  }

  // guardamos la solicitud en la BD

  // return true;
  const idSolicitud = await vacacionesSolicitudModelo.crearSolicitud({
    usuario_id,
    jefe_id,
    fecha_inicio,
    fecha_fin,
    dias_calculados: diasEfectivos,
    pdf_solicitud,
  });
  return { idSolicitud, dias_calculados: diasEfectivos };
};

exports.revertirDiasTomados = async (usuarioID, diasAtomar) => {
  //traemos los periodos
  const periodos = await Vacaciones.getPeriodosPorUsuario(usuarioID);
  periodos.sort((a, b) => b.periodo_inicio - a.periodo_inicio);

  let diasPorRevertir = diasAtomar;

  for (const p of periodos) {
    const diasTomadosEnPeriodo = p.dias_asignados - p.dias_restantes;
    if (diasTomadosEnPeriodo <= 0) continue;

    const diasARestaurar = Math.min(diasPorRevertir, p.dias_tomados);

    p.dias_restantes += diasARestaurar;
    p.dias_tomados -= diasARestaurar;
    diasPorRevertir -= diasARestaurar;

    await Vacaciones.updateDiasRestantes(
      p.IDvacaciones,
      p.dias_restantes,
      p.dias_tomados
    );

    if (diasPorRevertir <= 0) break;
  }
};

exports.editarSolicitud = async ({
  IDsolicitud,
  fecha_inicio,
  fecha_fin,
  filial_id,
  pdf_solicitud,
}) => {
  const original = await vacacionesSolicitudModelo.getSolicitudById(
    IDsolicitud
  );

  //revertimos los dias con la funcion

  await this.revertirDiasTomados(original.usuario_id, original.dias_calculados);

  //calcular nuevos dias efectivos

  const diasEfectivos = await this.calcularDiasEfectivos(
    fecha_inicio,
    fecha_fin,
    filial_id
  );

  //Aplicar nuevos dias

  const periodos = await Vacaciones.getPeriodosPorUsuario(original.usuario_id);
  let diasPorRestar = diasEfectivos;

  for (const p of periodos) {
    if (diasPorRestar <= 0) break;
    if (p.dias_restantes <= 0) continue;

    const descontar = Math.min(p.dias_restantes, diasPorRestar);
    await Vacaciones.actualizarDias(p.IDvacaciones, descontar);
    diasPorRestar -= descontar;
  }

  let pdfFinal = null;
  if (pdf_solicitud) {
    if (original.pdf_solicitud) {
      const rutaAntigua = path.join("uploads/", original.pdf_solicitud);
      if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
    }
    pdfFinal = pdf_solicitud;
  }

  //Actualizamos

  await vacacionesSolicitudModelo.UpdateSolicitudVacaciones(
    IDsolicitud,
    fecha_inicio,
    fecha_fin,
    diasEfectivos,
    pdfFinal
  );

  return {
    mensaje: "Solicitud actualizada correctamente",
    dias_calculados: diasEfectivos,
  };
};

exports.eliminarSolicitud = async (IDsolicitud) => {
  const original = await vacacionesSolicitudModelo.getSolicitudById(
    IDsolicitud
  );

  await this.revertirDiasTomados(original.usuario_id, original.dias_calculados);

  if (original.pdf_solicitud) {
    let pdf;
    try {
      pdf = JSON.parse(original.pdf_solicitud); // parseamos si guardaste como JSON
    } catch (err) {
      pdf = original.pdf_solicitud; // fallback si guardaste como string plano
    }

    const pdfPath = pdf.path || pdf; // ruta real del archivo
    if (pdfPath && fs.existsSync(pdfPath)) {
      const rutaAntigua = path.join("uploads/", pdfPath);
      fs.unlinkSync(rutaAntigua); // elimina el archivo del disco
      console.log(`Archivo PDF eliminado: ${pdfPath}`);
    }
  }

  await vacacionesSolicitudModelo.deleteSolicitud(IDsolicitud);

  return true;
};

exports.solicitudesPorUsuario = async (IDempleado) => {
  const solicitudes = await vacacionesSolicitudModelo.getSolicitudByUser(
    IDempleado
  );

  return solicitudes;
};
