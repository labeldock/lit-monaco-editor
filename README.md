# lm-editor: Lit-based Monaco Editor

The lm-editor is a `lit component based monaco editor`. Wait, what? Oopsie daisy... I mean, it's a `monaco editor based lit component`. Ugh, it's like mixing up your coffee with your tea!

## The Real Deal
To set things straight, it's a monaco editor crafted using web component technology. Currently, it's being tailored to fit like a glove in native web environments using RubyOnRails and Alpinejs. While it might not be the flashiest kid on the block (aka "currently not feature-rich"), your interest, love, and especially those dollar bills will shape its future.

## Features

- Built on Monaco 0.41.0
- Utilizes lit for creating a custom element
- Supports Emmet for HTML language

## Build Instructions

To build the project, run the following commands:

```bash
npm install
npm run build
```

After successful execution, you will find the output files in the `dist` directory.

## Installation and Usage

### Installation

(TODO)

### Basic Start

Add the following HTML to include the `lm-editor` in your project:

```html
<html>
<head>
    <script type="module">
      import "/lm-editor/index.js"
    </script>
</head>
<body>
    <div>
      <lm-editor></lm-editor>
    </div>
</body>
</html>
```

### Options

You can specify the source file and language using the `src` and `lang` attributes, respectively:

```html
<lm-editor src="./template/index.html" lang="html"></lm-editor>
<lm-editor src="./template/index.js" lang="javascript"></lm-editor>
<lm-editor src="./template/index.css" lang="css"></lm-editor>
<lm-editor src="./template/index.json" lang="json"></lm-editor>
<lm-editor src="./template/index.yml" lang="yml"></lm-editor>
```

Or set an initial value and language directly:

```html
<lm-editor value="<div>Hello</div>" lang="html"></lm-editor>
```

change readonly reactively:

```html
<!-- readonly -->
<lm-editor readonly></lm-editor>
<lm-editor readonly=""></lm-editor>
<lm-editor readonly="true"></lm-editor>

<!-- editable -->
<lm-editor></lm-editor>
<lm-editor readonly="false"></lm-editor>
```

### Programmatic Access

To interact with the editor programmatically, you can do the following:

```html
<lm-editor id="editor" value="" lang="html"></lm-editor>
<script>
const editor = document.querySelector("#editor");

// Get the current value of the editor
const editorContentValue = editor.getModelValue();

// Set a new value to the editor
editor.setModelValue("<div>Example</div>");

// Listen to editor events
editor.addEventListener("update", (event) => {});
editor.addEventListener("change", (event) => {});
editor.addEventListener("save", (event) => {}); // ctrl + s || cmd + s
editor.addEventListener("explorer", (event) => {}); // ctrl + p || cmd + p
</script>
```
