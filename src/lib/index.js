import path from 'path'
import fs from 'fs'

import identifyUsedComponents from './identifyUsedComponents.js'
import listImportableFiles from './listImportableFiles.js'

const POSIX = path.posix

export default function () {
	// This object is populated by the markup preprocesssor
	// then used by the script preprocessor.
	const usedComponentNameLists = {
		// [filename]: [...componentNames],
	}

	return {
		name: 'Auto Import',
		markup: ({ content, filename }) => {
			const srcFile = POSIX.resolve(filename)
			const tags = identifyUsedComponents(content)

			// Add to data object for use in the script function.
			usedComponentNameLists[srcFile] = tags
		},
		script: ({ content, filename }) => {
			const srcFile = POSIX.resolve(filename)

			const usedComponentNames = usedComponentNameLists[srcFile]
			delete usedComponentNameLists[srcFile]

			const autoImportPaths = parseAutoImportPaths(script)

			const importStatements = generateImportStatements(
				srcFile, //
				autoImportPaths
			)

			if (importStatements) {
				return {
					code: importStatements + '\n' + content,
				}
			}
		},
	}
}

function parseAutoImportPaths(script) {
	// STEP: Identify each statement in the script.
	// STEP: Extract path from each statement.
	// STEP: Tidy each path.
	return []
}

function generateImportStatements(srcFile, autoImportPaths) {
	return (
		listImportableFiles(srcFile, autoImportPaths)
			// Must be a Svelte file.
			.filter((fi) => fi.extension === 'svelte')

			// Exclude the file being preprocessed.
			.filter((fi) => fi.absPath !== POSIX.resolve(srcFile))

			// Must be a properly named Svelte component.
			.filter((fi) => /^[A-Z][A-Za-z0-9_]*$/.test(fi.name))

			// Exclude those not used in the markup.
			.filter((fi) => usedComponentNames.includes(fi.name))

			// We just need the import statement.
			.map((c) => c.importStatement)

			// Join all statements into a multiline code chunk.
			.join(';\n') + ';\n'
	)
}
