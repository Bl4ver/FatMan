export class UiManager {
    constructor(enginge) {
        this.enginge = enginge;
        this.currentTemplateName = 'settingsTemp';
        this.lastTemplateName = null;
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.button) {
                const templateName = e.target.dataset.button;
                this.lastTemplateName = this.currentTemplateName;
                this.currentTemplateName = `${templateName}`;
                this.enginge.renderer.loadScreen(this.currentTemplateName);
            }
        });
    }
}