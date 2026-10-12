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
	import { Plus } from '@lucide/svelte';
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

The library ships no icons and works with any icon library. Every `icon` prop takes a Svelte component, so use [Lucide](https://lucide.dev), [Phosphor](https://phosphoricons.com), your own SVG components or anything else:

```svelte
<script>
	import { Button } from '@noahbaumgartner/svelte-ui';
	import Plus from '@lucide/svelte/icons/plus';
</script>

<Button icon={Plus}>New project</Button>
```

An icon component receives `class` and `aria-hidden` and is sized with CSS, so it should render a single `<svg>` that fills its box. The `IconComponent` type describes what the props accept.

### Theming

All colours are derived from two variables, `--ui-base` and `--ui-ink`, mixed into a grey scale. Light and dark mode follow `prefers-color-scheme` by default; force one with a `data-theme` attribute on `<html>`:

```html
<html data-theme="dark"></html>
```

Set `--ui-accent` to colour checked controls, primary buttons and focus rings. It defaults to `--ui-ink`, and the foreground colour on top of it is picked automatically for contrast:

```css
:root {
	--ui-accent: #2563eb;
}
```

See [`src/lib/styles/tokens.css`](src/lib/styles/tokens.css) for every token.

## Components

| Category   | Components                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Actions    | `Button`, `ButtonGroup`, `Toggle`, `Link`                                                                                                  |
| Forms      | `Input`, `InputGroup`, `Textarea`, `Select`, `NumberStepper`, `Checkbox`, `RadioGroup`, `Switch`, `Label`, `Field` family                  |
| Pickers    | `Calendar`, `TimePicker`, `ColorPicker`                                                                                                    |
| Overlays   | `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `ContextMenu`, `Toaster` + `toast()`                                              |
| Navigation | `Navbar`, `NavigationMenu`, `Sidebar` family, `Breadcrumb`, `Tabs`                                                                         |
| Display    | `Card` family, `Table`, `Accordion`, `Avatar`, `AvatarGroup`, `Badge`, `EmptyState`, `Kbd`, `Progress`, `Separator`, `Skeleton`, `Spinner` |

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

## License

[MIT](LICENSE)
