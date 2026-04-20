export class Renderer {
    constructor() {
        this.templateContainer = document.getElementById('screen');
    }

    loadScreen(templateName) {
        const template = document.getElementById(templateName);
        if (template) {
            this.templateContainer.innerHTML = '';
            const clone = template.content.cloneNode(true);
            this.templateContainer.appendChild(clone);
        }
    }

    renderScene(scene) {
        this.templateContainer.innerHTML = `Rendering scene: ${scene}`;
    }
}