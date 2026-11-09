/**
 * Nepalese Address and Phone Validation rules for CLEVARA checkout.
 */

export interface CustomerValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const NEPAL_PROVINCES = [
  'Koshi Province',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
] as const;

/**
 * Validates a Nepalese phone number.
 * Standard format: 10 digits starting with 98 or 97 (NTC, Ncell, SmartCell)
 * Or landlines starting with 01 (Kathmandu valley)
 * Allows optional country code prefix: +977 or 977
 */
export function validateNepalPhone(phone: string): { isValid: boolean; normalized: string; message?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalized: '', message: 'Phone number is required.' };
  }

  // Remove spaces, hyphens, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Extract core 10 digits if prefixed with +977 or 977
  let digits = cleaned;
  if (digits.startsWith('+977')) {
    digits = digits.slice(4);
  } else if (digits.startsWith('977') && digits.length > 10) {
    digits = digits.slice(3);
  }

  // Nepalese mobile numbers must be 10 digits starting with 98 or 97 or 96
  const mobileRegex = /^(98|97|96)\d{8}$/;
  // Kathmandu landlines: 01 followed by 7 digits = 9 digits
  const landlineRegex = /^01\d{7}$/;

  if (mobileRegex.test(digits)) {
    return { isValid: true, normalized: `+977 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` };
  }

  if (landlineRegex.test(digits)) {
    return { isValid: true, normalized: `+977 01 ${digits.slice(2)}` };
  }

  return {
    isValid: false,
    normalized: digits,
    message: 'Please enter a valid 10-digit Nepalese mobile number (e.g., 9841234567).',
  };
}

export function validateCustomerAddress(data: {
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  cityMunicipality?: string;
  areaTole?: string;
  fullAddress?: string;
  houseNumber?: string;
}): CustomerValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  }

  const phoneValidation = validateNepalPhone(data.phone || '');
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message || 'Valid Nepalese phone number required.';
  }

  if (!data.province || data.province.trim().length === 0) {
    errors.province = 'Please select a province.';
  }

  if (!data.district || data.district.trim().length < 2) {
    errors.district = 'District is required.';
  }

  if (!data.cityMunicipality || data.cityMunicipality.trim().length < 2) {
    errors.cityMunicipality = 'City or Municipality is required.';
  }

  if (!data.areaTole || data.areaTole.trim().length < 2) {
    errors.areaTole = 'Area or Tole name is required.';
  }

  if (!data.fullAddress || data.fullAddress.trim().length < 5) {
    errors.fullAddress = 'Detailed delivery address is required.';
  }

  if (!data.houseNumber || data.houseNumber.trim().length === 0) {
    errors.houseNumber = 'House number or building name is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
