export class LangManager {
    constructor() {
        this.lang = 'en';
        this.translations = {
            'en': {
                "play": "Play",
                "settings": "Settings",
                "info": "Info",
                "backButton": "<img src='../src/image/arrow_back_ios_26dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'>Back",
                "masterVolume": "Master Volume",
                "musicVolume": "Music Volume",
                "sfxVolume": "SFX Volume"
            },
            'hu': {
                "play": "Játék",
                "settings": "Beállítások",
                "info": "Info",
                "backButton": "<img src='../src/image/arrow_back_ios_26dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'>Vissza",
                "masterVolume": "Fő hangerő",
                "musicVolume": "Zene hangerő",
                "sfxVolume": "SFX Volume"
            },
            'ger': {
                "play": "Spiel",
                "settings": "Einstellungen",
                "info": "Info",
                "backButton": "<img src='../src/image/arrow_back_ios_26dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'>Zurück",
                "masterVolume": "Master-Lautstärke",
                "musicVolume": "Musik-Lautstärke",
                "sfxVolume": "SFX-Lautstärke"
            }
        }
    }

    init() {

    }

    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            console.log(`Translating element with key: ${element.dataset.translate}`);
            const key = element.dataset.translate;
            element.innerHTML = this.translations[this.lang][key];
        });
    }

    changeLang(lang) {
        if (this.translations[lang]) {
            this.lang = lang;
            console.log(`Language changed to: ${lang.toUpperCase()}`);
            this.translatePage();
        }
    }
}