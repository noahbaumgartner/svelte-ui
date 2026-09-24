const pad = (n: number) => String(n).padStart(2, '0');

export function formatDate(date: Date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDate(value: string | undefined) {
	const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
	return match ? new Date(+match[1], +match[2] - 1, +match[3]) : undefined;
}

export function formatMonth(date: Date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function parseMonth(value: string | undefined) {
	const match = value?.match(/^(\d{4})-(\d{2})$/);
	return match ? new Date(+match[1], +match[2] - 1, 1) : undefined;
}

/** ISO 8601 week, as used by `<input type="week">`: weeks start on Monday. */
export function formatWeek(date: Date) {
	const thursday = new Date(date);
	thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
	const dayOfYear = Math.round(
		(thursday.getTime() - new Date(thursday.getFullYear(), 0, 1).getTime()) / 86400000
	);
	const week = Math.floor(dayOfYear / 7) + 1;
	return `${thursday.getFullYear()}-W${pad(week)}`;
}

/** Monday of the given ISO week. */
export function parseWeek(value: string | undefined) {
	const match = value?.match(/^(\d{4})-W(\d{2})$/);
	if (!match) return undefined;
	const jan4 = new Date(+match[1], 0, 4);
	return addDays(jan4, -((jan4.getDay() + 6) % 7) + (+match[2] - 1) * 7);
}

export function addDays(date: Date, days: number) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function addMonths(date: Date, months: number) {
	const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
	const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
	result.setDate(Math.min(date.getDate(), lastDay));
	return result;
}

export function startOfWeek(date: Date) {
	return addDays(date, -((date.getDay() + 6) % 7));
}

export function sameDay(a: Date | undefined, b: Date | undefined) {
	return !!a && !!b && formatDate(a) === formatDate(b);
}
