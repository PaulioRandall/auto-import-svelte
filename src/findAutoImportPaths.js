const LIB_ALIAS = '$lib'
const ROOT_ALIAS = '$root'

const WHITESPACE = '[\\r\\t\\f\\v ]*'
const PATH = '["\'`](?<path>.*?)["\'`]'

const dirRegex = new RegExp(
	`${WHITESPACE}\\$autoImportDir\\(${PATH}\\);?${WHITESPACE}`
)

const globRegex = new RegExp(
	`${WHITESPACE}\\$autoImportGlob\\(${PATH}\\);?${WHITESPACE}`
)

class AutoImport {
	_path = ''
	_lineIndex = 0
	_isGlob = false
	_isLib = false
	_isRoot = false

	constructor(path, lineIndex, isGlob) {
		this._path = path
		this._lineIndex = lineIndex
		this._isGlob = isGlob
		this._isLib = path.startsWith(LIB_ALIAS)
		this._isRoot = path.startsWith(ROOT_ALIAS)
	}

	get path() {
		if (this._isLib) {
			return '.' + this._path.slice(LIB_ALIAS.length)
		}

		if (this._isRoot) {
			return '.' + this._path.slice(ROOT_ALIAS.length)
		}

		return this._path
	}

	get lineIndex() {
		return this._lineIndex
	}

	isGlob() {
		return this._isGlob
	}

	isLib() {
		return this._isLib
	}

	isRoot() {
		return this._isRoot
	}
}

export default function (lines) {
	const results = []

	for (let i = 0; i < lines.length; i++) {
		const ais = findAutoImports(lines[i], i)
		results.push(...ais)
	}

	return results.filter(Boolean)
}

function findAutoImports(line, lineIndex) {
	const dirPath = findAutoImport(
		line,
		lineIndex, //
		dirRegex,
		false //
	)

	const globPath = findAutoImport(
		line,
		lineIndex, //
		globRegex,
		true //
	)

	return [dirPath, globPath]
}

function findAutoImport(line, lineIndex, regex, isGlob) {
	regex.lastIndex = 0

	const m = regex.exec(line)
	const path = m ? m.groups.path : ''

	if (!path) {
		return null
	}

	return new AutoImport(path, lineIndex, isGlob)
}
