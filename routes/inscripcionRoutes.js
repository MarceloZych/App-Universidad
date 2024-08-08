const express = require('express')
const routes = express.Router()
const InscripcionController = require('../controllers/inscripcionController')
const inscripcionController = require('../controllers/inscripcionController')

routes.get('/', InscripcionController.consultar)
routes.get('/xcurso/:id', inscripcionController.consultarxCurso)
routes.get('/xestudiante/:id', inscripcionController.consultarxEstudiante)
route.post('/', inscripcionController.inscribir)

module.exports = routes