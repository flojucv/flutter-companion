// Fonction pour convertir snake_case ou kebab-case en PascalCase
function toPascalCase(str) {
    return str
        .replace(/[-_]+/g, ' ')
        .replace(/\s+(.)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest)
        .replace(/^\w/, c => c.toUpperCase())
        .replace(/\s/g, '');
}

// Fonction pour convertir snake_case ou kebab-case en "Title Case"
function toTitleCase(str) {
    return str
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = {
    toPascalCase,
    toTitleCase
}