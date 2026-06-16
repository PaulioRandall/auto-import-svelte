import { parse } from 'node-html-parser'

export default function (html) {
	const root = parse(html)

	// Using Set to avoid duplicates.
	const resultSet = new Set()
	populateWithHtmlTags(resultSet, root.childNodes)

	// But we actually want a list because they're easier to
	// manipulate.
	const resultList = [...resultSet]

	// Remove standard HTML tags which are all lowercase.
	// Component tags must always start with an uppercase.
	return resultList.filter(startsWithUppercase)
}

// Recursively walk through element tree adding each tag
// to the result set along the way.
function populateWithHtmlTags(resultSet, children) {
	for (const child of children) {
		if (child.rawTagName) {
			resultSet.add(child.rawTagName)
		}

		if (child.childNodes && child.childNodes.length) {
			populateWithHtmlTags(resultSet, child.childNodes)
		}
	}
}

function startsWithUppercase(s) {
	const code = s.charCodeAt(0)
	return code >= 65 && code <= 90
}
