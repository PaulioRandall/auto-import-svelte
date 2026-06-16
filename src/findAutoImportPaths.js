export default function (lines) {
	const results = []

	for (let i = 0; i < lines.length; i++) {
		const path = findAutoImportPathInLine(lines[i])

		if (path) {
			results.push({
				lineIndex: i,
				path,
			})
		}
	}

	return results
}

function findAutoImportPathInLine(line) {
	const regex =
		/[\r\t\f\v ]*\$autoImport\(["'`](?<path>.*?)["'`]\);?[\r\t\f\v ]*?/g
	const m = regex.exec(line)
	return m ? m.groups.path : ''
}
