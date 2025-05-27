export class Time {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;

  constructor(data?: Partial<Time>) {
    if (data) {
      this.years = data.years;
      this.months = data.months;
      this.weeks = data.weeks;
      this.days = data.days;
      this.hours = data.hours;
      this.minutes = data.minutes;
    }
  }

  toHours(): number {
    return this.toMilliseconds() / (1000 * 60 * 60);
  }

  toDays(): number {
    return this.toHours() / 24;
  }

  toWeeks(): number {
    return this.toDays() / 7;
  }

  // Convert to total milliseconds
  toMilliseconds(): number {
    let total = 0;
    if (this.years) total += this.years * 365.25 * 24 * 60 * 60 * 1000;
    if (this.months) total += this.months * 30.44 * 24 * 60 * 60 * 1000; // Average month
    if (this.weeks) total += this.weeks * 7 * 24 * 60 * 60 * 1000;
    if (this.days) total += this.days * 24 * 60 * 60 * 1000;
    if (this.hours) total += this.hours * 60 * 60 * 1000;
    if (this.minutes) total += this.minutes * 60 * 1000;
    return total;
  }

  // Add this time to a date
  addToDate(date: Date): Date {
    const result = new Date(date);
    if (this.years) result.setFullYear(result.getFullYear() + this.years);
    if (this.months) result.setMonth(result.getMonth() + this.months);
    if (this.weeks) result.setDate(result.getDate() + this.weeks * 7);
    if (this.days) result.setDate(result.getDate() + this.days);
    if (this.hours) result.setHours(result.getHours() + this.hours);
    if (this.minutes) result.setMinutes(result.getMinutes() + this.minutes);
    return result;
  }

  // Check if this time duration is zero/empty
  isEmpty(): boolean {
    return !this.years && !this.months && !this.weeks && !this.days && !this.hours && !this.minutes;
  }

  // Create a human-readable string representation
  toString(): string {
    const parts: string[] = [];
    if (this.years) parts.push(`${this.years} year${this.years !== 1 ? 's' : ''}`);
    if (this.months) parts.push(`${this.months} month${this.months !== 1 ? 's' : ''}`);
    if (this.weeks) parts.push(`${this.weeks} week${this.weeks !== 1 ? 's' : ''}`);
    if (this.days) parts.push(`${this.days} day${this.days !== 1 ? 's' : ''}`);
    if (this.hours) parts.push(`${this.hours} hour${this.hours !== 1 ? 's' : ''}`);
    if (this.minutes) parts.push(`${this.minutes} minute${this.minutes !== 1 ? 's' : ''}`);

    if (parts.length === 0) return '0 minutes';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(' and ');
    return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
  }
}
