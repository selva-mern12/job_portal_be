import express from 'express';
import { pool } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply for a Job
router.post('/apply/:jobId', authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const { resume_url, cover_letter } = req.body;
        await pool.query(
            `INSERT INTO apply_jobs (job_id, user_id, resume_url, cover_letter) VALUES (?, ?, ?, ?)`,
            [jobId, req.user.userId, resume_url, cover_letter]
        );
        res.status(201).json({ message: 'Applied successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error applying for job' });
    }
});

// Get Applied Jobs
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [applications] = await pool.query(
            `SELECT * FROM apply_jobs WHERE user_id = ?`,
            [req.user.userId]
        );
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching applied jobs' });
    }
});

// Delete Application
router.delete('/apply/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM apply_jobs WHERE id = ? AND user_id = ?`, [id, req.user.userId]);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting application' });
    }
});

// Update Job Details
router.put('/:jobId', authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            job_position,
            monthly_salary,
            location,
            job_description,
            about_company,
            skills_required,
            additional_info,
        } = req.body;

        // Update the job details in the database
        const [result] = await pool.query(
            `UPDATE jobs 
             SET job_position = ?, monthly_salary = ?, location = ?, job_description = ?, about_company = ?, skills_required = ?, additional_info = ?
             WHERE id = ?`,
            [
                job_position,
                monthly_salary,
                location,
                job_description,
                about_company,
                skills_required,
                additional_info,
                jobId,
            ]
        );

        // Check if the job was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json({ message: 'Job updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating job' });
    }
});

export default router;