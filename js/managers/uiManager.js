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
                this.engine.audioManager.playSound('button-click');
                this.currentTemplateName = `${templateName}`;
                this.engine.renderer.loadScreen(this.currentTemplateName);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'menuLang') {
                const lang = e.target.value;
                this.engine.audioManager.playSound('choose');
                this.engine.langManager.changeLang(lang.toLowerCase());
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'inputMasterVolume') {
                const volume = e.target.value / 100;
                this.engine.audioManager.setVolume(volume, "master");
            }

            if (e.target.id === 'inputMusicVolume') {
                const volume = e.target.value / 100;
                this.engine.audioManager.setVolume(volume, "music");
            }

            if (e.target.id === 'inputSFXVolume') {
                const volume = e.target.value / 100;
                this.engine.audioManager.setVolume(volume, "sfx");
            }
        });
    }
}