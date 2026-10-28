import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import ActivityLog from '../models/ActivityLog.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'divya_murti_sacred_erp_pos_jwt_secret_key_2026_98374823947', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const user = await User.findOne({
      $or: [{ username: username.trim() }, { email: username.trim() }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials entered' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is inactive. Please contact administrator.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Update last login
    user.last_login_at = new Date();
    user.last_login_ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    await user.save();

    // Log activity
    await ActivityLog.create({
      user_id: user.legacyId || 1,
      user_name: user.name,
      action: 'login',
      module: 'auth',
      reference_code: user.username,
      description: `User ${user.name} logged in successfully`,
      ip_address: user.last_login_ip,
      user_agent: req.headers['user-agent'] || '',
    });

    // Fetch role permissions
    const role = await Role.findOne({ slug: user.role_slug });
    let permissions = role ? [...role.permissions] : [];

    if (user.role_slug === 'super-admin') {
      permissions = ['*'];
    } else if (user.customPermissions && user.customPermissions.length > 0) {
      for (const override of user.customPermissions) {
        if (override.is_granted && !permissions.includes(override.permission)) {
          permissions.push(override.permission);
        } else if (!override.is_granted) {
          permissions = permissions.filter(p => p !== override.permission);
        }
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        legacyId: user.legacyId,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role_slug: user.role_slug,
        role_name: user.role_name,
        department_name: user.department_name,
        permissions,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        id: user._id,
        legacyId: user.legacyId,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role_slug: user.role_slug,
        role_name: user.role_name,
        department_name: user.department_name,
        permissions: req.userPermissions || [],
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.body.name) user.name = req.body.name;
    if (req.body.mobile) user.mobile = req.body.mobile;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) {
      const bcrypt = (await import('bcryptjs')).default;
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
