const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'lab_allocation_db';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

async function runSQLFile(connection, filePath) {
    console.log(`[setup.js] Executing ${path.basename(filePath)}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse and handle custom DELIMITER blocks (common in stored procedures/triggers)
    const lines = content.split(/\r?\n/);
    let currentDelimiter = ';';
    let currentStatement = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for delimiter command
        if (trimmed.toUpperCase().startsWith('DELIMITER ')) {
            currentDelimiter = trimmed.substring(10).trim();
            continue;
        }

        // Skip pure comments if buffer is empty
        if (!currentStatement.trim() && (trimmed.startsWith('--') || trimmed.startsWith('/*'))) {
            continue;
        }

        currentStatement += line + '\n';

        if (currentDelimiter === ';' && trimmed.endsWith(';')) {
            const stmtToRun = currentStatement.trim().replace(/;$/, '').trim();
            if (stmtToRun) {
                try {
                    await connection.query(stmtToRun);
                } catch (err) {
                    console.error(`\n❌ Error executing statement:\n${stmtToRun.substring(0, 200)}...`);
                    throw err;
                }
            }
            currentStatement = '';
        } else if (currentDelimiter !== ';' && trimmed.endsWith(currentDelimiter)) {
            const stmtToRun = currentStatement.trim().slice(0, -currentDelimiter.length).trim();
            if (stmtToRun) {
                try {
                    await connection.query(stmtToRun);
                } catch (err) {
                    console.error(`\n❌ Error executing routine/trigger:\n${stmtToRun.substring(0, 200)}...`);
                    throw err;
                }
            }
            currentStatement = '';
        }
    }

    if (currentStatement.trim()) {
        const stmtToRun = currentStatement.trim().replace(/;$/, '').trim();
        if (stmtToRun) {
            await connection.query(stmtToRun);
        }
    }
}

async function setupDatabase() {
    console.log('====================================================');
    console.log(' Automatic Lab Allocation System - Database Setup');
    console.log('====================================================');
    console.log(`Host: ${DB_HOST}:${DB_PORT} | User: ${DB_USER} | DB: ${DB_NAME}`);

    let rootConn;
    try {
        rootConn = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            multipleStatements: true
        });
        console.log('Connected to MySQL server.');

        await rootConn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
        await rootConn.query(`CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConn.query(`USE \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created fresh.`);

        // 1. Run schema.sql
        await runSQLFile(rootConn, path.join(__dirname, 'schema.sql'));
        console.log('Schema created successfully.');

        // 2. Run dbms_features.sql
        await runSQLFile(rootConn, path.join(__dirname, 'dbms_features.sql'));
        console.log('DBMS Features (Views, Procedures, Functions, Triggers) installed.');

        // 3. Run seed.sql
        await runSQLFile(rootConn, path.join(__dirname, 'seed.sql'));
        console.log('Seed data inserted successfully.');

        // Verify setup
        const [tables] = await rootConn.query('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        const [views] = await rootConn.query('SHOW FULL TABLES WHERE Table_type = "VIEW"');
        const [procs] = await rootConn.query(`SHOW PROCEDURE STATUS WHERE Db = '${DB_NAME}'`);
        const [funcs] = await rootConn.query(`SHOW FUNCTION STATUS WHERE Db = '${DB_NAME}'`);
        const [triggers] = await rootConn.query('SHOW TRIGGERS');

        console.log('\n--- VERIFICATION SUMMARY ---');
        console.log(`Base Tables (${tables.length}):`, tables.map(t => Object.values(t)[0]).join(', '));
        console.log(`Views (${views.length}):`, views.map(v => Object.values(v)[0]).join(', '));
        console.log(`Stored Procedures (${procs.length}):`, procs.map(p => p.Name).join(', '));
        console.log(`Stored Functions (${funcs.length}):`, funcs.map(f => f.Name).join(', '));
        console.log(`Triggers (${triggers.length}):`, triggers.map(t => t.Trigger).join(', '));
        console.log('\nDatabase setup completed successfully! All constraints & objects active.');

    } catch (err) {
        console.error('\nDatabase setup FAILED:', err.message);
        process.exit(1);
    } finally {
        if (rootConn) {
            await rootConn.end();
        }
    }
}

setupDatabase();
