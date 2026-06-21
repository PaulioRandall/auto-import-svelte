import nodePath from 'path'
import PusedoPosixPath from './PusedoPosixPath'

const win32 = nodePath.win32
const posix = nodePath.posix
const local = nodePath

function fmt(s) {
	return s.replace(/\\/g, '/')
}

describe('PusedoPosixPath.js', () => {
	beforeEach(() => (PusedoPosixPath._lib = win32))
	afterEach(() => (PusedoPosixPath._lib = local))

	test('static resolve', () => {
		const act = PusedoPosixPath.resolve('bob')

		const expOriginal = win32.resolve('.\\bob')
		expect(act.original).toEqual(expOriginal)

		const expPath = fmt(expOriginal)
		expect(act.path).toEqual(expPath)
	})

	test('static join', () => {
		const alice = new PusedoPosixPath('C:\\user\\home\\alice')
		const act = PusedoPosixPath.join(alice, 'in', 'chains')

		const expOriginal = 'C:\\user\\home\\alice\\in\\chains'
		expect(act.original).toEqual(expOriginal)

		const expPath = fmt(expOriginal)
		expect(act.path).toEqual(expPath)
	})

	test('relative', () => {
		const alice = new PusedoPosixPath('C:\\user\\home\\alice')
		const bob = new PusedoPosixPath('C:\\user\\home\\bob')

		const act = alice.relative(bob)

		expect(act.original).toEqual('..\\bob')
		expect(act.path).toEqual('../bob')
	})

	test('driveless', () => {
		const alice = new PusedoPosixPath('C:\\user\\home\\alice')
		const act1 = alice.driveless(alice)
		expect(act1).toEqual('/user/home/alice')
	})
})
