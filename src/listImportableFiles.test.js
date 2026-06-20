import path from 'path'
import listImportableFiles from './listImportableFiles.js'

function unorderedEquals(act, exp) {
	expect(act).toEqual(expect.arrayContaining(exp))
}

const POSIX = path.posix

describe('listImportableFiles.js', () => {
	test('Auto import same directory', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: '.', //
			isLib: false,
			isRoot: false,
			isGlob: false,
		})

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
		const components = listImportableFiles(srcFile, {
			path: './subdir', //
			isLib: false,
			isRoot: false,
			isGlob: false,
		})

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

	test('Auto import from another directory (glob)', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: './**/*', //
			isLib: false,
			isRoot: false,
			isGlob: true,
		})

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			POSIX.resolve('./src/testdata/Grid.svelte'),
			POSIX.resolve('./src/testdata/GridCell.svelte'),
			POSIX.resolve('./src/testdata/GridColumn.svelte'),
			POSIX.resolve('./src/testdata/GridRow.svelte'),
			POSIX.resolve('./src/testdata/NotSvelteFile.txt'),
			POSIX.resolve('./src/testdata/subdir/GridCellBorder.svelte'),
			POSIX.resolve('./src/testdata/subdir/GridCellContent.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./Grid.svelte',
			'./GridCell.svelte',
			'./GridColumn.svelte',
			'./GridRow.svelte',
			'./NotSvelteFile.txt',
			'./subdir/GridCellBorder.svelte',
			'./subdir/GridCellContent.svelte',
		])
	})

	test('Auto import from lib', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: '.', //
			isLib: true,
			isRoot: false,
			isGlob: false,
		})

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			POSIX.resolve('./src/lib/LibAlpha.svelte'),
			POSIX.resolve('./src/lib/LibBeta.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./../lib/LibAlpha.svelte',
			'./../lib/LibBeta.svelte',
		])
	})

	test('Auto import from lib', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: './src/lib', //
			isLib: false,
			isRoot: true,
			isGlob: false,
		})

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			POSIX.resolve('./src/lib/LibAlpha.svelte'),
			POSIX.resolve('./src/lib/LibBeta.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./../lib/LibAlpha.svelte',
			'./../lib/LibBeta.svelte',
		])
	})
})
