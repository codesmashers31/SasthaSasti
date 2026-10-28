import Setting from '../models/Setting.js';

export const getBarcodeSettings = async (req, res) => {
  try {
    const prefix = await Setting.findOne({ key: 'barcode_prefix' });
    const separator = await Setting.findOne({ key: 'barcode_separator' });
    const numberLength = await Setting.findOne({ key: 'barcode_number_length' });

    const config = {
      prefix: prefix ? prefix.value : 'SS',
      separator: separator ? separator.value : '-',
      numberLength: numberLength ? parseInt(numberLength.value) : 4,
    };

    res.json({
      success: true,
      settings: config,
      data: config,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveBarcodeSettings = async (req, res) => {
  try {
    const prefix = req.body.prefix || req.body.barcode_prefix || 'SS';
    const separator = req.body.separator !== undefined ? req.body.separator : (req.body.barcode_separator !== undefined ? req.body.barcode_separator : '-');
    const numberLength = req.body.numberLength || req.body.barcode_number_length || 4;

    await Setting.findOneAndUpdate({ key: 'barcode_prefix' }, { key: 'barcode_prefix', value: prefix, group: 'barcode' }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'barcode_separator' }, { key: 'barcode_separator', value: separator, group: 'barcode' }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'barcode_number_length' }, { key: 'barcode_number_length', value: String(numberLength), group: 'barcode' }, { upsert: true });

    res.json({
      success: true,
      message: 'Barcode customization saved successfully!',
      data: { prefix, separator, numberLength }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
