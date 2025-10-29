const Notificaciones= require('../models/notificacionesModel');


exports.TraerNotificaciones=async()=>{
    const notificaciones = await Notificaciones.getNotificaciones();
    return notificaciones
}

exports.MarcarLeidas=async()=>{
    const leidas=await Notificaciones.MarcarLeidas();
    return leidas;
}