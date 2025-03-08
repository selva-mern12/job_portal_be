import express from 'express';
import { pool } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Post a Job
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { company_name, logo_url, job_position, monthly_salary, job_type, remote_office, location, job_description, about_company, skills_required, additional_info } = req.body;

        await pool.query(
            `INSERT INTO job_list (company_name, logo_url, job_position, monthly_salary, job_type, remote_office, location, job_description, about_company, skills_required, additional_info) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [company_name, logo_url, job_position, monthly_salary, job_type, remote_office, location, job_description, about_company, skills_required, additional_info]
        );

        res.status(201).json({ message: 'Job posted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error posting job' });
    }
});

// Get All Jobs
router.get('/', async (req, res) => {
    try {
        const [jobs] = await pool.query(`SELECT * FROM job_list`);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs' });
    }
});

// Route to get a specific job by ID (View Details Page)
router.get('/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const [jobs] = await pool.query(`SELECT * FROM job_list WHERE id = ?`, [jobId]);
        if (jobs.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(jobs[0]); // Send only the specific job
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job details' });
    }
});

// Update Job
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, job_position, monthly_salary } = req.body;
        await pool.query(
            `UPDATE job_list SET company_name = ?, job_position = ?, monthly_salary = ? WHERE id = ?`,
            [company_name, job_position, monthly_salary, id]
        );
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating job' });
    }
});

// Delete Job
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM job_list WHERE id = ?`, [id]);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting job' });
    }
});

export default router;
