export function blankCheck(value: string, elementName: string): string {
  if (value.trim() === '') {
    return `${elementName}を入力してください`;
  }
  return '';
}

export function minLengthCheck(
  value: string,
  elementName: string,
  length: number
): string {
  if (value.trim().length < length) {
    return `${elementName}は少なくとも${length}文字以上である必要があります`;
  }
  return '';
}

export function maxLengthCheck(
  value: string,
  elementName: string,
  length: number
): string {
  if (value.trim().length > length) {
    return `${elementName}は${length}文字を超えてはいけません`;
  }
  return '';
}

export function dateCheck(
  value: string,
  elementName: string,
  minDate: string,
  maxDate: string
): string {
  const min = new Date(minDate);
  const max = new Date(maxDate);
  const selectedDate = new Date(value);

  if (selectedDate < min || selectedDate > max) {
    return `正しい${elementName}を入力してください。${minDate}から${maxDate}まで`;
  }
  return '';
}

export function emailFormatCheck(value: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value.trim())) {
    return '正しいメールアドレスの形式ではありません';
  }
  return '';
}