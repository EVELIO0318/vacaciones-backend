const express = require('express');
const cors = require('cors');
const empleadosRoutes=require('./src/routes/empleadosRoutes');
const puestosRoutes=require('./src/routes/puestosRoutes');
const filialesRoutes=require('./src/routes/filialesRoutes');
const feriadosRoutes=require('./src/routes/feriadosRoutes');
const VacacionesRoute=require('./src/routes/vacacionesRoute');
const SolicitudRoute=require('./src/routes/solicitudVacacionesRoute');
const NotificacionesRoute=require('./src/routes/notificacionesRoutes');
const {iniciarCronVacaciones}=require('./src/cron/vacacionesCron');
const path = require('path');
const morgan = require('morgan');
// const pool = require('./src/utils/db');



const app = express();

// Prueba de conexión a la base de datos
// pool.getConnection()
//   .then(conn => {
//     console.log('Database connected successfully!');
//     conn.release();
//   })
//   .catch(err => {
//     console.error('Error connecting to the database:', err);
//   });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.use(cors()); // Permitir peticiones desde el frontend (React)
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(morgan('dev')); // Mostrar logs de peticiones en consola
app.use(express.json());
// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));
 

//rutas del usuario, osea por modulo 
app.use('/api/empleados',empleadosRoutes);
app.use('/api/puestos',puestosRoutes);
app.use('/api/filiales',filialesRoutes);
app.use('/api/feriados',feriadosRoutes);
app.use('/api/vacaciones',VacacionesRoute);
app.use('/api/solicitud',SolicitudRoute);
app.use('/api/notificaciones',NotificacionesRoute);
  
//manejo de errores



app.use((err,req,res,next)=>{

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo es demasiado grande' });
  }

  console.log("Hay errores, revisar",err);
  return res.status(500).json({error: err.message})
});


const PORT =process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puertoo ${PORT}`);
  iniciarCronVacaciones();
});

module.exports = app;
