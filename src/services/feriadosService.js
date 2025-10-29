const Feriados = require('../models/feriadosModel');


exports.guardarFeriados=async (Feriadodata)=>{
    // console.log(Feriadodata)
    const {descripcion,fechaInicio,fechaFin,aplicaTodas,filiales}=Feriadodata;

    const feriadoId= await Feriados.saveFeriado(descripcion,fechaInicio,fechaFin,aplicaTodas);


    if (!aplicaTodas && Array.isArray(filiales) && filiales.length > 0) {
        // console.log("Por filial")
        for (const idFilial of filiales) {
        await Feriados.saveFeriadoFilial(feriadoId, idFilial);
        }
  }

  return {IDferiado: feriadoId,descripcion,fechaInicio,fechaFin,aplicaTodas,filiales : filiales || []}
        
}


exports.todosLosFeriados=async()=>{
    const feriados= await Feriados.getAllFeriados();
    return feriados;
}


exports.EditarFeriado=async(datos)=>{
     const { IDferiado,descripcion, fechaInicio, fechaFin, aplicaTodas, filiales } = datos;

     const feriadoguardado=await Feriados.UpdateFeriado(IDferiado,descripcion,fechaInicio,fechaFin,aplicaTodas);

    if (aplicaTodas) {
        await Feriados.DeleteferiadoFilial(IDferiado);
    }else{
        await Feriados.DeleteferiadoFilial(IDferiado);
        for (const idFilial of filiales) {
            await Feriados.saveFeriadoFilial(IDferiado, idFilial);
        }
    }

    return feriadoguardado;
}


exports.DeleteFeriado=async(IDferiado)=>{
    await Feriados.deleteFeriadoAll(IDferiado);
    return true;
}