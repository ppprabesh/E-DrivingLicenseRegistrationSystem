declare module 'nepali-date-converter' {
  export default class NepaliDate {
    constructor(year: number, month: number, day: number);
    constructor(date: Date);
    format(format: string): string;
    toJsDate(): Date;
  }
} 