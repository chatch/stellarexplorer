
export function isDefInt(obj, key) {
    return (obj[key] && Number.isInteger(Number(obj[key])))
}
