import fs from 'fs'
import { globSync } from 'glob'
import PusedoPosixPath from './PusedoPosixPath'

class FileImport {
	_path = null

	constructor(path) {
		this._path = path
	}

	get path() {
		return this._path.path
	}

	get filename() {
		return this._path.basename()
	}

	get name() {
		return this.filename.split('.')[0]
	}

	get extension() {
		const ext = this._path.extname()
		return ext.replace('.', '')
	}

	get importStatement() {
		return `import ${this.name} from "${this.path}";`
	}
}

export default function (srcFile, autoImport) {
	srcFile = new PusedoPosixPath(srcFile)
	const absPath = resolveImportPath(srcFile, autoImport)

	if (autoImport.isGlob()) {
		return listGlobFiles(srcFile, absPath)
	}

	return listFilesInDir(srcFile, absPath)
}

function resolveImportPath(srcFile, autoImport) {
	const ppp = new PusedoPosixPath(autoImport.path)

	if (autoImport.isLib()) {
		// $lib/blah
		const libDir = PusedoPosixPath.resolve('./src/lib')
		return PusedoPosixPath.join(libDir, ppp)
	} else if (autoImport.isRoot()) {
		// $root/blah
		const rootDir = PusedoPosixPath.resolve('.')
		return PusedoPosixPath.join(rootDir, ppp)
	} else {
		// ./blah
		return PusedoPosixPath.join(srcFile.dirname(), ppp)
	}
}

function listGlobFiles(srcFile, glob) {
	return globSync(glob.path, {
		posix: true, //
		nodir: true,
	}) //
		.map((f) => toGlobbedFileImport(srcFile, f))
}

function toGlobbedFileImport(srcFile, rootRelPath) {
	const absPath = PusedoPosixPath.resolve(rootRelPath)
	const relPath = srcFile.dirname().relative(absPath)
	return new FileImport(relPath)
}

function listFilesInDir(srcFile, importDir) {
	if (!fs.existsSync(importDir.original)) {
		noSuchDirError(importDir.original)
	}

	return fs
		.readdirSync(importDir.original) //
		.map((f) => toFileImport(srcFile, importDir, f))
}

function noSuchDirError(dir) {
	throw new Error(
		`[Svelte-Auto-Import] Dir '${dir}' does not exist or presented by the file system as such.`
	)
}

function toFileImport(srcFile, importDir, filename) {
	const absPath = importDir.append(filename)
	const relPath = srcFile
		.dirname() //
		.relative(absPath)
		.normalize()
	return new FileImport(relPath)
}
