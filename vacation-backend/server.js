/*
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'vacation_app',     
  password: '32167368a',  
  database: 'vacation_system',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;

const initializeDatabase = async () => {
  try {
    db = await mysql.createPool(dbConfig);
    console.log('Connected to MySQL database successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await db.execute(`
      SELECT u.*, d.name as department_name, d.color as department_color
      FROM users u
      JOIN departments d ON u.department_id = d.id
      WHERE u.username = ? AND u.password = ?
    `, [username, password]);
    
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          totalDays: user.total_days,
          department: user.department_name,
          departmentId: user.department_id,
          departmentColor: user.department_color,
          role: user.role,
          managerId: user.manager_id
        }
      });
    } else {
      res.json({
        success: false,
        error: 'Λανθασμένο όνομα Χρήστη ή/και κωδικός'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.'
    });
  }
});

app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.*, d.name as department_name, d.color as department_color
      FROM users u
      JOIN departments d ON u.department_id = d.id
      ORDER BY u.name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/vacation-requests', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT vr.*, u.name as user_name, d.name as department_name, d.color as department_color,
             reviewer.name as reviewer_name
      FROM vacation_requests vr
      JOIN users u ON vr.user_id = u.id
      JOIN departments d ON u.department_id = d.id
      LEFT JOIN users reviewer ON vr.reviewed_by = reviewer.id
      ORDER BY vr.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get vacation requests error:', error);
    res.status(500).json({ error: 'Failed to fetch vacation requests' });
  }
});

app.post('/api/vacation-requests', async (req, res) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;
    
    const [result] = await db.execute(`
      INSERT INTO vacation_requests (user_id, start_date, end_date, reason)
      VALUES (?, ?, ?, ?)
    `, [userId, startDate, endDate, reason]);
    
    res.json({
      success: true,
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Create vacation request error:', error);
    res.status(500).json({
      success: false,
      error: 'Αποτυχία υποβολής αίτησης. Παρακαλώ δοκιμάστε ξανά.'
    });
  }
});

app.put('/api/vacation-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerId } = req.body;
    
    await db.execute(`
      UPDATE vacation_requests 
      SET status = ?, reviewed_by = ?, reviewed_date = CURDATE(), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, reviewerId, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update vacation request error:', error);
    res.status(500).json({
      success: false,
      error: 'Αποτυχία ενημέρωσης αίτησης. Παρακαλώ δοκιμάστε ξανά.'
    });
  }
});

app.get('/api/vacation-requests/pending/:managerId', async (req, res) => {
  try {
    const { managerId } = req.params;
    
    const [rows] = await db.execute(`
      SELECT vr.*, u.name as user_name, d.name as department_name, d.color as department_color
      FROM vacation_requests vr
      JOIN users u ON vr.user_id = u.id
      JOIN departments d ON u.department_id = d.id
      WHERE u.manager_id = ? AND vr.status = 'pending'
      ORDER BY vr.created_at ASC
    `, [managerId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});

const PORT = process.env.PORT || 3001;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
*/