const express = require("express");
const vacacionesController = require("../controllers/vacacionesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.post(
  "/asignar",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  vacacionesController.ejecutarAsignacion
);
router.get("/getDays", authMiddleware, vacacionesController.getDays);
router.get(
  "/EmployersByBoss",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL"]),
  vacacionesController.getHolidaysXemployers
);

router.get(
  "/AllHolidaysUsers",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  vacacionesController.getHolidaysAll
);

router.get(
  "/PendindsDays",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  vacacionesController.pendingDays
);

module.exports = router;
