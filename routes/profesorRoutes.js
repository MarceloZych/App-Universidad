const express = require('express')
const routes = express.Router()
const profesorController = require('../controllers/profesorController')

routes.get('/', profesorController.consultar)
routes.post('/', profesorController.insertar)

routes.route('/:id')
        .get(profesorController.consultarUno)
        .put(profesorController.modificar)
        .delete(profesorController.eliminar)

module.exports = routes