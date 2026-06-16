import path from 'path'
import listImportableFiles from './listImportableFiles.js'

function unorderedEquals(act, exp) {
	expect(act).toEqual(expect.arrayContaining(exp))
}

const POSIX = path.posix

// The Svelte file being preprocessed.

describe('listImportableFiles.js', () => {
	test('Auto import same directory', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, '.')

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			POSIX.resolve('./src/testdata/Grid.svelte'),
			POSIX.resolve('./src/testdata/GridCell.svelte'),
			POSIX.resolve('./src/testdata/GridColumn.svelte'),
			POSIX.resolve('./src/testdata/GridRow.svelte'),
			POSIX.resolve('./src/testdata/NotSvelteFile.txt'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./Grid.svelte',
			'./GridCell.svelte',
			'./GridColumn.svelte',
			'./GridRow.svelte',
			'./NotSvelteFile.txt',
		])
	})

	test('Auto import from another directory', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, './subdir')

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			POSIX.resolve('./src/testdata/subdir/GridCellBorder.svelte'),
			POSIX.resolve('./src/testdata/subdir/GridCellContent.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./subdir/GridCellBorder.svelte',
			'./subdir/GridCellContent.svelte',
		])
	})
})
