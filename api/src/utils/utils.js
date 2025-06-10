export function camelToTitleCase(str) {
    if (!str) return;

    return (
        str.charAt(0).toUpperCase() +
        str
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
            .slice(1)
    );
}
