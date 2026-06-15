import fs from 'fs'
import path from 'path'

const POSIX = path.posix

class FileImport {
	_absPath = ''

	constructor(absPath, relPath) {
		this._absPath = absPath
		this._relPath = relPath
	}

	get absPath() {
		return this._absPath
	}

	get relPath() {
		return this._relPath
	}

	get filename() {
		return POSIX.basename(this._absPath)
	}

	get name() {
		return this.filename.split('.')[0]
	}

	get extension() {
		const ext = POSIX.extname(this._absPath)
		return ext.replace('.', '')
	}

	get importStatment() {
		return `\timport ${this.name} from "./${this.relPath}"`
	}
}

export default function (srcFile, autoImportPaths) {
	srcFile = POSIX.resolve(srcFile)
	const results = []

	for (const aip of autoImportPaths) {
		const importDir = resolveImportDir(srcFile, aip)
		results.push(...listFilesInDir(srcFile, importDir))
	}

	return results
}

// Currently relative only imports.
function resolveImportDir(srcFile, aip) {
	const currDir = POSIX.dirname(srcFile)
	const importDir = POSIX.join(currDir, aip)
	const absPath = POSIX.resolve(importDir)
	return POSIX.normalize(absPath)
}

function listFilesInDir(srcFile, importDir) {
	if (!fs.existsSync(importDir)) {
		noSuchDirError(importDir)
	}

	return fs
		.readdirSync(importDir) //
		.map((f) => toFileImport(srcFile, importDir, f))
}

function noSuchDirError(dir) {
	throw err(
		`[Svelte-Auto-Import] Dir '${dir}' does not exist or presented by the file system as such.`
	)
}

function toFileImport(srcFile, importDir, filename) {
	const absPath = createAbsPath(importDir, filename)
	const relPath = createRelPath(srcFile, absPath)
	return new FileImport(absPath, relPath)
}

function createAbsPath(importDir, filename) {
	const filepath = POSIX.join(importDir, filename)
	return POSIX.resolve(filepath)
}

function createRelPath(srcFile, absPath) {
	const srcDir = POSIX.dirname(srcFile)
	const relPath = POSIX.relative(srcDir, absPath)
	return './' + POSIX.normalize(relPath)
}
