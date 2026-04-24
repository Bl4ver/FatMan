export class Labyrinth {
    constructor(engine) {
        this.engine = engine;
        this.size = { width: 30, height: 31 }// --> legjobb ha a height páratlan, a width pedig MINDIG páros
    }

    init() {
    }

    generate() {
        let labyrinth = document.getElementById("labyrinth");
        labyrinth.innerHTML = '';

        let height = this.size.height;
        let fullWidth = this.size.width;
        let halfWidth = fullWidth / 2;

        labyrinth.style.gridTemplateColumns = `repeat(${fullWidth}, 1fr)`;
        labyrinth.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        // Pálya fele
        let leftMap = [];
        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < halfWidth; x++) {
                row.push(1); // 1 = Fal
            }
            leftMap.push(row);
        }

        // "Vakond"
        let stack = [];
        let startX = 1;
        let startY = 1;
        leftMap[startY][startX] = 0; // 0 = Út
        stack.push({ x: startX, y: startY });

        while (stack.length > 0) {
            let current = stack[stack.length - 1];

            // A 4 irány
            let dirs = [
                { x: 0, y: -2 },
                { x: 0, y: 2 },
                { x: -2, y: 0 },
                { x: 2, y: 0 }];

            dirs.sort(() => Math.random() - 0.5);

            let carved = false;
            for (let dir of dirs) {
                let nx = current.x + dir.x;
                let ny = current.y + dir.y;

                // Ha a pályán belül vagyunk ÉS az a célpont még tömör fal:
                if (nx > 0 && nx < halfWidth && ny > 0 && ny < height - 1 && leftMap[ny][nx] === 1) {
                    leftMap[ny][nx] = 0;
                    // Kiássuk a KETTŐ KÖZÖTTI falat
                    leftMap[current.y + dir.y / 2][current.x + dir.x / 2] = 0;

                    stack.push({ x: nx, y: ny });
                    carved = true;
                    break;
                }
            }

            // Ha beszorultunk (nincs hova ásni), lépjünk vissza
            if (!carved) {
                stack.pop();
            }
        }

        // Hurkok létrehozása és zsákutcák eltüntetése
        for (let y = 1; y < height - 1; y++) {
            // A ciklust halfWidth - 1 -ig futtatjuk, hogy a közepét ne basztassuk
            for (let x = 1; x < halfWidth - 1; x++) {
                
                // Ha az aktuális mező egy FAL
                if (leftMap[y][x] === 1) {
                    
                    // Lekérjük a 4 közvetlen szomszéd állapotát
                    let top = leftMap[y - 1][x];
                    let bottom = leftMap[y + 1][x];
                    let left = leftMap[y][x - 1];
                    let right = leftMap[y][x + 1];

                    // Megszámoljuk, összesen hány út (0) veszi körül a falat
                    let pathCount = 0;
                    if (top === 0) pathCount++;
                    if (bottom === 0) pathCount++;
                    if (left === 0) pathCount++;
                    if (right === 0) pathCount++;

                    // Megnézzük, hogy ez a fal két folyosót választ-e el szabályosan
                    let horizontalPath = (left === 0 && right === 0);
                    let verticalPath = (top === 0 && bottom === 0);

                    // Csak akkor bontunk, ha PONTOSAN 2 út van körülötte, 
                    if (pathCount === 2 && (horizontalPath || verticalPath)) {
                        
                        // 15% eséllyel kilyukasztjuk
                        if (Math.random() < 0.4) {
                            leftMap[y][x] = 0; // Keresztutca létrejött!
                        }
                    }
                }
            }
        }

        // Középső átjáró kilyukasztása
        let randomTunnels = Math.floor(Math.random() * (height - 2)) + 1;
        for (let x = 0; x < randomTunnels; x++) {

            let possibleOddRows = Math.floor((height - 2) / 2); // 21 magas pályánál ez 9 lehetőség
            let randomYPos = Math.floor(Math.random() * possibleOddRows) * 2 + 1;

            // Kilyukasztjuk az átjárót a középső vonalnál
            leftMap[randomYPos][halfWidth - 1] = 0;
            leftMap[randomYPos][halfWidth - 2] = 0;
        }

        this.createGhostHouse(leftMap, halfWidth, height);

        // HTML Div-eket genrelásása, a letükrözött jobb oldallal
        for (let y = 0; y < height; y++) {
            // A) BAL OLDAL
            for (let x = 0; x < halfWidth; x++) {
                let tileType = leftMap[y][x];
                this.createDivCell(labyrinth, x, y, tileType);
            }

            // B) JOBB OLDAL (Tükrözve)
            for (let x = 0; x < halfWidth; x++) {
                let currentX = halfWidth + x;
                let sourceX = halfWidth - 1 - x;
                let tileType = leftMap[y][sourceX];
                this.createDivCell(labyrinth, currentX, y, tileType);
            }
        }

        this.breadthFirstSearch({ x: 1, y: 1 }, { x: fullWidth - 2, y: height - 2 });
    }

    // A HTML elemeket legyártó segédfüggvény
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

    // Szellem helyet megcsináló segédfüggvény (Csak a bal felet építi meg)
    createGhostHouse(leftMap, halfWidth, height) {
        let midY = Math.floor(height / 2); // 21 magasságnál ez 10
        let rightEdge = halfWidth - 1;     // 11 szélességnél ez a 10-es index (a tükrözési vonal)

        // A Szellemház méretei és koordinátái
        let houseTop = midY - 2;
        let houseBottom = midY + 2;
        let houseLeft = rightEdge - 3;

        // Töröljük a területet a ház körül, hogy körbe lehessen járni!
        for (let y = houseTop - 1; y <= houseBottom + 1; y++) {
            for (let x = houseLeft - 1; x <= rightEdge; x++) {
                if (y > 0 && y < height - 1 && x > 0) {
                    leftMap[y][x] = 0; // Sima út a ház körül
                }
            }
        }

        // Falak és a belső üreg
        for (let y = houseTop; y <= houseBottom; y++) {
            for (let x = houseLeft; x <= rightEdge; x++) {
                
                // Ha a ház bal szélén, alsó szélén, vagy a felső szélén vagyunk
                if (x === houseLeft || y === houseBottom || (y === houseTop && x < rightEdge)) {
                    leftMap[y][x] = 1; // Fal
                } 
                // A ház belseje
                else {
                    leftMap[y][x] = 0; // Üres tér a szellemeknek (később ide spawnolnak)
                }
            }
        }

        // A felső fal jobb széle. Amikor tükröződik, ez egy 2 blokk széles ajtó lesz pont középen!
        leftMap[houseTop][rightEdge] = 2; // 2 = Ajtó
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

        console.log(`Ennyi ideig tartott: ${new Date - timer} ms`)
    }


}