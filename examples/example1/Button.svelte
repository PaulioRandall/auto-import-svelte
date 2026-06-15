<script>
	let { children, ...rest }
</script>

<button {...rest}>
	{@render children?.()}
</button>

<style>
	button {
		border-radius: 4px;
		color: white;

		background: #282828;

		&:hover {
			background: #404040;
			text-shadow: 0 0 1px white;
		}

		&:active {
			background: #666666;
			text-shadow: 0 0 1px black;
		}
	}
</style>
