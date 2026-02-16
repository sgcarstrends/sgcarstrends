const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const isValidMonth = (month: string): boolean => MONTH_REGEX.test(month);
