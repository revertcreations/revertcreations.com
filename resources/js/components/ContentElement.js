export class ContentElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {}
}

customElements.define("content-element", ContentElement);
