import Setting from '../models/Setting.js';
import Product from '../models/Product.js';
import { getNextSequentialBarcode } from './productController.js';

export const getBarcodeSettings = async (req, res) => {
  try {
    const prefix = await Setting.findOne({ key: 'barcode_prefix' });
    const separator = await Setting.findOne({ key: 'barcode_separator' });
    const format = await Setting.findOne({ key: 'barcode_format' });
    const stickerSize = await Setting.findOne({ key: 'barcode_sticker_size' });

    const totalProducts = await Product.countDocuments();
    const nextBarcode = await getNextSequentialBarcode();

    const config = {
      prefix: prefix ? prefix.value : '',
      separator: separator ? separator.value : '',
      format: format ? format.value : 'numeric',
      stickerSize: stickerSize ? stickerSize.value : '50x25',
      totalProducts,
      nextBarcode,
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
    const prefix = req.body.prefix !== undefined ? req.body.prefix : (req.body.barcode_prefix !== undefined ? req.body.barcode_prefix : '');
    const separator = req.body.separator !== undefined ? req.body.separator : (req.body.barcode_separator !== undefined ? req.body.barcode_separator : '');
    const format = req.body.format || req.body.barcode_format || 'numeric';
    const stickerSize = req.body.stickerSize || req.body.barcode_sticker_size || '50x25';

    await Setting.findOneAndUpdate({ key: 'barcode_prefix' }, { key: 'barcode_prefix', value: prefix, group: 'barcode' }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'barcode_separator' }, { key: 'barcode_separator', value: separator, group: 'barcode' }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'barcode_format' }, { key: 'barcode_format', value: format, group: 'barcode' }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'barcode_sticker_size' }, { key: 'barcode_sticker_size', value: stickerSize, group: 'barcode' }, { upsert: true });

    const nextBarcode = await getNextSequentialBarcode();

    res.json({
      success: true,
      message: 'Barcode configuration saved successfully!',
      data: { prefix, separator, format, stickerSize, nextBarcode }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
