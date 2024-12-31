// Returns a new filtered array with the element at the specified index removed

export default function removeFromArray(array: any[], index : number) {
    const indexToRemove = index
    const filteredArray = array.filter((_,index)=> index !== indexToRemove)
    return filteredArray
}