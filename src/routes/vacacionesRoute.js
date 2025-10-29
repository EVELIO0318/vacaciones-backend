const express = require("express");
const vacacionesController = require("../controllers/vacacionesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.post(
  "/asignar",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  vacacionesController.ejecutarAsignacion
);
router.get("/getDays", authMiddleware, vacacionesController.getDays);
router.get(
  "/EmployersByBoss",
  authMiddleware,
  roleMiddleware(["Admin", "GERENCIAL"]),
  vacacionesController.getHolidaysXemployers
);
module.exports = router;
