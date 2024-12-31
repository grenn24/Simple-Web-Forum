export default function dateToString (date: Date) {
	return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
}
