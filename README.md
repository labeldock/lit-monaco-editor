# lm-editor (lit-monaco-editor)
Monaco Editor usable in plain HTML. It is currently in alpha version.

As a product, it is not enough. It might be helpful if you just reference it to produce a better monaco editor.

## Feature
- Monaco 0.41.0
- lit based custom element
- Supports emmet. In case of html lang
  
## Build

```bash
npm install
npm run build
```
After running the command there are chunks in dist directory

## Installation

## Start

```html
<html>
<head>
    <script type="module">
      import "/lm-editor/index.js"
    </script>
</head>
<body>
    <div style="">
      <lm-editor></lm-editor>
    </div>
</body>
</html>
```

## Options

```html
<lm-editor src="./template/index.html" lang="html"></lm-editor>
<lm-editor src="./template/index.js" lang="javascript"></lm-editor>
<lm-editor src="./template/index.css" lang="css"></lm-editor>
<lm-editor src="./template/index.json" lang="json"></lm-editor>
<lm-editor src="./template/index.yml" lang="yml"></lm-editor>
<lm-editor value="<div>Hello</div>" lang="html"></lm-editor>
```

```html
<lm-editor id="editor" value="" lang="html"></lm-editor>
<script>
const editor = document.querySelector("editor")

// get value
const editorContentValue = editor.getModelValue()

// set value
editor.setModelValue("<div>Example</div>")

// event
editor.addEventListener("update", (event)=>{})
editor.addEventListener("change", (event)=>{})
</script>
```

## next
- readOnly
