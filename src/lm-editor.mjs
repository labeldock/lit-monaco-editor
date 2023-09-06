import { LitElement, css, html } from 'lit'
import { createRef } from 'lit/directives/ref.js'

import * as monaco from "monaco-editor";
import styles from "monaco-editor/min/vs/editor/editor.main.css?inline";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

console.log('self', self)

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export class LitMonacoEditor extends LitElement {
  
  containerRef = createRef()

  static get properties() {
    return {
      theme: { type: String },
      language: { type: String },
      src: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        --lit-editor-width: 100%;
        --lit-editor-height: 100vh;
      }
      .lit-monaco-editor-main {
        width: var(--lit-editor-width);
        height: var(--lit-editor-height);
      }
    `
  }

  constructor() {
    super()
  }

  render() {
    return html`
      <div class="lit-monaco-editor-main" ref=${this.containerRef}>Ready lm editor</div>
    `
  }
}

window.customElements.define('lm-editor', LitMonacoEditor)
