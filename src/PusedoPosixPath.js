import nodePath from 'path'

// Some libraries have issue with Windows '\' separator
// (e.g. Glob) so this class is used as a path wrapper
// using Node's path functions.
//
// While forward slashes '/' are allowed in Windows paths,
// the original paths are kept and used for manipulation
// to avoid issues and equality checking.
//
// All functions that accept path arguments may accept them
// as either a string or a PusedoPosixPath.
export default class PusedoPosixPath {
	// For testing.
	static _lib = nodePath

	_original = ''
	_path = ''

	static resolve(...parts) {
		parts = parts.map(getOriginalPath)
		const p = PusedoPosixPath._lib.resolve(...parts)
		return new PusedoPosixPath(p)
	}

	static join(...parts) {
		parts = parts.map(getOriginalPath)
		const p = PusedoPosixPath._lib.join(...parts)
		return new PusedoPosixPath(p)
	}

	// Accepts a string or another PusedoPosixPath.
	constructor(p) {
		if (isPusedoPosixPath(p)) {
			this._original = p._original
			this._path = p._path
		} else {
			this._original = p
			this._path = format(p)
		}
	}

	get original() {
		return this._original
	}

	get path() {
		return this._path
	}

	toString() {
		return this._path
	}

	// append performs a path join with the receiving
	// PusedoPosixPath's path as the first argument.
	append(...parts) {
		return PusedoPosixPath.join(this._original, ...parts)
	}

	basename() {
		return PusedoPosixPath._lib.basename(this._original)
	}

	dirname() {
		const dir = PusedoPosixPath._lib.dirname(this._original)
		return new PusedoPosixPath(dir)
	}

	normalize() {
		const p = PusedoPosixPath._lib.normalize(this._original)
		return new PusedoPosixPath(p)
	}

	relative(to) {
		to = getOriginalPath(to)
		const p = PusedoPosixPath._lib.relative(this._original, to)
		return new PusedoPosixPath(p)
	}

	extname() {
		return PusedoPosixPath._lib.extname(this._original)
	}
}

function format(s) {
	s = s.replace(/\\/g, '/')

	if (PusedoPosixPath._lib.isAbsolute(s)) {
		return s
	}

	if (s.startsWith('./') || s.startsWith('../')) {
		return s
	}

	return './' + s
}

function isPusedoPosixPath(p) {
	return p instanceof PusedoPosixPath
}

function getOriginalPath(p) {
	return isPusedoPosixPath(p) ? p.original : p
}
