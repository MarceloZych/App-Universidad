const { json } = require('express')
const db = require('../database/db')

class CursoController {
    constructor() { }

    async consultar(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM cursos');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async consultarUno(req, res) {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM profesores WHERE id=?', [id]);
            res.status(200).json(rows[0]);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async insertar(req, res) {
        const { nombre, descripcion, profesor_id } = req.body
        const conn = db.getConnection()
        try {
            await conn.getConnection()
            const [profesorResult] = await conn.query('SELECT COUNT(*) AS cant FROM profesores WHERE id=?', [profesor_id])

            if (profesorResult[0].cant === 0) {
                return res.status(400).json({ mens: 'El profesor no existe' })
            }

            const [inserResult] = await db.query('INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (NULL,?,?,?)', [nombre, descripcion, profesor_id])
            if (inserResult.affectedRows === 1) {
                await conn.commit()
                res.status(201).json({ mens: 'El profesor fue borrado' });
            } else {
                await conn.rollback()
                res.status(404).json({ mens: 'El curso no pudo ser insertado' })
            }
        } catch (error) {
            try {
                await conn.rollback()
            } catch (errRoll) {
                res.status(500).send(errRoll.message)
            }
            res.status(500).send(error.message);
        } finally {
            conn.release()
        }
    }

    async modificar(req, res) {
        const { id } = req.params;
        const { nombre, descripcion, profesor_id } = req.body;

        try {
            await conn.beginTransaction()

            const [profesorResult] = await conn.query('SELECT COUNT(*) AS cant FROM profesores WHERE id=?', [profesor_id])

            if (profesorResult[0].cant === 0) {
                return res.status(400).json({ mens: 'El profesor no existe' })
            }
            const [result] = await db.query(`UPDATE profesores SET nombre=?, descripcion=?, profesor_id=? WHERE id=?`,
                [nombre, descripcion, profesor_id, id]);
            if (result.affectedRows === 1) {
                conn.commit()
                res.status(200).json({ res: "Actualizado" });
            } else {
                await conn.rollback()
                res.status(404).json({ res: "No se encontró el curso" });
            }
        } catch (error) {
            try {
                await conn.rollback()
            } catch (errorRoll) {
                res.status(500).send(errorRoll.message)
            }
            res.status(500).send(error.message);
        }
    }

    async eliminar(req, res) {
        const { id } = req.params;
        try {
            const [deleteRes] = await db.query(`DELETE FROM cursos WHERE id=?`, [id])

            if (deleteRes.affectedRows === 1) {
                res.status(200).json({mens: 'Curso borrado con éxito'})
            }else{
                res.status(400).json({mens: 'El curso no existe'})
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new CursoController()