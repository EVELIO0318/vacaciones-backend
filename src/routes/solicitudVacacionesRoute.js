const express = require("express");
const SolicitudController = require("../controllers/vacacionesSolicitudController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMidleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const nameWithoutSpaces = file.originalname.replace(/\s+/g, "_");
    const uniqueName = Date.now() + "-" + nameWithoutSpaces;
    cb(null, uniqueName);
  },
});

// Filtrar tipo de archivo
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") {
    cb(null, true); // Aceptar archivo
  } else {
    const error = new Error("Solo se permiten archivos PDF");
    error.code = "INVALID_FILE_TYPE";
    cb(error); // Rechazar
  }
};

const upload = multer({ storage, fileFilter });

router.post(
  "/saveSolicitud",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL"]),
  upload.single("pdf_solicitud"),
  SolicitudController.crearSolicitud
);

router.put(
  "/UpdateSolicitud",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL"]),
  upload.single("pdf_solicitud"),
  SolicitudController.actualizarSolicitud
);

router.delete(
  "/DeleteSolicitud",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL"]),
  SolicitudController.deleteSolicitud
);

router.get(
  "/solicitudesByUser",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL", "TH"]),
  SolicitudController.getSolicitudByUser
);

router.get(
  "/ReporteMensual",
  authMiddleware,
  roleMiddleware(["ADMIN", "GERENCIAL", "TH"]),
  SolicitudController.daysByDates
);

module.exports = router;
