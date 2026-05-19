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
                this.engine.stop();
                this.updateSettingUi();
            }
            else if (templateName === "playTemp") {
                if (!this.engine.isRunning)
                    this.engine.start();
                const playCon = document.getElementById("playConTemp");
                if (!playCon.innerHTML.trim()){
                    await this.engine.setupPlayMode(); // A játéktér logikájának delegálása az Engine-nek
                    this.engine.score = 0;
                }
                else{
                    document.getElementById("screen").innerHTML = playCon.innerHTML;
                }

            }

            this.engine.langManager.translatePage();
        }
    }

    renderScene(scene) {
        this.templateContainer.innerHTML = `Rendering scene: ${scene}`;
    }

    updateSettingUi() {
        console.log('Updating settings UI with current audio volumes');

        document.getElementById("inputMasterVolume").value = Math.round(this.engine.audioManager.volumes.master * 100);
        document.getElementById("masterVolumeValue").innerHTML = Math.round(this.engine.audioManager.volumes.master * 100);
        document.getElementById("inputMusicVolume").value = Math.round(this.engine.audioManager.volumes.music * 100);
        document.getElementById("musicVolumeValue").innerHTML = Math.round(this.engine.audioManager.volumes.music * 100);
        document.getElementById("inputSFXVolume").value = Math.round(this.engine.audioManager.volumes.sfx * 100);
        document.getElementById("sfxVolumeValue").innerHTML = Math.round(this.engine.audioManager.volumes.sfx * 100);
    }
}