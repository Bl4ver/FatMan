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

                if (this.currentTemplateName === "settingsTemp")
                    this.updateSettingUi();
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
                document.getElementById("masterVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume, "master");
            }

            if (e.target.id === 'inputMusicVolume') {
                const volume = e.target.value / 100;
                document.getElementById("musicVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume, "music");
            }

            if (e.target.id === 'inputSFXVolume') {
                const volume = e.target.value / 100;
                document.getElementById("sfxVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume, "sfx");
            }
        });
    }

    updateSettingUi() {
        document.getElementById("inputMasterVolume").value = this.engine.audioManager.volumes.master * 100;
        document.getElementById("masterVolumeValue").innerHTML = this.engine.audioManager.volumes.master * 100;
        document.getElementById("inputMusicVolume").value = this.engine.audioManager.volumes.music * 100;
        document.getElementById("musicVolumeValue").innerHTML = this.engine.audioManager.volumes.music * 100;
        document.getElementById("inputSFXVolume").value = this.engine.audioManager.volumes.sfx * 100;
        document.getElementById("sfxVolumeValue").innerHTML = this.engine.audioManager.volumes.sfx * 100;
    }
}