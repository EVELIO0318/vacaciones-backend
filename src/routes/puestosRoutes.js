const express = require("express");
const puestosController = require("../controllers/puestosController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN", "TH"]));

router.get("/Allpuestos", puestosController.AllPuestos);
router.post("/SaveP", puestosController.savePuesto);
router.put("/UpdateP", puestosController.UpdateP);
router.post("/DeleteP", puestosController.DeleteP);

module.exports = router;
