export class UiManager {
    constructor(engine) {
        this.engine = engine;
        this.currentTemplateName = 'mainMenuTemp';
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
                this.engine.renderer.loadScreen(this.currentTemplateName);
            }

            if (e.target.id === 'menuLang') {
                const lang = e.target.value;
                this.engine.langManager.changeLang(lang.toLowerCase());
            }
        });
    }
}