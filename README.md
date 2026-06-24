# Auto-Import Svelte Components

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

Simple Svelte preprocessor for auto importing sets of
components. Inspired by languages such as [Go](https://go.dev/) where packaged scoped values are referencable across files without importing. I've expanded to allow importing of Svelte components from specific folders and via Glob.

This library is a scaffolding tool to minimise boiler plate as a source of programming friction during development activities. `$autoImport` statements can be replaced with explicit imports towards the end of development.

Very simple and lazy implementation:

- It will only import components used within the HTML section of the Svelte component; it won't import dynamically instantiated components.
- It won't check if a component is already imported.
- It doesn't work for library imports or absolute paths.
- Auto import statements must be on a single line and the path must be a single or double quoted string literal.

## Good Usage

**package.json**

```js
"devDependencies": {
	"@paulio/auto-import-svelte": "0.1.0"
}
```

**svelte.config.js**

```svelte
// svelte.config.js
import autoImportSvelte from 'auto-import-svelte'

export default {
	preprocess: [autoImportSvelte()],
}
```

**Parent Component**

Auto import paths are relative to the components parent directory, `$lib` (`./src/lib`), or `$root` (project root):

```svelte
<script>
	// Will import SameDirectoryComponent.
	$autoImportDir('.')

	// Will import SubDirectoryComponent.
	$autoImportDir('./sub-directory')

	// Will import SiblingDirectoryComponent.
	$autoImportDir('../sibling-directory')

	// Will import components from `{project-root}/src/shared`.
	$autoImportDir("$root/src/shared")

	// Will import all components from `$lib`.
	//
	// See https://www.npmjs.com/package/glob for more info.
	$autoImportGlob("$lib/**/*")
</script>

<SameDirectoryComponent />
<SubDirectoryComponent />
<SiblingDirectoryComponent />
<LibSubDirectoryComponent />
```

## Bad Usage

Existing imports for auto import paths must be removed
or face a naming conflict on compile:

```svelte
<script>
	import Component from './Component'

	// Will create a duplicate and conflicting import for
	// Component.
	$autoImportDir('.')
</script>
```

It doesn't work for library imports or absolute paths, so
you can't do this:

```svelte
<script>
	// Library import.
	$autoImportDir('flowbite-svelte')

	// Absolute path.
	$autoImportDir('/absolute/path/to/dir')
</script>
```

The whole auto import statement must be on a single line, never
multiline:

```svelte
<script>
	$autoImportDir(
		'.',
	)
</script>
```
