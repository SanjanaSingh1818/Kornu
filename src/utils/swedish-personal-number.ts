export function normalizeSwedishPersonalNumber(value: string): string | null {
  const digits = value.replace(/[\s+-]/g, "");
  if (!/^(?:\d{10}|\d{12})$/.test(digits)) return null;

  const tenDigitNumber = digits.slice(-10);
  const month = Number(tenDigitNumber.slice(2, 4));
  const enteredDay = Number(tenDigitNumber.slice(4, 6));
  const day = enteredDay > 60 ? enteredDay - 60 : enteredDay;
  const maxDay = [4, 6, 9, 11].includes(month) ? 30 : month === 2 ? 29 : 31;
  if (month < 1 || month > 12 || day < 1 || day > maxDay) return null;

  if (digits.length === 12) {
    const year = Number(digits.slice(0, 4));
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    const product = Number(tenDigitNumber[index]) * (index % 2 === 0 ? 2 : 1);
    sum += Math.floor(product / 10) + (product % 10);
  }
  if ((10 - (sum % 10)) % 10 !== Number(tenDigitNumber[9])) return null;

  return digits;
}
