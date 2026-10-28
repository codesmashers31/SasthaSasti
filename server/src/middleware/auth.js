import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'divya_murti_sacred_erp_pos_jwt_secret_key_2026_98374823947');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    // Load role permissions
    const role = await Role.findOne({ slug: user.role_slug });
    const rolePermissions = role ? role.permissions : [];

    // Apply custom permission overrides
    let effectivePermissions = [...rolePermissions];
    if (user.customPermissions && user.customPermissions.length > 0) {
      for (const override of user.customPermissions) {
        if (override.is_granted) {
          if (!effectivePermissions.includes(override.permission)) {
            effectivePermissions.push(override.permission);
          }
        } else {
          effectivePermissions = effectivePermissions.filter(p => p !== override.permission);
        }
      }
    }

    req.user = user;
    req.userPermissions = effectivePermissions;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requirePermission = (permissionSlug) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Super admin bypasses all checks
    if (req.user.role_slug === 'super-admin') {
      return next();
    }

    if (req.userPermissions && req.userPermissions.includes(permissionSlug)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Permission denied: ${permissionSlug} required to access this resource`
    });
  };
};
