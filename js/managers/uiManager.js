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
                this.ChangeTemplate(templateName);
            }
            if (e.target.dataset.desc){
                this.engine.audioManager.playSound('button-click');
                const descName = e.target.dataset.desc;
                const infoDesc = document.getElementById("infoDesc");
                const newInfoSect = document.getElementById(`infoSect${descName}`);
                const title = document.getElementById(`infoTitle`);
                title.innerHTML = newInfoSect.innerHTML;
                document.getElementById(`infoSect${this.currentDescName}`).classList.toggle("ctSelected");
                infoDesc.dataset.translate = `infoDesc${descName}`;
                title.dataset.translate = `infoTitle${descName}`;
                newInfoSect.classList.toggle("ctSelected");
                this.currentDescName = descName;
                this.engine.langManager.translatePage();
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
        const screen = document.getElementById("screen");
        const playCon = document.getElementById("playConTemp");
        if (templateName == "resPlayTemp"){
            playCon.innerHTML = "";
            templateName = "playTemp";
            this.engine.level = 1;
            this.engine.labyrinth.size = { width: 14, height: 10 };
            this.engine.score = 0;
        }
            
        if (this.currentTemplateName == "playTemp" && templateName == "settingsTemp"){
            for (const element of document.getElementsByClassName("ghost")) {
                element.remove();
            }
            playCon.innerHTML = screen.innerHTML;
        }

        if (templateName == "mainMenuTemp"){
            playCon.innerHTML = "";
        }

        this.lastTemplateName = this.currentTemplateName;
        this.currentTemplateName = templateName;
        this.engine.renderer.loadScreen(this.currentTemplateName);

        const backBt = document.getElementById("settingsBack");
        if (backBt != null)
            backBt.dataset.button = this.lastTemplateName;
            
        const langBt = document.getElementById("menuLang");
        if (langBt != null) {
            langBt.value = this.engine.langManager.lang.toUpperCase();
        }
    }
}