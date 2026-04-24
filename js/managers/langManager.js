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
            console.log(`Translating element with key: ${element.dataset.translate}`);
            const key = element.dataset.translate;
            element.textContent = this.translations[this.lang][key];
        });
    }

    changeLang(lang) {
        if (this.translations[lang]) {
            if (document.getElementById('menuLang')) {
                this.lang = lang;
                console.log(`Language changed to: ${lang.toUpperCase()}`);
                document.getElementById('menuLang').value = lang.toUpperCase();
                this.translatePage();
            }
        }
    }
}