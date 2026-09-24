// Formatting and validation utility functions for QuickBite.
// Centralizes currency display, input sanitization, and form validation rules.

/**
 * Format numerical amount into standard Sri Lankan Rupee representation.
 * Example: 240 -> "LKR 240.00"
 */
export function formatLKR(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `LKR ${numeric.toFixed(2)}`;
}

/**
 * Format currency without decimals for compact card displays.
 * Example: 240 -> "LKR 240"
 */
export function formatLKRCompact(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `LKR ${Math.round(numeric)}`;
}

/**
 * Validate student email address.
 * Accepts standard email format, with preferential validation for University of Kelaniya domains.
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email address cannot be empty.' };
  }
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, message: 'Please enter a valid email format.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validate student registration number.
 * Accepts typical Sri Lankan university patterns like PS/2021/045, SE/2020/112, or student ID numbers.
 */
export function validateStudentId(studentId) {
  if (!studentId || typeof studentId !== 'string') {
    return { isValid: false, message: 'Student ID or Registration Number cannot be empty.' };
  }
  const cleanId = studentId.trim();
  if (cleanId.length < 5) {
    return { isValid: false, message: 'Student ID must be at least 5 characters long.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validate password length and presence.
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password cannot be empty.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validate Sri Lankan contact phone number for order SMS alerts.
 * Accepts 07XXXXXXXX (10 digits) or +947XXXXXXXX (12 characters).
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Contact phone number cannot be empty.' };
  }
  const cleanPhone = phone.trim().replace(/[\s-]/g, '');
  // Matches 07 followed by 8 digits, or +947 followed by 8 digits
  const slPhoneRegex = /^(?:0|(?:\+94))7\d{8}$/;
  if (!slPhoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      message: 'Enter a valid Sri Lankan mobile number (e.g., 0712345678 or +94712345678).',
    };
  }
  return { isValid: true, message: '' };
}

/**
 * Validate special kitchen instructions.
 * Caps length at 120 characters to keep kitchen tickets concise and legible.
 */
export function validateKitchenNotes(notes) {
  if (!notes) return { isValid: true, sanitized: '' };
  const trimmed = notes.trim();
  if (trimmed.length > 120) {
    return {
      isValid: false,
      message: 'Kitchen instructions must be 120 characters or fewer.',
      sanitized: trimmed.substring(0, 120),
    };
  }
  return { isValid: true, sanitized: trimmed, message: '' };
}

/**
 * Sanitize and clean user search query strings.
 */
export function sanitizeSearchQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query.trim().toLowerCase();
}
