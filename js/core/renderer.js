export class Renderer {
    constructor() {
        this.templateContainer = document.getElementById('screen');
    }

    loadScreen(templateName) {
        this.templateContainer.innerHTML = '';
        const template = document.getElementById(templateName);
        const clone = template.content.cloneNode(true);
        this.templateContainer.appendChild(clone);
    }

    renderScene(scene) {
        this.clear();
        this.templateContainer.innerHTML = `Rendering scene: ${scene}`;
    }
}