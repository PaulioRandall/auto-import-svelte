# Auto-Import Svelte Components

Simple Svelte preprocessor for auto importing sets of
components.

This library is a scaffolding tool to minimise boiler plate as a source of programming friction during development. `$autoImport` statements can be replaced with explicit imports towards the end of development.

```svelte
<script>
	// Specific directory import.
	$autoImportDir('.')

	// Glob import.
	$autoImportGlob('../shared/**/*')

	// Auto imports support SvelteKit `$lib` alias.
	$autoImportDir('$lib/charts')

	// Auto imports support `$root` alias.
	$autoImportDir('$root/src')
</script>
```

Very simple and lazy implementation:

- It will only import components used within the HTML section of Svelte components, i.e. not those created dynamically.
- It won't check if a component is already imported, thus, will cause a compile error if imported manually.
- It doesn't work for library imports or absolute paths, relatively referenceable components only.
- Auto import statements must be on a single line and the path must be a single or double quoted string literal.

## Good Usage

**package.json**

```json
"devDependencies": {
	"@paulio/auto-import-svelte": "0.1.1"
}
```

**svelte.config.js**

```svelte
<script>
	// svelte.config.js
	import autoImportSvelte from 'auto-import-svelte'

	export default {
		preprocess: [autoImportSvelte()],
	}
</script>
```

**Component.svelte**

Auto import paths may be relative to either:

- `./`, `../blah`, etc: The importing component's parent directory.
- `$lib/`: referencing `./src/lib` (SvelteKit).
- `$root/`: referencing the project's root directory.

```svelte
<script>
	// Import all used components from this component's
	// parent directory.
	$autoImportDir('.')

	// From a sub directory.
	$autoImportDir('./sub-folder')

	// From a sibling directory.
	$autoImportDir('../sibling-directory')

	// From `{root}/src/lib/components`.
	$autoImportDir("$lib/components")

	// From `{root}/pkg`.
	$autoImportDir("$root/pkg")

	// Import all used components from `{root}/src/lib` and
	// its sub directories.
	//
	// See https://www.npmjs.com/package/glob for more info.
	$autoImportGlob("$lib/**/*")
</script>
```

## Bad Usage

```svelte
<script>
	// Manual imports must be removed or face a conflicting
	// import error.
	import Component from './Component.svelte'
	$autoImportDir('.')

	// Not allowed library imports.
	$autoImportDir('flowbite-svelte')

	// Not allowed absolute path.
	$autoImportDir('/absolute/path/to/dir')

	// Multiline auto imports not allowed.
	$autoImportDir(
		'.',
	)
</script>
```

> Sorry, just CBA to do proper parsing for this project. However, the limitations haven't been an issue given my development style.
