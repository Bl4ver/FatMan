export class Renderer {
    constructor(engine) {
        this.engine = engine;
        this.templateContainer = document.getElementById('screen');
    }

    update() {
        let playerDiv = document.getElementById("player");
        if (playerDiv) {
            let targetCell = document.getElementById(`cell-${this.engine.player.x}-${this.engine.player.y}`);
            
            if (targetCell && playerDiv.parentElement !== targetCell) {
                targetCell.appendChild(playerDiv);
            }
        }
    }

    async loadScreen(templateName) {
        const template = document.getElementById(templateName);
        if (template) {
            this.templateContainer.innerHTML = '';
            const clone = template.content.cloneNode(true);
            this.templateContainer.appendChild(clone);

            if (templateName === "settingsTemp") {
                this.updateSettingUi();
            }
            else if (templateName === "playTemp") {
                // A játéktér logikájának delegálása az Engine-nek
                await this.engine.setupPlayMode(); 
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