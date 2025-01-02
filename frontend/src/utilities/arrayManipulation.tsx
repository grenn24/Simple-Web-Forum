// Returns a new array with the element at the specified index removed
export function removeFromArray(array: any[], index: number) {
	const indexToRemove = index;
	const filteredArray = array.filter((_, index) => index !== indexToRemove);
	return filteredArray;
}
