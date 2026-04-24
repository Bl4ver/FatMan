export class Labyrinth {
    constructor(engine) {
        this.engine = engine;
        this.size = { width: 20, height: 30 }
    }

    init() {
    }

    generate() {
        let labyrinth = document.getElementById("labyrinth");
        labyrinth.innerHTML = '';

        labyrinth.style.gridTemplateColumns = `repeat(${this.size.width}, 1fr)`;
        labyrinth.style.gridTemplateRows = `repeat(${this.size.height}, 1fr)`;

        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.id = `cell-${x}-${y}`;
                cell.dataset.cellType = "path";

                cell.dataset.x = x;
                cell.dataset.y = y;

                labyrinth.appendChild(cell);
            }
        }

        this.randomWalls(labyrinth);
        this.breadthFirstSearch({ x: 0, y: 0 }, { x: this.size.width - 1, y: this.size.height - 1 });
    }

    randomWalls(labyrinth) {
        let cells = labyrinth.querySelectorAll(".cell");
        for (let i = 0; i < cells.length; i++) {
            let x = parseInt(cells[i].dataset.x);
            let y = parseInt(cells[i].dataset.y);

            if ((x === 0 && y === 0) || (x === this.size.width - 1 && y === this.size.height - 1)) {
                continue;
            }

            if (Math.random() < 0.3) {
                cells[i].classList.add("wall");
                cells[i].dataset.cellType = "wall"
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async breadthFirstSearch(start, end) {
        let queue = [{ pos: start, path: [start] }];
        let visited = [start];
        let delay = 10;
        let token = 1000;

        let checkCellIsValid = (cell, currentPath) => {
            let directions = [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 0, y: -1 }
            ];

            directions.forEach(direction => {
                let nx = cell.x + direction.x;
                let ny = cell.y + direction.y;

                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    let targetElement = document.getElementById(`cell-${nx}-${ny}`);
                    let isAlreadyVisited = visited.some(vis => vis.x === nx && vis.y === ny);

                    if (targetElement.dataset.cellType === "path" && !isAlreadyVisited) {
                        targetElement.classList.add("visited");

                        let newPos = { x: nx, y: ny };
                        let newPath = [...currentPath, newPos];
                        queue.push({ pos: newPos, path: newPath });
                        visited.push(newPos);
                    }
                }
            });
        }

        // --- A FŐ CIKLUS ---
        while (queue.length > 0 && token > 0) {
            let currentData = queue.shift();
            let currentPos = currentData.pos;
            let currentPath = currentData.path;

            await this.sleep(delay);

            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let currentCellHTML = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`)
                    currentCellHTML.classList.add("path")
                    currentCellHTML.classList.remove("visited")
                })
                return;
            }

            checkCellIsValid(currentPos, currentPath);
            token--;
        }
        if (queue.length === 0) {
            console.log("Nem lehet eljutni a target positionra!")
        }
        else if (token <= 0) {
            console.log("A keresés leállt: Elfogyott a token!");
        }

    }


}