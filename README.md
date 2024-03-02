# my-file-client

Install all packages:

```
npm install
```

Start the project:

```
npm run dev
```

## Vitest

### Documentation

https://vitest.dev/guide/

### Commands to run tests

```
npm run test:vitest
```

## Playwright

### Documentation

https://playwright.dev/docs/intro

### Commands to run tests

Runs the end-to-end tests.

```
npx playwright test
```

Starts the interactive UI mode.

```
npx playwright test --ui
```

Runs the tests only on Desktop Chrome.

```
npx playwright test --project=chromium
```

Runs the tests in a specific file.

```
npx playwright test example
```

Runs the tests in debug mode.

```
npx playwright test --debug
```

Auto generate tests with Codegen.

```
 npx playwright codegen
```

We suggest that you begin by typing:

```
npx playwright test
```

## Packages we use

### [Tailwind](https://tailwindcss.com)

In general, we use [Tailwind classes](https://tailwind.build/classes) for any styling.

- Color palette & other config is in `tailwind.config.js`
- MyFile is mobile-first, so our breakpoints stack from the bottom up
  - E.g. `className="hidden md:block"` will be hidden on mobile, visible on tablet and above

#

### [MUI](https://mui.com/material-ui/getting-started/)

General-purpose material UI components.

#### Styling

- We use Tailwind class names for all style overrides
  - Sometimes, it's necessary to add an important rule (e.g. `"!block"`)
- MUI also supports inline CSS using the [sx](https://mui.com/system/getting-started/the-sx-prop/) prop
  - e.g. `sx={{ cssproperty: { breakpoint: value } }}`

#### Data tables (document list in client view)

- [MUI DataGrid](https://mui.com/x/react-data-grid/) supports sorting, row selection, & pagination
- For customization, update `MUITheme.tsx` using [these class names](https://mui.com/x/api/data-grid/data-grid/#css)

#

### [MUI-Datatables](https://github.com/gregnb/mui-datatables)

We use this for the main agent view, since it has more features than MUI DataGrid (but is more difficult to style).

- Supports expandable rows
- Comes with row search, column filtering, and CSV export

#

### [react-pdf](https://www.npmjs.com/package/react-pdf)

A simple open-source PDF viewer that appears to work cross-browser 🎉 (we tested it on iOS and Android).

Our wrapper is `PDFReader.tsx`.

#### Usage

- Load the PDF using `<Document file={base64 or URL}>`.
- Render the pages inside using `<Page number={...}>`.
  - For pagination, simply render one `<Page>` and set the `number` prop to the state of a pagination component.
  - For scrolling, render every `<Page>` in a loop and wrap in a container with a fixed height and `overflow-y: scroll`.

#

### [Zustand](https://github.com/pmndrs/zustand)

We are using a single Zustand store, split up into modules using [slices](https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md).

The state properties and methods (setters/transformers) are defined together in each slice.

#### Using the store

- Inside a component:
  - `const { propertyOrMethodName } = useBoundStore();`
- Elsewhere (e.g. inside a service):
  - `const { propertyOrMethodName } = useBoundStore.getState();`

You can access the properties/setters of all slices from useBoundStore.

#### Adding store modules

1. Create the slice:

```ts
export interface ExampleSlice {
  something: number
  setSomething: (something: number) => void
  getSomethingPlus: (b: number) => number
}

export const createExampleSlice: StateCreator<
  StoreTypeIntersection,
  [],
  [],
  ExampleSlice
> = (set, get) => ({
  something: 0, // Initial value
  setSomething: (something) => set({ something }),
  getSomethingPlus: (b) => get().something + b,
})
```

2. Add it to the store:

- Add `ExampleSlice` to the `StoreTypeIntersection` type.
- Add `...createExampleSlice()` to the store's `create` function.
