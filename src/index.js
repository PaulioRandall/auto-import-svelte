import path from 'path'
import fs from 'fs'

import identifyUsedComponents from './identifyUsedComponents.js'
import listImportableFiles from './listImportableFiles.js'
import findAutoImportPaths from './findAutoImportPaths.js'

const POSIX = path.posix

export default function () {
	// This object is populated by the markup preprocesssor
	// then used by the script preprocessor.
	const componentLists = {
		// [filename]: [...componentNames],
	}

	return {
		name: 'Auto Import',

		// First, we must find and store the components actually
		// used in the HTML.
		markup: ({ content, filename }) => {
			const srcFile = POSIX.resolve(filename)
			componentLists[srcFile] = identifyUsedComponents(content)
		},

		// Second, we must find the $autoImport statements
		// within the JS and replace them with real import
		// statements for those used components.
		script: ({ content, filename }) => {
			const srcFile = POSIX.resolve(filename)
			const components = componentLists[srcFile]

			// Clean up, no need to keep the entry.
			delete componentLists[srcFile]

			content = parseAndReplace(
				srcFile, //
				content,
				components
			)

			return { code: content }
		},
	}
}

function parseAndReplace(srcFile, src, components) {
	const lines = src.split('\n')
	const autoImports = findAutoImportPaths(lines)

	// Start from the back so lines indexes stay aligned,
	// i.e. so changes to the back of the line list won't
	// affect line indexes before them.
	autoImports.reverse()

	for (const { lineIndex, path } of autoImports) {
		// Identify importable componenets from path.
		importables = listImportableComponents(srcFile, path, components)

		// Generate import statements for components.
		// Initial space indent for easse of reading when
		// debugging.
		statements = importables.map((im) => '  ' + im.importStatement)

		// Replace whole $autoImport line with import
		// statements.
		lines.splice(lineIndex, 1, ...statements)
	}

	return lines.join('\n')
}

function listImportableComponents(srcFile, autoImportPath, components) {
	return (
		listImportableFiles(srcFile, autoImportPath)
			// Must be a Svelte file.
			.filter((fi) => fi.extension === 'svelte')

			// Exclude the file being preprocessed.
			.filter((fi) => fi.absPath !== POSIX.resolve(srcFile))

			// Must be a properly named Svelte component.
			.filter((fi) => /^[A-Z][A-Za-z0-9_]*$/.test(fi.name))

			// Exclude those not used in the markup.
			.filter((fi) => components.includes(fi.name))
	)
}
