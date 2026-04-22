export class Labyrinth {
    constructor(engine) {
        this.engine = engine;
        this.size = { width: 10, height: 10 }
    }

    init() {

    }

    generate() {
        let labyrinth = document.getElementById("labyrinth");
        for (let i = 0; i < this.size.height; i++) {
            for (let j = 0; j < this.size.width; j++) {
                labyrinth.appendChild(document.createElement("div"))
            }
        }
    }
}