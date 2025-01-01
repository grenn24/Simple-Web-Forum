export function dateToTimeYear (date: Date) {
	return date.toLocaleTimeString("en-SG", {
		month: "numeric",
		day: "numeric",
		year: "numeric",
		timeStyle: "short",
	});
}

export function dateToYear (date: Date) {
	return date.toLocaleString("en-SG", { month: "numeric", day: "numeric", year: "numeric"});
}
