# 🏖️ Sistema de Cálculo de Vacaciones – Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![API REST](https://img.shields.io/badge/API-REST-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Backend del **Sistema de Cálculo de Vacaciones**, una API REST en **Node.js** que gestiona el cálculo de días de vacaciones acumulados por cada año laboral y la asignación de esos días según antigüedad.

---

## 📌 Descripción

Este proyecto calcula automáticamente los **días de vacaciones** de un empleado cada vez que cumple un año laboral en la empresa.  
El sistema tiene en cuenta:
- 📆 Años trabajados → más años = más días acumulados.
- 📉 Cuando el empleado solicita vacaciones, el sistema descuenta los días **desde los más antiguos hasta los más recientes** para respetar la antigüedad acumulada. :contentReference[oaicite:2]{index=2}

---

## 🧠 ¿Cómo funciona?

1. Se registra un empleado con su fecha de ingreso.
2. El backend calcula cuántos días de vacaciones corresponden según los años trabajados.
3. Al hacer una solicitud de vacaciones:
   - Se verifica la disponibilidad de días.
   - Se descuentan primero los días más antiguos.
   - Se actualiza el registro de días disponibles.
---

## 📦 Tecnologías

✔️ Node.js  
✔ Express.js  
✔ API REST  
✔ JSON como formato de datos   
---

## 🚀 Instalación
   
   1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/EVELIO0318/vacaciones-backend.git
   
   2. Ir a la carpeta
   cd vacaciones-backend
   
   3. Instalar dependencias
   npm install
   
   4. Configurar variables de entorno
   Crea un archivo .env (si aplica) con tus variables:
   PORT=3000
   DB_URL=tu_conexion_de_bd
   
   5. Iniciar el servidor
   nodemon app.js
   
   por defecto se levanta en: http://localhost:3000
 ```

---

## 👨‍💻 Autor
Ing. Evelio Escobar
📌 Ingeniero en Sistemas y Docente Bilingüe
✈️ Apasionado por los viajes y la tecnología


📧 Contacto
Evelio Escobar
📩 evelio.villeda9@gmail.com

¡Gracias por visitar este proyecto! 🚀
