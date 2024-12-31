export default function dateToTimeYear (date: Date) {
	return date.toLocaleTimeString("en-SG", { month: "numeric", day: "numeric", year: "numeric" });
}
