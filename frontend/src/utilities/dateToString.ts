
export function dateToTimeYear(date: Date, type: "short" | "long") {
	const timeYear = date
		.toLocaleTimeString("en-SG", {
			month: type === "short" ? "numeric" : "long",
			day: "numeric",
			year: "numeric",
			minute: "numeric",
			hour:"numeric"
		})
		.split(", ");
	if (timeYear.length === 1) {
		return timeYear[0]
	} else {
		return timeYear[0] + "   " + timeYear[1];
	}
}

export function dateToYear(date: Date, type: "short" | "long") {
	const year = date
		.toLocaleDateString("en-SG", {
			month: type === "short" ? "numeric" : "long",
			day: "numeric",
			year: "numeric",
		})
	if (type === "short") {
		return year.split(", ")[0];
	} else {
		return year.split("at")[0];
	}
}

export function dateToTime(date: Date) {
	const [_, time] = date
		.toLocaleTimeString("en-SG", {
			month: "numeric",
			day: "numeric",
			year: "numeric",
			minute: "numeric",
			hour: "numeric",
		})
		.split(", ");
	return time;
}
