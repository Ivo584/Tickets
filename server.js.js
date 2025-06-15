const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Sin contraseña
  database: 'reparacion'
};


const express = require('express');
const app = express();
const port = 3000;

// Middleware para convertir solicitudes JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


app.get('/tickets', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM tickets WHERE estado = "activo"');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tickets', async (req, res) => {
  const { cliente, equipo, problema } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO tickets (cliente, equipo, problema, estado) VALUES (?, ?, ?, ?)',
      [cliente, equipo, problema, 'activo']
    );
    await connection.end();
    res.json({ id: result.insertId, cliente, equipo, problema, estado: 'activo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/tickets/:id', async (req, res) => {
  const id = req.params.id;
  const { cliente, equipo, problema, estado } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'UPDATE tickets SET cliente = ?, equipo = ?, problema = ?, estado = ? WHERE id = ?',
      [cliente, equipo, problema, estado, id]
    );
    await connection.end();
    res.json({ updated: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tickets/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM tickets WHERE id = ?', [id]);
    await connection.end();
    res.json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
