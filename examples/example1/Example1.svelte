<script>
	$autoImport('.')

	function randomiseBgColor() {
		const rgbStr = generateRandomRgbString()
		document.body.style.background = rgbStr
	}

	function generateRandomRgbString(r, g, b) {
		const r = random255()
		const g = random255()
		const b = random255()
		return `rgb(${r}, ${g}, ${b})`
	}

	function random255() {
		let n = Math.random()
		n *= 255.0
		return Math.floor(n)
	}
</script>

<Buttton onclick={randomiseBgColor}>Press Me!</Buttton>
