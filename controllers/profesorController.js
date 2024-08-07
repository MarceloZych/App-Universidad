const { json } = require('express')
const db = require('../database/db');

class ProfesorController {
    constructor() { }

    async consultar(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM profesores');
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
        const { dni, nombre, apellido, email, profesion, telefono } = req.body;
        try {
            const [result] = await db.query('INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?,?,?,?,?,?)',
                [dni, nombre, apellido, email, profesion, telefono]);
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async modificar(req, res) {
        const { id } = req.params;
        const { dni, nombre, apellido, email, profesion, telefono } = req.body;
        try {
            const [result] = await db.query('UPDATE profesores SET dni=?, nombre=?, apellido=?, email=?, profesion=?, telefono=? WHERE id=?',
                [dni, nombre, apellido, email, profesion, telefono, id]);
            if (result.affectedRows === 1) {
                res.status(200).json({ res: "Actualizado" });
            } else {
                res.status(404).json({ res: "No se encontró el estudiante" });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async eliminar(req, res) {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM profesores WHERE id=?', [id]);
            if (result.affectedRows === 1) {
                res.status(200).json({ res: "Borrado" });
            } else {
                res.status(404).json({ res: "No se encontró el estudiante" });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new ProfesorController();