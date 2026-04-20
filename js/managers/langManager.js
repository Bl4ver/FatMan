export class LangManager {
    constructor() {
        this.lang = 'en';
        this.translations = {
            'en': {
                "play": "Play",
                "settings": "Settings",
                "info": "Info"
            },
            'hu': {
                "play": "Játék",
                "settings": "Beállítások",
                "info": "Info"
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