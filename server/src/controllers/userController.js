import User from '../models/User.js';
import Role from '../models/Role.js';
import Department from '../models/Department.js';
import Permission from '../models/Permission.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, username, email, mobile, password, role_id, department_id } = req.body;
    
    const role = await Role.findOne({ $or: [{ _id: role_id }, { legacyId: role_id }] });
    const dept = await Department.findOne({ $or: [{ _id: department_id }, { legacyId: department_id }] });

    const hashedPassword = await bcrypt.hash(password || 'admin123', 10);
    const count = await User.countDocuments();

    const user = await User.create({
      legacyId: count + 1,
      name,
      username,
      email,
      mobile: mobile || '',
      password: hashedPassword,
      role_id: role ? role.legacyId : 2,
      role_slug: role ? role.slug : 'admin',
      role_name: role ? role.name : 'Admin',
      department_id: dept ? dept.legacyId : 1,
      department_name: dept ? dept.name : 'Showroom',
      status: 'active',
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    if (updates.role_id) {
      const role = await Role.findOne({ $or: [{ _id: updates.role_id }, { legacyId: updates.role_id }] });
      if (role) {
        updates.role_slug = role.slug;
        updates.role_name = role.name;
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ success: true, status: user.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ status: 'active' });
    const users = await User.find();
    
    // Attach user count and permissions count
    const enrichedRoles = roles.map(r => {
      const userCount = users.filter(u => u.role_slug === r.slug || u.role_id === r.legacyId).length;
      return {
        ...r.toObject(),
        user_count: userCount,
        permission_count: r.permissions ? r.permissions.length : 0,
      };
    });

    res.json({ success: true, data: enrichedRoles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ module: 1, name: 1 });
    const grouped = {};
    permissions.forEach(p => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    res.json({ success: true, data: permissions, grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

    role.permissions = permissions;
    await role.save();
    res.json({ success: true, message: 'Role permissions updated successfully', role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ status: 'active' });
    const users = await User.find();
    const enriched = departments.map(d => ({
      ...d.toObject(),
      user_count: users.filter(u => u.department_id === d.legacyId).length
    }));
    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const count = await Department.countDocuments();
    const dept = await Department.create({
      legacyId: count + 1,
      name,
      code: code || `DEP-${Date.now().toString().slice(-4)}`,
      description: description || '',
      status: 'active',
    });
    res.status(201).json({ success: true, data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ success: true, message: 'Department archived' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
