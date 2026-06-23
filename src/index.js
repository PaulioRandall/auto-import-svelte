import path from 'path'
import fs from 'fs'

import PusedoPosixPath from './PusedoPosixPath.js'
import identifyUsedComponents from './identifyUsedComponents.js'
import listImportableFiles from './listImportableFiles.js'
import findAutoImportPaths from './findAutoImportPaths.js'

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
			const srcFile = PusedoPosixPath.resolve(filename)
			componentLists[srcFile.path] = identifyUsedComponents(content)
		},

		// Second, we must find the $autoImport statements
		// within the JS and replace them with real import
		// statements for those used components.
		script: ({ content, filename }) => {
			const srcFile = PusedoPosixPath.resolve(filename)
			const components = componentLists[srcFile.path]

			// Clean up, no need to keep the entry.
			delete componentLists[srcFile.path]

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

	for (const ai of autoImports) {
		// Identify importable componenets from path.
		const importables = listImportableComponents(
			srcFile, //
			ai,
			components
		)

		// Generate import statements for components.
		// Initial space indent for easse of reading when
		// debugging.
		const statements = importables.map((im) => '  ' + im.importStatement)

		// Replace whole $autoImport line with import
		// statements.
		lines.splice(ai.lineIndex, 1, ...statements)
	}

	return lines.join('\n')
}

function listImportableComponents(srcFile, autoImportPath, components) {
	return (
		listImportableFiles(srcFile, autoImportPath)
			// Must be a Svelte file.
			.filter((f) => f.extension === 'svelte')

			// Must be a properly named Svelte component.
			.filter((f) => /^[A-Z][A-Za-z0-9_]*$/.test(f.name))

			// Exclude those not used in the markup.
			.filter((f) => components.includes(f.name))
	)
}
