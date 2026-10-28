import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, default: '' },
  password: { type: String, required: true },
  role_id: { type: Number },
  role_slug: { type: String, default: 'viewer' },
  role_name: { type: String, default: 'Viewer' },
  department_id: { type: Number },
  department_name: { type: String, default: '' },
  avatar: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  customPermissions: [{
    permission: { type: String, required: true },
    is_granted: { type: Boolean, default: true },
  }],
  last_login_at: { type: Date, default: null },
  last_login_ip: { type: String, default: null },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Supports PHP bcrypt hashes ($2y$ or $2a$)
  let hash = this.password;
  if (hash.startsWith('$2y$')) {
    hash = '$2a$' + hash.slice(4);
  }
  return await bcrypt.compare(enteredPassword, hash);
};

export default mongoose.model('User', userSchema);
