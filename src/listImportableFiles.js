import fs from 'fs'
import { globSync } from 'glob'
import path from 'path'

const POSIX = path.posix

class FileImport {
	_absPath = ''
	_relPath = ''

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

	get importStatement() {
		return `import ${this.name} from "${this.relPath}";`
	}
}

export default function (srcFile, autoImport) {
	srcFile = POSIX.resolve(srcFile)
	const absPath = resolveImportPath(srcFile, autoImport)

	if (autoImport.isGlob) {
		return listGlobFiles(srcFile, absPath)
	}

	return listFilesInDir(srcFile, absPath)
}

function resolveImportPath(srcFile, autoImport) {
	// Relative and $lib imports only.
	const path = autoImport.path

	if (autoImport.isLib) {
		const libDir = POSIX.resolve('./src/lib')
		return POSIX.join(libDir, path)
	} else {
		const currDir = POSIX.dirname(srcFile)
		return POSIX.join(currDir, path)
	}
}

function listFilesInDir(srcFile, importDir) {
	if (!fs.existsSync(importDir)) {
		noSuchDirError(importDir)
	}

	return fs
		.readdirSync(importDir) //
		.map((f) => toFileImport(srcFile, importDir, f))
}

function listGlobFiles(srcFile, glob) {
	return globSync(glob, {
		posix: true, //
		nodir: true,
	}) //
		.map((f) => toGlobbedFileImport(srcFile, f))
}

function noSuchDirError(dir) {
	throw new Error(
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

function toGlobbedFileImport(srcFile, absPath) {
	// E.g. `//?/C:`
	const winPrefix = /^\/\/\?\/[A-Z]:/

	if (winPrefix.test(absPath)) {
		absPath = absPath.slice('//?/C:'.length)
	}

	const srcDir = POSIX.dirname(srcFile)
	const relPath = './' + POSIX.relative(srcDir, absPath)
	return new FileImport(absPath, relPath)
}
