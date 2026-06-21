import path from 'path'
import PusedoPosixPath from './PusedoPosixPath.js'
import listImportableFiles from './listImportableFiles.js'

function unorderedEquals(act, exp) {
	expect(act).toEqual(expect.arrayContaining(exp))
}

describe('listImportableFiles.js', () => {
	test('Auto import same directory', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: '.', //
			isLib: () => false,
			isRoot: () => false,
			isGlob: () => false,
		})

		const paths = components.map((c) => c.path)
		unorderedEquals(paths, [
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
			isLib: () => false,
			isRoot: () => false,
			isGlob: () => false,
		})

		const paths = components.map((c) => c.path)
		unorderedEquals(paths, [
			'./subdir/GridCellBorder.svelte',
			'./subdir/GridCellContent.svelte',
		])
	})

	test('Auto import from another directory (glob)', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: './**/*', //
			isLib: () => false,
			isRoot: () => false,
			isGlob: () => true,
		})

		const paths = components.map((c) => c.path)
		unorderedEquals(paths, [
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
			isLib: () => true,
			isRoot: () => false,
			isGlob: () => false,
		})

		const paths = components.map((c) => c.path)
		unorderedEquals(paths, ['../lib/LibAlpha.svelte', '../lib/LibBeta.svelte'])
	})

	test('Auto import from root', () => {
		const srcFile = './src/testdata/Grid.svelte'
		const components = listImportableFiles(srcFile, {
			path: './src/lib', //
			isLib: () => false,
			isRoot: () => true,
			isGlob: () => false,
		})

		const paths = components.map((c) => c.path)
		unorderedEquals(paths, ['../lib/LibAlpha.svelte', '../lib/LibBeta.svelte'])
	})
})
