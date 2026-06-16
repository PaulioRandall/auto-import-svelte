# Svelte Auto-Import

Simple Svelte preprocessor for auto importing sets of
components. Inspired by The Go Programming Language package rules and intended for rapid prototyping, not so much for
production quality systems.

Very simple implementation:

- It won't check if a component is already imported.
- It doesn't work for library imports or absolute paths.
- `$autoImport(...)` can't have multiline arguments.

**package.json**

```js
"devDependencies": {
	"@PaulioRandall/svelte-auto-import": "x.y.z"
}
```

## Good Usage

**svelte.config.js**

```svelte
// svelte.config.js
import svelteAutoImport from 'svelte-auto-import'

export default {
	preprocess: [svelteAutoImport()],
}
```

**Parent Component**

Specify the auto import path with `$autoImport(...)` where `...` is the relative path to the directory containing components you want auto imported:

```svelte
<script>
	// Will import SameDirectoryComponent.
	$autoImport('.')

	// Will import SubDirectoryComponent.
	$autoImport('./sub-directory')

	// Will import SiblingDirectoryComponent.
	$autoImport('../sibling-directory')
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
	$autoImport('.')
</script>

<Component />
```

It doesn't work for library imports or absolute paths, so
you can't do this:

```svelte
<script>
	// Library import.
	$autoImport('flowbite-svelte')

	// Absolute path.
	$autoImport('/absolute/path/to/dir')
</script>

<Alert>Flowbite alert message.</Alert>
<AbsolutelyImportedComponent />
```

The whole statement must be on a single line, never
multiline:

```svelte
<script>
	$autoImport(
		'.',
	)
</script>

<YourAutoImportedComponent />
```
