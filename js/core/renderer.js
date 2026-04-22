export class Renderer {
    constructor(engine) {
        this.engine = engine;
        this.templateContainer = document.getElementById('screen');
    }

    loadScreen(templateName) {
        const template = document.getElementById(templateName);
        if (template) {
            this.templateContainer.innerHTML = '';
            const clone = template.content.cloneNode(true);
            this.templateContainer.appendChild(clone);

            if (templateName === "settingsTemp") {
                this.updateSettingUi();
            }

            this.engine.langManager.translatePage();
        }
    }

    renderScene(scene) {
        this.templateContainer.innerHTML = `Rendering scene: ${scene}`;
    }

    updateSettingUi() {
        console.log('Updating settings UI with current audio volumes');
        
        document.getElementById("inputMasterVolume").value = this.engine.audioManager.volumes.master * 100;
        document.getElementById("masterVolumeValue").innerHTML = this.engine.audioManager.volumes.master * 100;
        document.getElementById("inputMusicVolume").value = this.engine.audioManager.volumes.music * 100;
        document.getElementById("musicVolumeValue").innerHTML = this.engine.audioManager.volumes.music * 100;
        document.getElementById("inputSFXVolume").value = this.engine.audioManager.volumes.sfx * 100;
        document.getElementById("sfxVolumeValue").innerHTML = this.engine.audioManager.volumes.sfx * 100;
    }
}