const WHITESPACE = '[\\r\\t\\f\\v ]*'
const PATH = '["\'`](?<path>.*?)["\'`]'

const dirRegex = new RegExp(
	`${WHITESPACE}\\$autoImportDir\\(${PATH}\\);?${WHITESPACE}`
)

const globRegex = new RegExp(
	`${WHITESPACE}\\$autoImportGlob\\(${PATH}\\);?${WHITESPACE}`
)

export default function (lines) {
	const results = []

	for (let i = 0; i < lines.length; i++) {
		const dirPath = findAutoImport(lines[i], i, dirRegex, false)
		results.push(dirPath)

		const globPath = findAutoImport(lines[i], i, globRegex, true)
		results.push(globPath)
	}

	return results.filter(Boolean)
}

function findAutoImport(line, lineIndex, regex, isGlob) {
	regex.lastIndex = 0

	let path = findImportPath(line, regex)

	if (!path) {
		return null
	}

	const libAlias = '$lib'
	const isLib = path.startsWith(libAlias)
	if (isLib) {
		path = '.' + path.slice(libAlias.length)
	}

	const rootAlias = '$root'
	const isRoot = path.startsWith(rootAlias)
	if (isRoot) {
		path = '.' + path.slice(rootAlias.length)
	}

	return { isGlob, isLib, isRoot, path, lineIndex }
}

function findImportPath(line, regex) {
	const m = regex.exec(line)
	return m ? m.groups.path : ''
}
