export class LangManager {
    constructor() {
        this.lang = 'en';
        this.translations = {
            'en': {
                "play": "Play",
                "settings": "Settings",
                "info": "Info",
                "masterVolume": "Master Volume",
                "musicVolume": "Music Volume",
                "sfxVolume": "SFX Volume"
            },
            'hu': {
                "play": "Játék",
                "settings": "Beállítások",
                "info": "Info",
                "masterVolume": "Fő hangerő",
                "musicVolume": "Zene hangerő",
                "sfxVolume": "SFX Volume"
            }
        }
    }

    init() {

    }

    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            element.textContent = this.translations[this.lang][key];
        });
    }

    changeLang(lang) {
        if (this.translations[lang]) {
            this.lang = lang;
            this.translatePage();
        }
    }
}