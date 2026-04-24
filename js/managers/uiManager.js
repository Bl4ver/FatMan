export class UiManager {
    constructor(engine) {
        this.engine = engine;
        this.currentTemplateName = 'mainMenuTemp'; //mainMenuTemp, settingsTemp, playTemp
        this.lastTemplateName = null;
        this.currentDescName = 'Gameplay';
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.button) {
                this.engine.audioManager.playSound('button-click');
                const templateName = e.target.dataset.button;
                this.lastTemplateName = this.currentTemplateName;
                this.currentTemplateName = `${templateName}`;
                this.engine.renderer.loadScreen(this.currentTemplateName);
            }
            if (e.target.dataset.desc){
                this.engine.audioManager.playSound('button-click');
                const descName = e.target.dataset.desc;
                const infoDesc = document.getElementById("infoDesc");
                infoDesc.innerHTML = document.getElementById(`infoDesc${descName}`).innerHTML;
                const newInfoSect = document.getElementById(`infoSect${descName}`);
                document.getElementById(`infoTitle`).innerHTML = newInfoSect.innerHTML;
                document.getElementById(`infoSect${this.currentDescName}`).classList.toggle("ctSelected");
                newInfoSect.classList.toggle("ctSelected");
                this.currentDescName = descName;
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'menuLang') {
                const lang = e.target.value;
                this.engine.audioManager.playSound('button-click');
                this.engine.langManager.changeLang(lang.toLowerCase());
            }

            this.engine.saveManager.saveGame();
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'inputMasterVolume') {
                const volume = e.target.value;
                document.getElementById("masterVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume / 100, "master");
            }

            if (e.target.id === 'inputMusicVolume') {
                const volume = e.target.value;
                document.getElementById("musicVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume / 100, "music");
            }

            if (e.target.id === 'inputSFXVolume') {
                const volume = e.target.value;
                document.getElementById("sfxVolumeValue").innerHTML = volume;
                this.engine.audioManager.setVolume(volume / 100, "sfx");
            }
            this.engine.saveManager.saveGame();
        });
    }

    ChangeTemplate(templateName) {
        this.lastTemplateName = this.currentTemplateName;
        this.currentTemplateName = templateName;
        this.engine.renderer.loadScreen(this.currentTemplateName);

        const backBt = document.getElementById("settingsBack");
        if (backBt != null)
            backBt.dataset.button = this.lastTemplateName;
        const langBt = document.getElementById("menuLang");
        if (langBt != null)
            langBt.value = this.engine.langManager.lang.toUpperCase();
            console.log(this.engine.langManager.lang.toUpperCase());
            

        if (templateName === "playTemp"){
            this.engine.labyrinth.generate()
        }
    }

}