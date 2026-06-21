import fs from 'fs'
import { globSync } from 'glob'
import path from 'path'

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
		return path.basename(this._absPath)
	}

	get name() {
		return this.filename.split('.')[0]
	}

	get extension() {
		const ext = path.extname(this._absPath)
		return ext.replace('.', '')
	}

	get importStatement() {
		return `import ${this.name} from "${this.relPath}";`
	}
}

export default function (srcFile, autoImport) {
	const absPath = resolveImportPath(srcFile, autoImport)

	if (autoImport.isGlob) {
		return listGlobFiles(srcFile, absPath)
	}

	return listFilesInDir(srcFile, absPath)
}

function resolveImportPath(srcFile, autoImport) {
	const p = autoImport.path

	if (autoImport.isLib) {
		const libDir = path.resolve('./src/lib')
		return path.join(libDir, p)
	} else if (autoImport.isRoot) {
		const rootDir = path.resolve('.')
		return path.join(rootDir, p)
	} else {
		const currDir = path.dirname(srcFile)
		return path.join(currDir, p)
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
	glob = posix(glob)

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
	return new FileImport(posix(absPath), posix(relPath))
}

function createAbsPath(importDir, filename) {
	const filepath = path.join(importDir, filename)
	return path.resolve(filepath)
}

function createRelPath(srcFile, absPath) {
	const srcDir = path.dirname(srcFile)
	const relPath = path.relative(srcDir, absPath)
	return './' + path.normalize(relPath)
}

function toGlobbedFileImport(srcFile, rootRelPath) {
	// E.g. `//?/C:`
	const winPrefix = /^\/\/\?\/[A-Z]:/	
	
	let absPath = posix(path.resolve(rootRelPath))
	if (winPrefix.test(absPath)) {
		absPath = absPath.slice('//?/C:'.length)
	}

	const srcDir = path.dirname(srcFile)
	const relPath = './' + path.relative(srcDir, absPath)

	return new FileImport(absPath, posix(relPath))
}

function posix(s) {
	// Glob has issue with Windows '\' separator.
	return s.replace(/\\/g, '/')
}
