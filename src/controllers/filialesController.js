const { message } = require('statuses');
const FilialesServices=require('../services/filialesService');



const getAllFiliales=async(req,res,next)=>{
    try {
        const Filiales= await FilialesServices.getAllFiliales();
        res.status(200).json({
            Filiales: Filiales
        })
    } catch (error) {
          res.status(401).json({
            success: false,
            message: error.message
        });
    }

}

const saveFiliales=async(req,res,next)=>{
    const {nombre_filial,tipo}=req.body;
   
    try { 
        if (!nombre_filial) {
            return res.status(400).json({ error: 'El Nombre de la Filial/Ventanilla es requerido'});
        }

        if (!tipo) {
            return res.status(400).json({ error: 'Seleccione el Tipo (Filial Ó Ventanilla)'});
        }


        const filialSaved= await FilialesServices.saveFilial(nombre_filial,tipo);
        res.status(200).json({
            filialSaved
        });
    } catch (error) {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
;

}


const UpdateF=async(req,res,next)=>{

    const {IDfilial,nombre_filial,tipo}=req.body;

    try {
        if (!nombre_filial) {
         return res.status(400).json({ error: 'El Nombre de la Filial/Ventanilla es requerido'});
    }

     if (!tipo) {
         return res.status(400).json({ error: 'Seleccione el Tipo (Filial Ó Ventanilla)'});
    }

    const filialUpdated= await FilialesServices.actualizarFilial(IDfilial,nombre_filial,tipo);
    res.status(200).json({
        message: "Filial Actualizada con exito",
        filialUpdated
    })
    } catch (error) {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
    
}


const DeleteF=async(req,res,next)=>{
    const {IDfilial}=req.body;

    try {
        const filialDeleted=await FilialesServices.borrarFilial(IDfilial);
        res.status(200).json({
            message:"Filial Inactivada correctamente",
            filialDeleted,
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
 
}


module.exports={
    getAllFiliales,
    saveFiliales,
    UpdateF,
    DeleteF
}