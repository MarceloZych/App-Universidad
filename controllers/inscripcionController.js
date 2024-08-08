const { json } = require('express')
const db = require('../database/db')

class InscripcionController {
    constructor() { }

    async inscribir(req,res) {
        const [curso_id , estudiante_id] = req.params
        const conn = await db.getConnection()

        try {
            await conn.beginTransaction()
            const [estResult] = await conn.query(`SELECT COUNT(*) AS cant FROM estudiante WHERE id=?`, [estudiante_id])
            if (estResult[0].cant === 0){
                return res.status(400).json({ mens: 'El estudiante no existe'})
            }

            const [cursosResult] = await conn.query(`SELECT COUNT(*) AS cant FROM cursos WHERE id=?`, [curso_id])
            if (cursosResult[0].cant === 0) {
                await conn.rollback()
                return res.status(400).json({mens: 'El curso no existe'})
            }

            const [insertRes] = await conn.query(`INSERT INTO cursos_estudiantes(curso_id , estudiante_id) VALUES(?,?)`, [curso_id , estudiante_id])
            if (insertRes.affectedRows === 1) {
                await conn.commit()
                res.status(200).json({mens: 'Estudiante inscripto en el curso'})
            } else {
                await conn.rollback()
                res.status(400).send({mens: 'La inscripcion no se realizo'})
            }
        } catch (error) {
            try {
                await conn.rollback()
            } catch (errorRollback) {
                res.status(500).send(errorRollback)
            }
            res.status(500).send(err.message)
        }
    }

    async consultarTodos(req,res) {
        try {
            const [rows] = await db.query(`SELECT FROM estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes
                                            INNER JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
                                            INNER JOIN estudiantes ON cursos_estudiantes.curso_id = estudiante.id`)
            
                res.status(200).json()
        } catch (error) {
                res.status(500).send(error.message)
        }
    }

    async consultarxCurso(req,res) {
        const { id } = req.params
        try {
            const [rows] = await db.query(`SELECT FROM estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes
                                            INNER JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
                                            INNER JOIN estudiantes ON cursos_estudiantes.curso_id = estudiante.id
                                            WHERE cursos.id=?`, [id])
            
                res.status(200).json()
        } catch (error) {
                res.status(500).send(error.message)
        }
    }

    async consultarxEstudiante(req,res) {
        const { id } = req.params
        try {
            const [rows] = await db.query(`SELECT FROM estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes
                                            INNER JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
                                            INNER JOIN estudiantes ON cursos_estudiantes.curso_id = estudiante.id
                                            WHERE estudiante.id=?`, [id])
            
                res.status(200).json()
        } catch (error) {
                res.status(500).send(error.message)
        }
    }
}

module.exports = new InscripcionController()