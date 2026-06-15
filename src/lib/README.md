# Auto Import Svelte

Svelte preprocessor that auto imports components.

- Only components that have been used within the HTML will be auto imported, i.e. will not auto import components instantiated in JavaScript.
- Does not check to see if component is already imported.
- By default, used components are auto imported from the Svelte file's folder and `./src/lib`, excludes sub-folders.
- Users may change the generic auto-import folders by passing an array of absolute and relative paths. Relative paths will be relative to the file being preprocessed.
- (Proposed) Allow Glob paths.
- (Proposed) Allow user to define which folders a specific Svelte file auto imports from.

## Quick Start

```js
// svelte.config.js
import autoImport from './src/pre/auto-import/preprocessor.js'

export default {
	// ...
	preprocess: [autoImport()],
	// ...
}
```

## Options

Relative paths are relative to the Svelte file being preprocessed. Use `path.resolve` to create absolute paths.

```js
// svelte.config.js
import autoImport from './src/pre/auto-import/preprocessor.js'
import path from 'path'

export default {
	// ...

	preprocess: [
		autoImport({
			dirs: [
				'.', // Same folder as the file being preprocessed.
				path.resolve('./src/lib'), // Same as '$lib'
			],
		}),
	],

	// ...
}
```

## (Proposed) Specific File Auto Import

You can import from a specific Svelte component.

```svelte
<script>
	$autoImport('./sub/dir')
	$autoImport('../../relative/to/dir')
	$autoImport('/absolute/path/to/dir')

	$autoRootImport('./relative/to/root')
	$autoRootImport('./src/lib')
</script>

<SubDirComponent />
<RelativeToDirComponent />
<AbsoluteDirComponent />

<RelativeToRootComponent />
<ComponentWithinLib />
```
