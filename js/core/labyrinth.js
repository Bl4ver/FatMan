export class Labyrinth {
    constructor(engine) {
        this.engine = engine;
        this.size = { width: 21, height: 20 };
    }

    init() {
    }

    /*
    
    ------------------------------------------------------------------------------

                    EZT ANNAK ÍROM AKI EBBE BELE AKAR NYÚLNI
                            MERT ZAVARJA AZ ANIMÁCIÓ

                ezeket keresd: 
                async generate(animate = true)  -->  async generate(animate = false)     
                    |=> kikapcsolja a falak generálásának az animációját

                this.breadthFirstSearch({x: 1, y: 1}, {x: this.size.width - 2, y: this.size.height - 2}); --> töröld ezt a sort
                   |=> kikapcsolja azt a path finding-os cuccot (181. kódsor)

    ------------------------------------------------------------------------------

    */

    // HTML frissítő
    updateDOMCell(x, y, type) {
        let cell = document.getElementById(`cell-${x}-${y}`);
        if (!cell) return;

        cell.className = "cell";

        if (type === 1) {
            cell.classList.add("wall");
            cell.dataset.cellType = "wall";
        } else if (type === 0) {
            cell.dataset.cellType = "path";
        } else if (type === 2) {
            cell.classList.add("ghost-door");
            cell.dataset.cellType = "door";
        }
    }

    // Fő generáló
    async generate(animate = true) {
        let labyrinth = document.getElementById("labyrinth");
        labyrinth.innerHTML = '';

        let targetHeight = this.size.height;
        this.size.height = (targetHeight % 2 === 0) ? targetHeight + 1 : targetHeight;

        let targetHalfWidth = Math.floor(this.size.width / 2);
        let safeHalfWidth = (targetHalfWidth % 2 === 0) ? targetHalfWidth + 1 : targetHalfWidth;

        this.size.width = safeHalfWidth * 2;

        let height = this.size.height;
        let fullWidth = this.size.width;
        let halfWidth = safeHalfWidth;

        labyrinth.style.gridTemplateColumns = `repeat(${fullWidth}, 1fr)`;
        labyrinth.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        this.mapData = [];

        // A HTML Grid és a mapData feltöltése fallal (1)
        for (let y = 0; y < height; y++) {
            let fullRow = [];
            for (let x = 0; x < fullWidth; x++) {
                fullRow.push(1);
                this.createDivCell(labyrinth, x, y, 1);
            }
            this.mapData.push(fullRow);
        }

        /*
        let labyrinth = document.getElementById("labyrinth");
        labyrinth.innerHTML = '';

        let height = this.size.height;
        let fullWidth = this.size.width;
        let halfWidth = fullWidth / 2;

        labyrinth.style.gridTemplateColumns = `repeat(${fullWidth}, 1fr)`;
        labyrinth.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        this.mapData = [];

        // Alap grid és falak
        for (let y = 0; y < height; y++) {
            let fullRow = [];
            for (let x = 0; x < fullWidth; x++) {
                fullRow.push(1);
                this.createDivCell(labyrinth, x, y, 1);
            }
            this.mapData.push(fullRow);
        }
        */

        // Csempe beállító
        const setTile = async (x, y, type, delay = 10) => {
            this.mapData[y][x] = type;
            this.updateDOMCell(x, y, type);

            let mirrorX = fullWidth - 1 - x;
            this.mapData[y][mirrorX] = type;
            this.updateDOMCell(mirrorX, y, type);

            if (animate) await this.sleep(delay);
        };

        // Labirintus ásása
        let stack = [];
        let startX = 1;
        let startY = 1;

        await setTile(startX, startY, 0);
        stack.push({ x: startX, y: startY });

        while (stack.length > 0) {
            let current = stack[stack.length - 1];
            let dirs = [{ x: 0, y: -2 }, { x: 0, y: 2 }, { x: -2, y: 0 }, { x: 2, y: 0 }];
            dirs.sort(() => Math.random() - 0.5);

            let carved = false;
            for (let dir of dirs) {
                let nx = current.x + dir.x;
                let ny = current.y + dir.y;

                if (nx > 0 && nx < halfWidth && ny > 0 && ny < height - 1 && this.mapData[ny][nx] === 1) {
                    await setTile(current.x + dir.x / 2, current.y + dir.y / 2, 0);
                    await setTile(nx, ny, 0);
                    stack.push({ x: nx, y: ny });
                    carved = true;
                    break;
                }
            }
            if (!carved) stack.pop();
        }

        // Hurkok generálása
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < halfWidth - 1; x++) {
                if (this.mapData[y][x] === 1) {
                    let top = this.mapData[y - 1][x];
                    let bottom = this.mapData[y + 1][x];
                    let left = this.mapData[y][x - 1];
                    let right = this.mapData[y][x + 1];

                    let pathCount = 0;
                    if (top === 0) pathCount++;
                    if (bottom === 0) pathCount++;
                    if (left === 0) pathCount++;
                    if (right === 0) pathCount++;

                    let horizontalPath = (left === 0 && right === 0);
                    let verticalPath = (top === 0 && bottom === 0);

                    if (pathCount === 2 && (horizontalPath || verticalPath)) {
                        if (Math.random() < 0.4) {
                            await setTile(x, y, 0, 30);
                        }
                    }
                }
            }
        }

        // Középső alagutak
        let randomTunnels = Math.floor(Math.random() * (height - 2)) + 1;
        for (let x = 0; x < randomTunnels; x++) {
            let possibleOddRows = Math.floor((height - 2) / 2);
            let randomYPos = Math.floor(Math.random() * possibleOddRows) * 2 + 1;
            await setTile(halfWidth - 1, randomYPos, 0, 50);
            await setTile(halfWidth - 2, randomYPos, 0, 50);
        }

        // Szellemház
        await this.createGhostHouse(halfWidth, height, setTile);

        this.breadthFirstSearch({x: 1, y: 1}, {x: this.size.width - 2, y: this.size.height - 2});
    }

    // HTML cella létrehozó
    createDivCell(container, x, y, type) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${x}-${y}`;

        if (type === 1) {
            cell.classList.add("wall");
            cell.dataset.cellType = "wall";
        } else if (type === 0) {
            cell.dataset.cellType = "path";
        } else if (type === 2) {
            cell.classList.add("ghost-door");
            cell.dataset.cellType = "door";
        }

        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
    }

    // Szellemház építő
    async createGhostHouse(halfWidth, height, setTile) {
        let midY = Math.floor(height / 2); 
        let rightEdge = halfWidth - 1;

        let houseTop = midY - 2;
        
        if (houseTop % 2 !== 0) {
            houseTop -= 1; 
        }
        
        let houseBottom = houseTop + 4;
        let houseLeft = rightEdge - 4;

        // Sima út a ház körül
        for (let y = houseTop - 1; y <= houseBottom + 1; y++) {
            for (let x = houseLeft - 1; x <= rightEdge; x++) {
                if (y > 0 && y < height - 1 && x > 0) {
                    await setTile(x, y, 0, 5); 
                }
            }
        }

        // Falak és a belső üreg
        for (let y = houseTop; y <= houseBottom; y++) {
            for (let x = houseLeft; x <= rightEdge; x++) {
                if (x === houseLeft || y === houseBottom || (y === houseTop && x < rightEdge)) {
                    await setTile(x, y, 1, 5); // A ház fala
                } else {
                    await setTile(x, y, 0, 5); // Belső üreg
                }
            }
        }

        // Ajtó
        await setTile(rightEdge, houseTop, 2, 5);
    }

    // Kezdőpont kereső
    getSpawnPosition() {
        let validPositions = [];

        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                if (this.mapData[y][x] === 0) {
                    if (y > (this.size.height / 2) + 2) {
                        validPositions.push({ x: x, y: y });
                    }
                }
            }
        }

        if (validPositions.length === 0) {
            return { x: 1, y: 1 };
        }

        let randomIndex = Math.floor(Math.random() * validPositions.length);
        return validPositions[randomIndex];
    }

    // Késleltető
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Útvonalkereső (BFS)
    async breadthFirstSearch(start, end) {
        let timer = new Date;
        let queue = [{ pos: start, path: [start] }];
        let visited = [start];
        let delay = 1;
        let token = Infinity;

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

            if (delay > 0)
                await this.sleep(delay);

            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let currentCellHTML = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`)
                    currentCellHTML.classList.add("path")
                    currentCellHTML.classList.remove("visited")
                });
                return;
            }

            checkCellIsValid(currentPos, currentPath);
            token--;
        }
        if (queue.length === 0) {
            console.log("Nem lehet eljutni a target positionra!")
        } else if (token <= 0) {
            console.log("A keresés leállt: Elfogyott a token!");
        }
        console.log(`Ennyi ideig tartott: ${new Date - timer} ms`)

    }
}