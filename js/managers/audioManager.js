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
    }


    loadSound(name, type = "sfx") {
        const audio = new Audio(`../../src/audio/${name}.mp3`);
        this.sounds[name] = audio;
        this.sounds[name].type = type;
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].volume = this.volumes[this.sounds[name].type] * this.volumes.master;
            this.sounds[name].play();
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
        this.volume = value;
        this.volumes[type] = this.volume;
        if (type === "music")
            this.music.volume = this.volumes[type] * this.volumes.master;

        if (type === "master") {
            this.music.volume = this.volumes["music"] * this.volumes.master
        }
        else {
            Object.values(this.sounds).forEach(element => {
                if (element.type === type)
                    element.volume = this.volumes[type] * this.volumes.master;
            });
        }

    }
}