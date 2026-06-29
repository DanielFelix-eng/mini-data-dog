import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const fmt = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

// signUp service
export const signUp = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
  }

  // Hashing should be handled in the User model middleware.
  // If your model doesn't have it, do it here.
  const user = await User.create({ name, email, password });

  return {
    token: generateToken(user._id),
    user: fmt(user),
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  return {
    token: generateToken(user._id),
    user: fmt(user),
  };
};

export const updateProfile = async ({ userId, name, email }) => {
  const exists = await User.findOne({ email, _id: { $ne: userId } });
  if (exists) {
    throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return {
    user: fmt(updated),
  };
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const ok = await user.comparePassword(currentPassword);
  if (!ok) {
    throw Object.assign(new Error('Current password is incorrect'), { statusCode: 401 });
  }

  // Hashing should be handled by User model pre-save middleware.
  user.password = newPassword;
  await user.save();

  return { message: 'Password updated' };
};

export const deleteAccount = async (userId) => {
  await User.findByIdAndDelete(userId);
  return { message: 'Account deleted' };
};

