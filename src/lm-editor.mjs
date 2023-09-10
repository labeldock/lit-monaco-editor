import { LitElement, css, html } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'

import * as monaco from "monaco-editor";
import styles from "monaco-editor/min/vs/editor/editor.main.css?inline";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
// import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import { emmetHTML } from 'emmet-monaco-es'
const dispose = emmetHTML(monaco, ['html', 'php', 'erb', 'vue'])

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    // if (label === "typescript" || label === "javascript") {
    //   return new tsWorker();
    // }
    return new editorWorker();
  },
};

export class LitMonacoEditor extends LitElement {
  containerRef = createRef()
  editor = null
  
  static get properties() {
    return {
      theme: { type: String },
      lang: { type: String },
      src: { type: String },
      value: { type: String },
      readonly: { type: String },
    }
  }

  constructor() {
    super()
    this.theme = null
    this.lang = null
    this.src = null
    this.value = null
    this.readonly = null
  }

  static get styles() {
    return css`
      :host {
        --lit-editor-width: 100%;
        --lit-editor-height: 100%;
        --lit-editor-footer-size: 24px;
        position: relative;
      }
      .lm-editor-main {
        width: var(--lit-editor-width);
        height: calc(var(--lit-editor-height) - var(--lit-editor-footer-size));
        min-height: 120px;
      }
      .lm-editor-footer {
        position: absolute;
        bottom: calc( -1 * var(--lit-editor-footer-size));
        font-size:14px;
        line-height: var(--lit-editor-footer-size);
        left: 0;
        width: var(--lit-editor-width);
        height: var(--lit-editor-footer-size);
      }
    `
  }

  connectedCallback() {
    this.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveEvent = new Event('save');
        this.dispatchEvent(saveEvent);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        const saveEvent = new Event('explorer');
        this.dispatchEvent(saveEvent);
      }
      
    });
    super.connectedCallback()
  }


  getChildrenContents() {
    if (this.children.length > 0) return this.children[0];
    return null;
  }
  
  getCode() {
    if (this.code) return this.code;
    const innerElement = this.getChildrenContents();
    if (!innerElement) return;
    return innerElement.innerHTML.trim();
  }
  
  get computedLanguage() {
    if (this.lang) return this.lang;
    const innerElement = this.getChildrenContents();
    if (!innerElement) return;
    const type = innerElement.getAttribute("type");
    return type.split("/").pop();
  }
  
  get computedTheme() {
    if (this.theme) return this.theme;
    if (this.isDarkScheme) return "vs-dark";
    return "vs-light";
  }

  get isDarkScheme() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  async #inheritModelValue() {
    if(this.src){
      const response = await fetch(this.src)
      const textContent = await response.text()
      return textContent
    }
    if(this.value){
      return this.value
    }
  }

  setModelValue (value){
    this.editor.setValue(value)
  }
  
  getModelValue (){
    return this.editor.getValue()
  }

  updateModelValue (value){
    this.setModelValue(value)
    const updateEvent = new Event('update', { bubbles: true, composed: true });
    this.dispatchEvent(updateEvent);
  }

  async firstUpdated() {
    this.editor = monaco.editor.create(this.containerRef.value, {
      value: '',
      language: this.computedLanguage,
      theme: this.computedTheme,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      insertSpaces: true,
      tabSize: 2,
      lineNumbersMinChars: 3,
    });
    // set value    
    const inheritModelValue = await this.#inheritModelValue()
    if(inheritModelValue){
      this.updateModelValue(inheritModelValue)
    }
    //
    this.editor.onDidChangeModelContent(()=>{
      const updateEvent = new Event('update', { bubbles: true, composed: true });
      this.dispatchEvent(updateEvent);
      const changeEvent = new Event('change', { bubbles: true, composed: true });
      this.dispatchEvent(changeEvent);
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('readonly')) {
      const readOnly = typeof this.readonly === "string" && this.readonly !== "false"
      this.editor.updateOptions({ readOnly });
    }
  }
  
  render() {
    return html`
      <style>${styles}</style>
      <div class="lm-editor-main" ${ref(this.containerRef)}></div>
      <footer class="lm-editor-footer">
        <div>lang : ${this.computedLanguage}</div>
        <div></div>
      </footer>
    `
  }
}

window.customElements.define('lm-editor', LitMonacoEditor)
