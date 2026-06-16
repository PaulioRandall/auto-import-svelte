import path from 'path'

const POSIX = path.posix

test(`TODO`, () => {})

/*
describe('auto-import', () => {


	describe('_resolveImportDirs', () => {
		const filename = POSIX.resolve('./src/routes/+page.svelte')

		test(`component's own dir`, () => {
			const searchDirs = _resolveImportDirs(
				filename, //
				['.']
			)

			expect(searchDirs).toEqual([
				POSIX.resolve('./src/routes'), //
			])
		})

		test(`relative to component's own dir`, () => {
			const searchDirs = _resolveImportDirs(
				filename, //
				['../lib']
			)

			expect(searchDirs).toEqual([
				POSIX.resolve('./src/lib'), //
			])
		})

		test(`absolute dir`, () => {
			const searchDirs = _resolveImportDirs(
				filename, //
				['/home/username/local_library']
			)

			expect(searchDirs).toEqual([
				POSIX.resolve(`/home/username/local_library`),
			])
		})
	})
})
*/
