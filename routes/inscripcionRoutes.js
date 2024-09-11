const express = require('express')
const routes = express.Router()
const InscripcionController = require('../controllers/inscripcionController')

routes.get('/', InscripcionController.consultarTodos)
routes.get('/xcurso/:id', InscripcionController.consultarxCurso)
routes.get('/xestudiante/:id', InscripcionController.consultarxEstudiante)
route.post('/', InscripcionController.inscribir)

module.exports = routes