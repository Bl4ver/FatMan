export class LangManager {
    constructor() {
        this.lang = 'en';
        this.translations = null;
        this.ready = this.loadLang();
    }

    async loadLang() {
        try {
            const response = await fetch('../../src/json/lang.json');

            if (!response.ok) {
                throw new Error(`HTTP hiba! Státusz: ${response.status}`);
            }

            this.translations = await response.json();

        } catch (error) {
            console.error('Nem sikerült feldolgozni a fájlt:', error);
        }
    }


    init() {

    }

    async translatePage() {
        await this.ready;
        document.querySelectorAll('[data-translate]').forEach(element => {
            /*console.log(`Translating element with key: ${element.dataset.translate}`);*/
            const key = element.dataset.translate;
            element.innerHTML = this.translations[this.lang][key];
        });
    }

    async changeLang(lang) {
        await this.ready;
        if (this.translations[lang]) {
            this.lang = lang;
            /*console.log(`Language changed to: ${lang.toUpperCase()}`);*/
            this.translatePage();
        }
    }
}