import path from 'path'
import listImportableFiles from './listImportableFiles.js'

function unorderedEquals(act, exp) {
	expect(act).toEqual(expect.arrayContaining(exp))
}

function resolveToPosix(p) {
	// Glob has issue with Windows '\' separator.
	return path.resolve(p).replace(/\\/g, '/')
}

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
			resolveToPosix('./src/testdata/Grid.svelte'),
			resolveToPosix('./src/testdata/GridCell.svelte'),
			resolveToPosix('./src/testdata/GridColumn.svelte'),
			resolveToPosix('./src/testdata/GridRow.svelte'),
			resolveToPosix('./src/testdata/NotSvelteFile.txt'),
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
			resolveToPosix('./src/testdata/subdir/GridCellBorder.svelte'),
			resolveToPosix('./src/testdata/subdir/GridCellContent.svelte'),
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
			resolveToPosix('./src/testdata/Grid.svelte'),
			resolveToPosix('./src/testdata/GridCell.svelte'),
			resolveToPosix('./src/testdata/GridColumn.svelte'),
			resolveToPosix('./src/testdata/GridRow.svelte'),
			resolveToPosix('./src/testdata/NotSvelteFile.txt'),
			resolveToPosix('./src/testdata/subdir/GridCellBorder.svelte'),
			resolveToPosix('./src/testdata/subdir/GridCellContent.svelte'),
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
			resolveToPosix('./src/lib/LibAlpha.svelte'),
			resolveToPosix('./src/lib/LibBeta.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./../lib/LibAlpha.svelte',
			'./../lib/LibBeta.svelte',
		])
	})

	test('Auto import from root', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: './src/lib', //
			isLib: false,
			isRoot: true,
			isGlob: false,
		})

		const absFilePaths = components.map((c) => c.absPath)
		unorderedEquals(absFilePaths, [
			resolveToPosix('./src/lib/LibAlpha.svelte'),
			resolveToPosix('./src/lib/LibBeta.svelte'),
		])

		const relFilePaths = components.map((c) => c.relPath)
		unorderedEquals(relFilePaths, [
			'./../lib/LibAlpha.svelte',
			'./../lib/LibBeta.svelte',
		])
	})
})
