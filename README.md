# lm-editor: Lit-based Monaco Editor

To set things straight, it's a monaco editor crafted using web component technology. Currently, it's being tailored to fit like a glove in native web environments using RubyOnRails and Alpinejs. While it might not be the flashiest kid on the block (aka "currently not feature-rich"), your interest, love, and especially those dollar bills will shape its future.

## Features

- Built on Monaco 0.41.0
- Utilizes lit for creating a custom element
- Supports Emmet for HTML language
- Toggleable footer display with `disabled-footer` attribute
- Customizable footer through a designated slot


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

## Disabled-Footer

The `disabled-footer` attribute allows you to control the visibility of the editor's footer information. When included, the footer information will not be displayed.

```html
<lm-editor disabled-footer></lm-editor>
```

Any value assigned to `disabled-footer` will result in the footer information being hidden, with the exception of the value "false". When set to "false", the `disabled-footer` attribute is treated as if it wasn’t included.

```html
<lm-editor disabled-footer="false"></lm-editor>
```

## Footer Slot

You can define a custom footer by utilizing the `footer` slot. This allows for user-defined content and actions in the footer area of the editor.

```html
<lm-editor>
  <div slot="footer" style="width:160px;">
      <div>Your custom action</div>
      <button onclick="footerButtonClick()">Save</button>
   </div>
</lm-editor>
```

In the example above, a custom footer is created with a div element for displaying text and a button for executing a save action through an `onclick` event.

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
