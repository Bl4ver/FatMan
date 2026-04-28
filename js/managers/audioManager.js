export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volumes = {
            master: 0.5,
            music: 0.5,
            sfx: 0.5
        }
    }

    init() {
        this.loadSound('button-click');
        this.loadSound('choose');
        this.loadSound('eat');

        for (let i = 1; i <= 7; i++) {
            this.loadSound(`victory${i}`);
        }
    }

    loadSound(name, type = "sfx") {
        const audio = new Audio(`../../src/audio/${name}.mp3`);
        this.sounds[name] = audio;
        this.sounds[name].type = type; // Eltároljuk a típust, hogy a klónozásnál tudjuk a hangerőt
    }

    playSound(name) {
        if (this.sounds[name]) {
            // Létrehozunk egy KLÓNT az eredeti hangból, így egyszerre több is szólhat megszakítás nélkül
            const soundClone = this.sounds[name].cloneNode();

            // Beállítjuk a hangerőt az SFX és a Master volume alapján
            soundClone.volume = this.volumes[this.sounds[name].type] * this.volumes.master;

            // Lejátsszuk a klónt
            soundClone.play();

            // Opcionális takarítás: ha véget ért a hang, töröljük a memóriából
            soundClone.onended = () => {
                soundClone.remove();
            };
        }
    }

    playMusic(name) {
        if (this.music) {
            this.music.pause();
        }
        this.music = new Audio(`../../src/audio/${name}.mp3`);
        this.music.loop = true;
        this.music.volume = this.volumes.music * this.volumes.master;
        this.music.play();
    }

    setVolume(value, type) {
        // A kapott értéket frissítjük a konkrét típushoz
        this.volumes[type] = value;

        // Ha épp szól a zene, annak a hangerejét azonnal frissítjük
        if (type === "music" && this.music) {
            this.music.volume = this.volumes.music * this.volumes.master;
        }

        // Ha a fő hangerőt húzzuk, a zenét is frissíteni kell
        if (type === "master" && this.music) {
            this.music.volume = this.volumes.music * this.volumes.master;
        }

        // Megjegyzés: A hangeffekteket (SFX) klónozzuk és amúgy is rövidek, 
        // ezért azoknál az aktuálisan lejátszott hangok hangereje nem frissül azonnal beállításkor,
        // de a következő 'playSound' hívás már az új hangerővel fog megszólalni.
    }
}