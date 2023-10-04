import { LitElement, css, html } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js'

import * as monaco from "monaco-editor";
import styles from "monaco-editor/min/vs/editor/editor.main.css?inline";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
// Why is tsWorker annotated? : This editor is aimed at generating runtime code to use immediately rather than declaring precompiled languages, so tsWorker has been excluded. Including tsWorker is not trivial due to the file size.
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

  static get styles() {
    return css`
      :host {
        --lit-editor-width: 100%;
        --lit-editor-height: 100%;
        --lit-editor-bottom-space: 0px;
        --lit-editor-footer-height: 24px;
        --lit-editor-faint-line: #444;
        --lit-editor-light-line: #aaa;
        position: relative;
      }
      .lm-editor-main {
        width: var(--lit-editor-width);
        height: calc(var(--lit-editor-height) - var(--lit-editor-bottom-space));
        min-height: 120px;
      }
      .lm-editor-footer {
        position: absolute;
        left: auto;
        right: calc(var(--lit-editor-footer-height) - 4px);
        bottom: calc(var(--lit-editor-footer-height) - 8px);
        width: var(--lit-editor-footer-height);
        height: var(--lit-editor-footer-height);
        border:1px solid var(--lit-editor-faint-line);
        border-radius: 8px;
        font-size:14px;
        color: var(--lit-editor-light-line);
      }
      .lm-editor-footer-dropdown {
        display: none;
        position: absolute;
        left: auto;
        right: -1px;
        bottom: -1px;
        padding: 2px 4px;
        border:1px solid var(--lit-editor-faint-line);
        background-color: rgba(0,0,0,.5);
        border-radius: 4px;
      }
      .lm-editor-footer-dropdown-content {
        width: 120px;
      }
      .lm-editor-footer-dropdown > div {
        display: block;
      }
      .lm-editor-footer-toggle {
        position: absolute;
        color: var(--lit-editor-faint-line);
        text-align: center;
        width: var(--lit-editor-footer-height);
        height: var(--lit-editor-footer-height);
        padding-top: 4px;
      }
      .lm-editor-footer:hover {
      }
      .lm-editor-footer:hover .lm-editor-footer-toggle {
        color: var(--lit-editor-light-line);
      }
      .lm-editor-footer:hover .lm-editor-footer-dropdown {
        display: block;
      }
    `
  }
  containerRef = createRef()
  editor = null

  static get properties() {
    return {
      theme: { type: String },
      lang: { type: String },
      src: { type: String },
      value: { type: String },
      disabledFooter: { type: String, attribute: 'disabled-footer' },
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
    this.disabledFooter = null
  }

  connectedCallback() {
    // keydown event listener for save and explorer
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
    console.log('this.disabledFooter', this.disabledFooter)
    const footerContent = this.disabledFooter !== null && this.disabledFooter !== "false" ? '' : html`
      <footer class="lm-editor-footer">
        <div class="lm-editor-footer-dropdown">
          <slot name="footer">
            <div class="lm-editor-footer-dropdown-content">
              <div>lang : ${this.computedLanguage}</div>
            </div>
          </slot>
        </div>
        <div class="lm-editor-footer-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
          </svg>
        </div>
      </footer>
    `
    return html`
      <style>${styles}</style>
      <div class="lm-editor-main" ${ref(this.containerRef)}></div>
      ${footerContent}
    `
  }
}

window.customElements.define('lm-editor', LitMonacoEditor)
