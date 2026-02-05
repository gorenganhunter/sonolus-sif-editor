export const bisect = <K extends PropertyKey>(
    array: Record<K, number>[],
    key: K,
    value: number,
) => {
    let lo = 0
    let hi = array.length

    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (array[mid]![key] < value) {
            lo = mid + 1
        } else {
            hi = mid
        }
    }

    return lo
}

// export const search = <K extends PropertyKey>(
//     array: Record<K, number>[],
//     key: K,
//     value: number,
// ) => {
//     let i = 0
//
//     while (i < array.length && array[i]![key] < value) {
//         i++
//     }
//
//     return i
// }
//
export const addToOrdered = <T extends Record<K, number>, K extends PropertyKey>(
    array: T[],
    key: K,
    element: T,
) => {
    const index = bisect(array, key, element[key])
    array.splice(index, 0, element)
    return index
}

export const removeFromOrdered = <K extends PropertyKey>(
    array: Record<K, number>[],
    key: K,
    value: number,
) => {
    const index = bisect(array, key, value)
    array.splice(index, 1)
    return index
}
