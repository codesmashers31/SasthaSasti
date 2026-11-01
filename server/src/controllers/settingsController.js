import Setting from '../models/Setting.js';
import ActivityLog from '../models/ActivityLog.js';

const DEFAULT_SETTINGS = {
  company_name: 'Sastha Sasti Enterprises',
  company_gstin: '',
  company_phone: '+91 98401 12233',
  company_address: 'Tamil Nadu, India',
  default_gst_percent: '0',
  invoice_prefix: 'SS',
  printer_type: 'thermal_80mm',
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = { ...DEFAULT_SETTINGS };
    
    settings.forEach(s => {
      // Clean legacy names
      if (s.key === 'company_name' && s.value && s.value.toLowerCase().includes('divya')) {
        settingsMap[s.key] = 'Sastha Sasti Enterprises';
      } else if (s.key === 'invoice_prefix' && s.value === 'DIVYA') {
        settingsMap[s.key] = 'SS';
      } else {
        settingsMap[s.key] = s.value;
      }
    });

    res.json({ success: true, settings: settingsMap, raw: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // { company_name: "...", gstin: "...", etc. }
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value: String(value) },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const module = req.query.module;

    const filter = {};
    if (module) filter.module = module;

    const total = await ActivityLog.countDocuments(filter);
    const logs = await ActivityLog.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
