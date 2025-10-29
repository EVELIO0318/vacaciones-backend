const Puestos=require('../models/puestosModel');

exports.getAllPuestos=async()=>{
    const puestos=await Puestos.getPuestosAll();
    return puestos;
}

exports.savePuesto=async(name)=>{
     const existingPuesto=await Puestos.getPuestoForName(name);
     if (existingPuesto) {
        throw new Error('El Puesto ya existe');
     }

     const nuevoPuesto=await Puestos.guardarPuesto(name);
     return nuevoPuesto;
}


exports.updatePuesto=async(id,name)=>{
    
     const puestoUpdate= await Puestos.updatePuesto(id,name);
     return puestoUpdate
}

exports.deletePuesto=async(id)=>{
     const puestoDelete=await Puestos.deletePuesto(id);
     return puestoDelete;
}