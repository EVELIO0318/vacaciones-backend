const PuestosService = require("../services/puestosService")



const AllPuestos=async(req,res,next)=>{
    try {
        const Puestos=await PuestosService.getAllPuestos();
        res.status(200).json({
            Puestos: Puestos
        })
    } catch (error) {
          res.status(401).json({
            success: false,
            message: error.message
        });
    }
}


const savePuesto=async(req,res,next)=>{
    const {nombre}=req.body;
    if (!nombre) {
         return res.status(400).json({ error: 'El Nombre del Puesto es requerido'});
    }
    try {
        const newP= await PuestosService.savePuesto(nombre);
        res.status(200).json({
            message: "Puesto creado correctamente",
            newP
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

const UpdateP=async(req,res,next)=>{
    try {
        const {IDpuesto,nombre}=req.body;
       if (!nombre) {
            return res.status(400).json({ error: 'El Nombre del Puesto es requerido'});
       }
   
       const PuestoActualizado=await PuestosService.updatePuesto(IDpuesto,nombre);
       res.status(200).json({
           message: "Puesto actualizado exitosamente",
           PuestoActualizado
       });
    } catch (error) {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
}


const DeleteP=async(req,res,next)=>{
    const {IDpuesto}=req.body;
    if (!IDpuesto) {
         return res.status(400).json({ error: 'ID no ingresador'});
    }

    try {
        const puestoBorrado= await PuestosService.deletePuesto(IDpuesto);
        res.status(200).json({
            message: "Puesto Inactivado con éxito",
            puestoBorrado
        })
    } catch (error) {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

module.exports={
    AllPuestos,
    savePuesto,
    UpdateP,
    DeleteP
}