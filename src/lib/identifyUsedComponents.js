import { parse } from 'node-html-parser'

export default function (html) {
	const root = parse(html)
	const resultSet = new Set()

	listUsedHtmlTags(resultSet, root.childNodes)

	const resultList = [...resultSet]
	return resultList.filter(startsWithCapitalLetter)
}

function listUsedHtmlTags(resultSet, children) {
	for (const child of children) {
		if (child.rawTagName) {
			resultSet.add(child.rawTagName)
		}

		if (child.childNodes && child.childNodes.length) {
			listUsedHtmlTags(resultSet, child.childNodes)
		}
	}
}

function startsWithCapitalLetter(s) {
	const code = s.charCodeAt(0)
	return code >= 65 && code <= 90
}
