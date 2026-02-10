export function validateClinicName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim() === "") {
    return false;
  }

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const digitCount = cleanPhone.replace(/\+/g, "").length;

  if (digitCount < 7 || digitCount > 15) {
    return false;
  }

  const phoneRegex = /^(\+\d{1,3})?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

export function validateAddress(address: string): boolean {
  return address.length >= 5 && address.length <= 200;
}
