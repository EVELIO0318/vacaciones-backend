const express = require("express");
const empleadoController = require("../controllers/empleadosController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.post("/login", empleadoController.logeo);

router.get(
  "/AllUser",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.AllUser
);
router.post(
  "/SaveUser",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.saveUsuario
);
router.put(
  "/EditUser",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.editUser
);
router.put(
  "/EditPassword",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.actualizarpass
);
router.put(
  "/DeleteUser",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.deleteUser
);
router.get(
  "/UserByBoss",
  authMiddleware,
  roleMiddleware(["Admin", "GERENCIAL"]),
  empleadoController.UserbyBossandHolidays
);

router.get(
  "/GetBosses",
  authMiddleware,
  roleMiddleware(["Admin", "TH"]),
  empleadoController.getBosses
);

module.exports = router;
