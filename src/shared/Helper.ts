/**
 * Compare two strings ignoring case.
 * @param str1 string to compare.
 * @param str2 string to compare.
 */
export const equalsIgnoreCase = (str1: string, str2: string) => {
    str1 = str1?.toLowerCase() ?? '';
    str2 = str2?.toLowerCase() ?? '';
    return str1 === str2;
}