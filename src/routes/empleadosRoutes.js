const express = require("express");
const empleadoController = require("../controllers/empleadosController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.post("/login", empleadoController.logeo);

router.get(
  "/AllUser",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.AllUser
);
router.post(
  "/SaveUser",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.saveUsuario
);
router.put(
  "/EditUser",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.editUser
);
router.put(
  "/EditPassword",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.actualizarpass
);
router.put(
  "/DeleteUser",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.deleteUser
);
router.get(
  "/UserByBoss",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL"]),
  empleadoController.UserbyBossandHolidays
);

router.get(
  "/GetBosses",
  authMiddleware,
  roleMiddleware(["ADMIN", "TH"]),
  empleadoController.getBosses
);

module.exports = router;
