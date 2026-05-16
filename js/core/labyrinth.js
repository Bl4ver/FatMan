export class Labyrinth {
    constructor(engine) {
        this.engine = engine;
        this.size = { width: 14, height: 10 };
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
        cell.innerHTML = ""; // Biztosítjuk, hogy ne maradjon benne semmi előző tartalom

        if (type === 1) {
            cell.classList.add("wall");
            cell.dataset.cellType = "wall";
        } else if (type === 0) {
            cell.dataset.cellType = "path";

            // Érme hozzáadása
            let hamburger = document.createElement("div");
            hamburger.className = "hamburger";
            cell.appendChild(hamburger);
        } else if (type === 2) {
            cell.classList.add("ghost-door");
            cell.dataset.cellType = "door";
        }
    }

    // Fő generáló
    async generate(animate = false) {
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
        const setTile = async (x, y, type, delay = 1) => {
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

        // this.breadthFirstSearch({ x: 1, y: 1 }, { x: this.size.width - 2, y: this.size.height - 2 });
        // this.depthFirstSearch({ x: 1, y: 1 }, { x: this.size.width - 2, y: this.size.height - 2 });
        // this.aStarSearch({ x: 1, y: 1 }, { x: this.size.width - 2, y: this.size.height - 2 });
        // this.dijkstraSearch({ x: 1, y: 1 }, { x: this.size.width - 2, y: this.size.height - 2 });
        // this.greedySearch({ x: 1, y: 1 }, { x: this.size.width - 2, y: this.size.height - 2 });

        console.log(this.mapData)
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
        } else if (type === 3) {
            cell.classList.add("ghost-house");
            cell.dataset.cellType = "ghost-house";
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

        let houseBottom = houseTop + 2;
        let houseLeft = rightEdge - 2;

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
                    await setTile(x, y, 3, 5); // Belső üreg
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
        let delay = 10;
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

    // Szinkron BFS az AI mozgásához. Nem rajzol a képernyőre, csak kikeresi a következő lépést!
    getGhostNextStepBFS(start, end) {
        // Ha a szellem és a játékos egy helyen van
        if (start.x === end.x && start.y === end.y) return null;

        // A queue tárolja a pozíciót, és a legelső lépést, ami ide vezetett
        let queue = [{ pos: start, firstStep: null }];
        let visited = new Set();
        visited.add(`${start.x},${start.y}`);

        let directions = [
            { x: 0, y: -1 }, // fel
            { x: 1, y: 0 },  // jobb
            { x: 0, y: 1 },  // le
            { x: -1, y: 0 }  // bal
        ];

        while (queue.length > 0) {
            let currentData = queue.shift();
            let currentPos = currentData.pos;

            // Ha elértük a játékost, visszaadjuk a felé vezető ELSŐ lépést
            if (currentPos.x === end.x && currentPos.y === end.y) {
                return currentData.firstStep;
            }

            for (let dir of directions) {
                let nx = currentPos.x + dir.x;
                let ny = currentPos.y + dir.y;
                let key = `${nx},${ny}`;

                // Pályán belül vagyunk?
                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    // Voltunk már itt?
                    if (!visited.has(key)) {
                        // Közvetlenül a mapData-ból olvassuk az adatot (1 = fal, többi járható)
                        if (this.mapData[ny][nx] !== 1) {
                            visited.add(key);

                            // Ha ez a legelső lépés, megjegyezzük, különben visszük tovább az eddigi firstStep-et
                            let step = currentData.firstStep || { x: nx, y: ny };

                            queue.push({
                                pos: { x: nx, y: ny },
                                firstStep: step
                            });
                        }
                    }
                }
            }
        }
        return null; // Nincs vezető út
    }











































    // Optimalizált Útvonalkereső (DFS)
    async depthFirstSearch(start, end) {
        let timer = new Date();
        // 1. Verem (Stack) inicializálása
        let stack = [{ pos: start, path: [start] }];

        // 2. Set használata: szupergyors és nem lehet elrontani a koordinátákkal
        let visited = new Set();
        visited.add(`${start.x},${start.y}`); // pl. "5,10" formátumban tároljuk

        let delay = 1;

        // --- FŐ CIKLUS ---
        while (stack.length > 0) {
            // 3. LIFO elv: A verem VÉGÉRŐL vesszük le az elemet a POP-pal! (Ez teszi DFS-sé)
            let currentData = stack.pop();
            let currentPos = currentData.pos;
            let currentPath = currentData.path;

            if (delay > 0) await this.sleep(delay);

            // Cél ellenőrzése
            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let cellElement = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`);
                    if (cellElement) {
                        cellElement.classList.add("path");
                        cellElement.classList.remove("visited");
                    }
                });
                console.log(`Ennyi ideig tartott: ${new Date() - timer} ms`);
                return;
            }

            // Szomszédok vizsgálata (Fel, Jobb, Le, Bal)
            let directions = [
                { x: 0, y: -1 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 }
            ];

            directions.forEach(direction => {
                let nx = currentPos.x + direction.x;
                let ny = currentPos.y + direction.y;
                let key = `${nx},${ny}`; // Egyedi azonosító a Set-hez

                // Pályán belül vagyunk?
                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    // Voltunk már itt?
                    if (!visited.has(key)) {
                        let targetElement = document.getElementById(`cell-${nx}-${ny}`);

                        // Érvényes útvonal?
                        if (targetElement && targetElement.dataset.cellType === "path") {
                            visited.add(key); // Megjelöljük látogatottként
                            targetElement.classList.add("visited"); // Színezés a képernyőn

                            // Új pozíció és eddigi út hozzáadása a verem végéhez
                            stack.push({
                                pos: { x: nx, y: ny },
                                path: [...currentPath, { x: nx, y: ny }]
                            });
                        }
                    }
                }
            });
        }

        console.log("Nem lehet eljutni a célhoz!");
    }

    async aStarSearch(start, end) {
        let timer = new Date();
        let delay = 1;

        // 1. Heurisztika (Manhattan távolság)
        // Ez kiszámolja, hány lépés légvonalban/rácsosan a cél (falak nélkül).
        let getHeuristic = (pos1, pos2) => {
            return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
        };

        // openSet: A még vizsgálandó cellák listája.
        // Eltároljuk a g (megtett út) és f (g + becsült hátralévő út) értékeket is.
        let startHeuristic = getHeuristic(start, end);
        let openSet = [{
            pos: start,
            path: [start],
            g: 0,
            f: startHeuristic
        }];

        // visited: Egyszerű Set a már meglátogatott koordináták gyors tárolására
        let visited = new Set();
        visited.add(`${start.x},${start.y}`);

        // --- FŐ CIKLUS ---
        while (openSet.length > 0) {
            // 2. A legkisebb 'f' értékű elem megkeresése (ez teszi A*-á)
            let lowestFIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestFIndex].f) {
                    lowestFIndex = i;
                }
            }

            // Kivesszük a legjobbnak tűnő elemet a tömbből
            let currentData = openSet.splice(lowestFIndex, 1)[0];
            let currentPos = currentData.pos;
            let currentPath = currentData.path;
            let currentG = currentData.g;

            if (delay > 0) await this.sleep(delay);

            // 3. Cél ellenőrzése
            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let cellElement = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`);
                    if (cellElement) {
                        cellElement.classList.add("path");
                        cellElement.classList.remove("visited");
                    }
                });
                console.log(`Ennyi ideig tartott: ${new Date() - timer} ms`);
                return;
            }

            // 4. Szomszédok vizsgálata (Fel, Jobb, Le, Bal)
            let directions = [
                { x: 0, y: -1 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 }
            ];

            directions.forEach(direction => {
                let nx = currentPos.x + direction.x;
                let ny = currentPos.y + direction.y;
                let key = `${nx},${ny}`;

                // Pályán belül vagyunk?
                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    // Voltunk már itt? (Mivel a lépésköltség mindig 1, ha már voltunk itt, az biztosan rövidebb vagy egyenlő út volt)
                    if (!visited.has(key)) {
                        let targetElement = document.getElementById(`cell-${nx}-${ny}`);

                        // Érvényes útvonal? (Nincs fal)
                        if (targetElement && targetElement.dataset.cellType === "path") {
                            visited.add(key); // Megjelöljük látogatottként
                            targetElement.classList.add("visited"); // Színezés

                            let newPos = { x: nx, y: ny };
                            let newG = currentG + 1; // Megtett lépések száma nő 1-gyel
                            let newF = newG + getHeuristic(newPos, end); // Új 'f' érték kiszámolása

                            openSet.push({
                                pos: newPos,
                                path: [...currentPath, newPos],
                                g: newG,
                                f: newF
                            });
                        }
                    }
                }
            });
        }

        console.log("Nem lehet eljutni a célhoz!");
    }

    async dijkstraSearch(start, end) {
        let timer = new Date();
        let delay = 1;

        // A prioritási sor: itt f helyett csak a g (megtett költség) számít
        let openSet = [{
            pos: start,
            path: [start],
            g: 0
        }];

        let visited = new Set();
        visited.add(`${start.x},${start.y}`);

        while (openSet.length > 0) {
            // A legkisebb 'g' (költség) értékű elem megkeresése
            let lowestGIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].g < openSet[lowestGIndex].g) {
                    lowestGIndex = i;
                }
            }

            let currentData = openSet.splice(lowestGIndex, 1)[0];
            let currentPos = currentData.pos;
            let currentPath = currentData.path;
            let currentG = currentData.g;

            if (delay > 0) await this.sleep(delay);

            // Cél ellenőrzése
            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let cellElement = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`);
                    if (cellElement) {
                        cellElement.classList.add("path");
                        cellElement.classList.remove("visited");
                    }
                });
                return;
            }

            let directions = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

            directions.forEach(direction => {
                let nx = currentPos.x + direction.x;
                let ny = currentPos.y + direction.y;
                let key = `${nx},${ny}`;

                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    if (!visited.has(key)) {
                        let targetElement = document.getElementById(`cell-${nx}-${ny}`);

                        if (targetElement && targetElement.dataset.cellType === "path") {
                            visited.add(key);
                            targetElement.classList.add("visited");

                            // Később ide teheted be a súlyozást: pl. lépésköltség = targetElement.dataset.weight
                            let stepCost = 1;

                            openSet.push({
                                pos: { x: nx, y: ny },
                                path: [...currentPath, { x: nx, y: ny }],
                                g: currentG + stepCost // Csak a megtett utat tartjuk számon
                            });
                        }
                    }
                }
            });
        }
        console.log("Nem lehet eljutni a célhoz!");
    }

    async greedySearch(start, end) {
        let timer = new Date();
        let delay = 1;

        // Heurisztika (Manhattan távolság)
        let getHeuristic = (pos1, pos2) => {
            return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
        };

        // Itt f helyett a h (heuristic) a döntő szempont
        let openSet = [{
            pos: start,
            path: [start],
            h: getHeuristic(start, end)
        }];

        let visited = new Set();
        visited.add(`${start.x},${start.y}`);

        while (openSet.length > 0) {
            // A legkisebb 'h' (célhoz legközelebbi) értékű elem megkeresése
            let lowestHIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].h < openSet[lowestHIndex].h) {
                    lowestHIndex = i;
                }
            }

            let currentData = openSet.splice(lowestHIndex, 1)[0];
            let currentPos = currentData.pos;
            let currentPath = currentData.path;

            if (delay > 0) await this.sleep(delay);

            // Cél ellenőrzése
            if (currentPos.x === end.x && currentPos.y === end.y) {
                console.log("Cél megtalálva!");
                currentPath.forEach(currentCell => {
                    let cellElement = document.getElementById(`cell-${currentCell.x}-${currentCell.y}`);
                    if (cellElement) {
                        cellElement.classList.add("path");
                        cellElement.classList.remove("visited");
                    }
                });
                return;
            }

            let directions = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

            directions.forEach(direction => {
                let nx = currentPos.x + direction.x;
                let ny = currentPos.y + direction.y;
                let key = `${nx},${ny}`;

                if (nx >= 0 && nx < this.size.width && ny >= 0 && ny < this.size.height) {
                    if (!visited.has(key)) {
                        let targetElement = document.getElementById(`cell-${nx}-${ny}`);

                        if (targetElement && targetElement.dataset.cellType === "path") {
                            visited.add(key);
                            targetElement.classList.add("visited");

                            let newPos = { x: nx, y: ny };

                            openSet.push({
                                pos: newPos,
                                path: [...currentPath, newPos],
                                h: getHeuristic(newPos, end) // Csak a cél távolságát becsüljük
                            });
                        }
                    }
                }
            });
        }
        console.log("Nem lehet eljutni a célhoz!");
    }
}