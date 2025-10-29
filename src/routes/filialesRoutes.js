const express = require("express");
const filialesController = require("../controllers/filialesController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["Admin", "TH"]));

router.get("/AllFiliales", filialesController.getAllFiliales);
router.post("/saveFilial", filialesController.saveFiliales);
router.put("/UpdateFilial", filialesController.UpdateF);
router.put("/DeleteFilial", filialesController.DeleteF);

module.exports = router;
