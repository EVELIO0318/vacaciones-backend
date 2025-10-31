const express =require('express');
const feriadosController=require('../controllers/feriadosController');
const authMiddleware = require ('../middlewares/authMiddleware');
const roleMiddleware = require ('../middlewares/roleMidleware');



const router=express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN", "TH"]));



router.post('/guardarFeriado',feriadosController.saveFe);
router.get('/Allferiados',feriadosController.AllFeriados);
router.put('/ActualizarFeriado',feriadosController.updateFeriado);
router.delete('/EliminarFeriado',feriadosController.deleteFeriado);

module.exports=router;  



