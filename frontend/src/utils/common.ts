export const isValidKeyValue = <T extends Object>(s: string, obj: T): boolean => {
    return s in obj;
}