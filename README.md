# svelte-ui

A minimal, monochrome component library for Svelte 5, built with runes, TypeScript and plain CSS custom properties.

```sh
npm install @noahbaumgartner/svelte-ui
```

## Usage

Import the design tokens once, at the root of your app (e.g. `src/routes/+layout.svelte`):

```svelte
<script lang="ts">
	import '@noahbaumgartner/svelte-ui/tokens.css';

	let { children } = $props();
</script>

{@render children()}
```

Then use the components:

```svelte
<script lang="ts">
	import { Button, Card, CardHeader, CardTitle, CardContent } from '@noahbaumgartner/svelte-ui';
	import { Plus } from '@noahbaumgartner/svelte-ui/icons';
</script>

<Card>
	<CardHeader>
		<CardTitle>Projects</CardTitle>
	</CardHeader>
	<CardContent>
		<Button icon={Plus} variant="primary">New project</Button>
	</CardContent>
</Card>
```

### Icons

[Lucide](https://lucide.dev) icons are re-exported from `@noahbaumgartner/svelte-ui/icons`, so you don't need a separate `@lucide/svelte` install. They live on their own entry point because some icon names (`Link`, `Image`, …) collide with component names.

### Theming

All colours are derived from two variables, `--base` and `--ink`, mixed into a grey scale. Light and dark mode follow `prefers-color-scheme` by default; force one with a `data-theme` attribute on `<html>`:

```html
<html data-theme="dark"></html>
```

Set `--accent` to colour checked controls, primary buttons and focus rings. It defaults to `--ink`, and the foreground colour on top of it is picked automatically for contrast:

```css
:root {
	--accent: #2563eb;
}
```

See [`src/lib/styles/tokens.css`](src/lib/styles/tokens.css) for every token.

## Components

| Category   | Components                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Actions    | `Button`, `ButtonGroup`, `Toggle`, `Link`                                                      |
| Forms      | `Input`, `InputGroup`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Label`, `Field` family |
| Pickers    | `Calendar`, `TimePicker`, `ColorPicker`                                                        |
| Overlays   | `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `ContextMenu`, `Toaster` + `toast()`            |
| Navigation | `Navbar`, `NavigationMenu`, `Sidebar` family, `Breadcrumb`                                     |
| Display    | `Card` family, `Table`, `Avatar`, `Badge`, `Kbd`, `Separator`, `Skeleton`, `Spinner`           |

Every component is documented in Storybook, with one story per prop.

## Development

```sh
npm install
npm run storybook   # component workbench on http://localhost:6006
```

| Script              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run storybook` | Start Storybook                                  |
| `npm run check`     | Type-check with `svelte-check`                   |
| `npm run test`      | Run unit and Storybook tests with Vitest         |
| `npm run lint`      | Check formatting (Prettier) and lint (ESLint)    |
| `npm run format`    | Format all files                                 |
| `npm run build`     | Build the package into `dist/` and run `publint` |

Components live in `src/lib/components/<name>/`, each next to its `.stories.svelte` file, and are exported from [`src/lib/index.ts`](src/lib/index.ts).

## Releasing

Publishing a GitHub release triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which sets the package version from the release tag (e.g. `v0.2.0` → `0.2.0`), type-checks, and stages the publish on npm with provenance. The staged version then has to be approved with 2FA (`npm stage approve <stage-id>` or on npmjs.com).
