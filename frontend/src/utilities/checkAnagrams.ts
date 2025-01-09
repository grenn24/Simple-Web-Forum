export default function checkAnagrams(arr: string[], val: string) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].toLowerCase() === val.toLowerCase()) {
			return true;
		}
	}
	return false;
}
