const NotificacionesService=require('../services/notificacionesService');

const getNotificaciones=async(req,res,next)=>{

    try {
        const notifis=await NotificacionesService.TraerNotificaciones();
        res.status(200).json({
            notifis,
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
}


const marcarLeidas=async(req,res,next)=>{
    try {

        await NotificacionesService.MarcarLeidas();
        res.status(200).json({
            message:"Notificaciones marcadas"
        })
        
    } catch (error) {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

module.exports={
    getNotificaciones,
    marcarLeidas
}