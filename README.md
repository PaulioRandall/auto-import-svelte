# Svelte Auto-Import

```svelte
<script>
	// Specific directory import.
	$autoImportDir('.')

	// Glob import.
	$autoImportGlob('../shared/**/*')
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

> I may create a more robust implementation if I ever get bored.

## Good Usage

**package.json**

```js
"devDependencies": {
	"@PaulioRandall/svelte-auto-import": "x.y.z"
}
```

**svelte.config.js**

```svelte
// svelte.config.js
import svelteAutoImport from 'svelte-auto-import'

export default {
	preprocess: [svelteAutoImport()],
}
```

**Parent Component**

Auto import paths are be relative to the components parent directory:

```svelte
<script>
	// Will import SameDirectoryComponent.
	$autoImportDir('.')

	// Will import SubDirectoryComponent.
	$autoImportDir('./sub-directory')

	// Will import SiblingDirectoryComponent.
	$autoImportDir('../sibling-directory')

	// Will import both SameDirectoryComponent and
	// SubDirectoryComponent.
	//
	// See https://www.npmjs.com/package/glob for more info.
	$autoImportGlob("./**/*")
</script>

<SameDirectoryComponent />
<SubDirectoryComponent />
<SiblingDirectoryComponent />
```

## Bad Usage

Existing imports for auto import paths must be removed
or you'll get a naming conflict on compile:

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

The whole statement must be on a single line, never
multiline:

```svelte
<script>
	$autoImportDir(
		'.',
	)
</script>
```
