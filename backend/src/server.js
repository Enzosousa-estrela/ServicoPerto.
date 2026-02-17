require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, '../leads.json');

function getLeadsFallback() {
    try {
        if (!fs.existsSync(LEADS_FILE)) return [];
        return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    } catch (err) {
        console.error('Error reading leads file:', err);
        return [];
    }
}

function saveLeadFallback(lead) {
    try {
        const leads = getLeadsFallback();
        const newLead = { ...lead, id: uuidv4(), created_at: new Date().toISOString() };
        leads.unshift(newLead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
        return newLead.id;
    } catch (err) {
        console.error('Error saving lead to file:', err);
        throw err;
    }
}

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Verify connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Database connected successfully at:', res.rows[0].now);
    }
});

// --- Mock Data for Plans (Synced with DB in production) ---
const PLANS = [
    { id: 'pla_pro_monthly', name: 'Profissional', price: 49.90, google_id: 'com.servicoperto.pro', apple_id: 'com.servicoperto.pro' }
];

// --- Health Check / Diagnostics ---
app.get('/', (req, res) => {
    res.json({ status: 'online', service: 'ServicoPerto Backend', timestamp: new Date() });
});

// --- API Endpoints ---

// 1. Get Plans
app.get('/api/plans', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM plans WHERE is_active = true');
        res.json(result.rows.length > 0 ? result.rows : PLANS);
    } catch (err) {
        console.error(err);
        res.json(PLANS); // Fallback if DB not ready
    }
});

// 2. IAP Verification (Mobile)
app.post('/api/iap/verify', async (req, res) => {
    const { platform, productId, receipt, providerId } = req.body;

    try {
        let isValid = false;
        let originalTransactionId = null;

        if (platform === 'GOOGLE') {
            // Logic to verify with Google Play Developer API
            // For MVP, we mock the validation success if receipt is present
            console.log('Verifying Google purchase:', receipt);
            isValid = true;
            originalTransactionId = `google_${Date.now()}`;
        } else if (platform === 'APPLE') {
            // Logic to verify with Apple StoreKit API
            console.log('Verifying Apple purchase:', receipt);
            isValid = true;
            originalTransactionId = `apple_${Date.now()}`;
        }

        if (isValid) {
            // Update Database
            const plan = PLANS.find(p => p.google_id === productId || p.apple_id === productId);

            // Upsert Subscription
            const subId = uuidv4();
            await pool.query(`
        INSERT INTO subscriptions (id, provider_id, plan_id, status, platform, external_subscription_id, current_period_end)
        VALUES ($1, $2, $3, 'ACTIVE', $4, $5, NOW() + INTERVAL '1 month')
        ON CONFLICT (provider_id) DO UPDATE 
        SET status = 'ACTIVE', current_period_end = NOW() + INTERVAL '1 month'
      `, [subId, providerId, plan ? plan.id : uuidv4(), platform, originalTransactionId]);

            // Enable Provider Features
            await pool.query(`
        UPDATE providers SET is_verified = true, ranking_score = 100 WHERE user_id = $1
      `, [providerId]);

            res.json({ success: true, message: 'Purchase verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid receipt' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2.5 Save Lead (Pre-registration)
app.post('/api/leads', async (req, res) => {
    const { name, whatsapp, type, specialty } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO leads (name, whatsapp, type, specialty)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [name, whatsapp, type, specialty]);
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.log('--- POST /api/leads ---');
        console.error('DB Error, using fallback:', err.message);
        try {
            const id = saveLeadFallback({ name, whatsapp, type, specialty });
            console.log('Lead saved to JSON fallback:', id);
            res.json({ success: true, id, fallback: true });
        } catch (fileErr) {
            console.error('File storage error:', fileErr.message);
            res.status(500).json({ error: 'Failed to save lead' });
        }
    }
});

// --- Admin Endpoints ---

// 4. Get Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalUsersResult = await pool.query('SELECT COUNT(*) FROM users');
        const rolesResult = await pool.query('SELECT role, COUNT(*) FROM users GROUP BY role');
        const neighborhoodsResult = await pool.query(`
            SELECT neighborhood, COUNT(*) 
            FROM providers 
            GROUP BY neighborhood 
            ORDER BY COUNT(*) DESC 
            LIMIT 10
        `);
        const trendsResult = await pool.query(`
            SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) 
            FROM users 
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY day 
            ORDER BY day DESC
        `);

        res.json({
            summary: {
                totalUsers: parseInt(totalUsersResult.rows[0].count),
                roles: rolesResult.rows,
            },
            regions: neighborhoodsResult.rows,
            trends: trendsResult.rows
        });
    } catch (err) {
        console.log('--- GET /api/admin/stats ---');
        console.error('DB Error, using empty stats:', err.message);
        res.json({
            summary: { totalUsers: 0, roles: [] },
            regions: [],
            trends: []
        });
    }
});

// 5. List All Users
app.get('/api/admin/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.created_at, p.service_type, p.neighborhood 
            FROM users u
            LEFT JOIN providers p ON u.id = p.user_id
            ORDER BY u.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.log('--- GET /api/admin/users ---');
        console.error('DB Error, using empty users:', err.message);
        res.json([]);
    }
});

// 6. List All Leads
app.get('/api/admin/leads', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.log('--- GET /api/admin/leads ---');
        console.error('DB Error, using fallback:', err.message);
        res.json(getLeadsFallback());
    }
});

// 3. Webhook Handler (Store Notifications)
app.post('/api/webhooks/store', (req, res) => {
    const event = req.body;
    console.log('Store Webhook Received:', event);
    // Implementation for RTDN (Real Time Developer Notifications)
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
