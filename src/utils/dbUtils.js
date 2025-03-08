import { pool } from "../config/db.js";

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user (
                user_id CHAR(36) PRIMARY KEY NOT NULL,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);
        

        await pool.query(`
            CREATE TABLE IF NOT EXISTS job_list (
                id INT AUTO_INCREMENT PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                logo_url TEXT,
                job_position VARCHAR(255) NOT NULL,
                monthly_salary DECIMAL(10,2),
                job_type ENUM('Full-Time', 'Part-Time', 'Contract', 'Internship') NOT NULL,
                remote_office ENUM('Remote', 'Office', 'Hybrid') NOT NULL,
                location VARCHAR(255),
                job_description TEXT NOT NULL,
                about_company TEXT,
                skills_required TEXT NOT NULL,
                additional_info TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS apply_jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                job_id INT NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                resume_url TEXT NOT NULL,
                cover_letter TEXT,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES job_list(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
            );
        `);

        console.log("✅ Tables created successfully");
    } catch (error) {
        console.error("❌ Something went wrong:", error);
    }
};

export { createTables };
