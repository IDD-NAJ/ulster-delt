import { Router } from 'express';
import { AdminAuthService } from '../services/adminAuth';
import { adminAuth } from '../middleware/adminAuth';
import { AdminUser } from '../models/AdminUser';
import bcrypt from 'bcryptjs';

const router = Router();

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminAuthService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Change password route
router.post('/change-password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await AdminUser.getAdminUserById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AdminUser.updateAdminUser(adminId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard route
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await AdminUser.getAdminUserById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 