// your-component.js
class MyCustomComponent extends HTMLElement {
  #errorAudio; // Private property

  constructor() {
    super();

    // Set the private property with the audio file
    this.#errorAudio = new Audio('path/to/your/error-audio.wav');

    // Create a button directly in the component
    const button = document.createElement('button');
    button.textContent = 'Play Error Audio';
    button.addEventListener('click', () => this.playErrorAudio());

    // Append the button to the component
    this.appendChild(button);
  }

  playErrorAudio() {
    // Play the private audio file
    this.#errorAudio.play();
  }
}

// Define the custom element
customElements.define('my-custom-component', MyCustomComponent);
