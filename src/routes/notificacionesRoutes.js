const express =require('express');
const notificacionesController=require('../controllers/notificacionesController');
const authMiddleware = require ('../middlewares/authMiddleware');
const roleMiddleware = require ('../middlewares/roleMidleware');

const router=express.Router();



router.use(authMiddleware);
router.use(roleMiddleware(["Admin", "TH"]));

router.get('/Allnotificaciones',notificacionesController.getNotificaciones);
router.put('/ReadNotifications',notificacionesController.marcarLeidas);

module.exports=router