const cron=require('node-cron');

const VacacionesService=require('../services/vacacionesService');



const iniciarCronVacaciones=()=>{
    //ejecutar todos los dias a las 8:15 AM 
    cron.schedule('30 8 * * *',async()=>{
        console.log("⏳ Ejecutando cron de asignación de vacaciones...");
        try {
            await VacacionesService.asignarVacaciones();
            console.log("Cron ejecutado con exito"); 
        } catch (error) {
            console.error("❌ Error en el cron de vacaciones:", error.message);
        }
    },{
        timezone:"America/Tegucigalpa"
    })

}

module.exports={
    iniciarCronVacaciones
}

