const imgcache = {} //image cache so it doesnt get super cluttered
//let numberwidth = 0.61803398875*sqheight*5/7; let numberheight = 0.61803398875*sqheight; let numberoffsetx = (sqwidth - numberwidth)/2; let numberoffsety = (sqheight - numberheight)/2
function initimg (name,width,height) {
    if (!imgcache[name]) {
                imgcache[name] = new Image(width, height)
                imgcache[name].src = `sprites/${name}.png`;
    }
}
function renderTime (ms) {
    let minutes = Math.floor(ms/60000)
    let seconds = Math.floor((ms-minutes*60000)/1000)
    return `${minutes}:${seconds}`
}
function rangeAround(cy, variable) {
  return Array.from(
    { length: 2 * variable + 1 },
    (_, i) => cy - variable + i
  );
}
const PercentOfMines = 0.2
const startingareasize = 2
function drawImg(width, height, x, y, img, ctx) {
    let image = imgcache[img]
    if (image.complete) {
            ctx.drawImage(image, x, y, width, height);
            //console.log("drew image")
        } else {
            image.addEventListener("load", () => {
            ctx.drawImage(image, x, y, width, height);
        }, { once: true });
}
}
function initimgs() {
    for (i=0;i<10;i++) {
        initimg(i,5,7)
    }
    initimg('flag',16,16)
}
initimgs()
function initCanvas(id, width, height, gap, GRID) {
    var c = document.getElementById(id);
    c.width = width+gap*GRID.length
    c.height = height+GRID[0].length
    var ctx = c.getContext("2d");
    var sqwidth = width / GRID.length; var sqheight = height / GRID[0].length
    ctx.imageSmoothingEnabled = false;
}
function renderCanvas(id, width, height, gap, GRID) {
    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    var sqwidth = width / GRID.length; var sqheight = height / GRID[0].length
    ctx.imageSmoothingEnabled = false;
    for (i=0;i<GRID.length;i++) {
        for (j=0;j<GRID[i].length;j++) {
            var currentsq = GRID[i][j];
            if (currentsq.isMine) {ctx.fillStyle = "red"}
            else {ctx.fillStyle = "green"}
            let numberwidth = 0.61803398875*sqheight*5/7; let numberheight = 0.61803398875*sqheight; let numberoffsetx = (sqwidth - numberwidth)/2; let numberoffsety = (sqheight - numberheight)/2
            ctx.fillRect(currentsq.x*(sqwidth+gap),currentsq.y*(sqheight+gap), sqwidth, sqheight);
            if (currentsq.mineCount) {
                drawImg(numberwidth,numberheight,(i)*(gap+sqwidth)+numberoffsetx,(j)*(gap+sqheight)+numberoffsety,currentsq.mineCount,ctx)
            }
            if (currentsq.covered) {ctx.fillStyle = "gray"; ctx.fillRect(currentsq.x*(sqwidth+gap),currentsq.y*(sqheight+gap), sqwidth, sqheight);} 
            if (currentsq.flagged) {
                drawImg(numberwidth,numberheight,(i)*(gap+sqwidth)+numberoffsetx,(j)*(gap+sqheight)+numberoffsety,'flag',ctx)
            }
        }
        
    }
}
function createEmptyGrid (width, height) {
    var retgrid = []
    for (i=0;i<width;i++) {
        retgrid.push([])
        for (j=0;j<height;j++) {
            retgrid[i].push({'covered':true,'isMine':null,'mineCount':0,'uncoveredNeighbors':0,'x':i,'y':j,'flagged':false});
        }
    }
    return retgrid
}
function randomizeGrid (grid, minePercent) {
    var mineCount = Math.floor(grid.length * grid[0].length * minePercent) - startingareasize*startingareasize
    for (let m=0;m<mineCount;) {
        var i = Math.floor(Math.random()*grid.length);var j = Math.floor(Math.random()*grid[0].length); var sq = {x: i, y: j};
        if (grid[sq.x][sq.y].isMine == null) {
            grid[sq.x][sq.y].isMine = true
            m += 1
        }
    }
}
function updateGrid(grid) {
    for (let i=0;i<grid.length;i++) {
        for (let j=0;j<grid[0].length;j++) {
            grid[i][j].mineCount = findMineCount(grid,i,j)
        }
    }
}
function findMineCount (grid, cx, cy) {
    let xlist = [cx-1, cx, cx+1].filter((item) => grid.length>item && item>-1)
    let ylist = [cy-1, cy, cy+1].filter((item) => grid[0].length>item && item>-1)
    let count = 0
    if (grid[cx][cy].isMine) {return null} else {
        for (let i=0;i<xlist.length;i++) {
            for (let j=0;j<ylist.length;j++) {
                if (grid[xlist[i]][ylist[j]].isMine) {
                    count++
                }
            }
        }
    }
    return count
}
function findUncoveredCount (grid, cx, cy) { //Finds uncovered neighbor count for square at cx and cy, IMPORTANT: ONLY RUN ON UNCOVERED SQUARES FOR PERFORMANCE. MAYBE EVEN ONLY ZEROSQUARES.
    let xlist = [cx-1, cx, cx+1].filter((item) => grid.length>item && item>-1)
    let ylist = [cy-1, cy, cy+1].filter((item) => grid[0].length>item && item>-1)
    let count = 0
    if (grid[cx][cy].covered) {return null} else { //Safeguard to prevent this being used on covered squares.
        for (let i=0;i<xlist.length;i++) {
            for (let j=0;j<ylist.length;j++) {
                if (!grid[xlist[i]][ylist[j]].covered) {
                    count++
                }
            }
        }
    }
    return count
}
function firstClick (grid, cx, cy) { //what happens on the first click at the tile (cx, cy)
    let xlist = rangeAround(cx,Math.floor((startingareasize-1)/2)).filter((item) => grid.length>item && item>-1)
    let ylist = rangeAround(cy,Math.floor((startingareasize-1)/2)).filter((item) => grid[0].length>item && item>-1)
    for (let row of xlist) {
        for (let col of ylist) {
            grid[row][col].isMine = false
        }
    }
    randomizeGrid(maingrid, PercentOfMines)
    updateGrid(maingrid)
    GameState.startTime = Date.now()
    GameState.hadfirstclick = true
}
function toggleCover(grid) { //debugging that uncovers all covered and covers all uncovered
    for (let row of grid) {
        for (let obj of row) {
            obj.covered = !obj.covered;
        }
    }renderTime(GameState.elapsedTime)
}
function setupInput (id, width, height, gap, GRID) {
    var c = document.getElementById(id);
    c.width = width+gap*GRID.length
    c.height = height+GRID[0].length
    var sqwidth = c.width / (GRID.length); var sqheight = c.height / (GRID[0].length)
    console.log(c.width, "height", c.height)
    var ctx = c.getContext("2d");
    const getMouse = (e) => {
        const rect = c.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    };

    c.addEventListener('mousemove', getMouse);

    c.addEventListener('mousedown', (event) => {
        if (GameState.clicklock) {return}
        getMouse(event);
        var tileX = Math.floor(mouseX / sqwidth); var tileY = Math.floor(mouseY / sqheight);
        if (event.button === 0) {
            console.log(mouseX,";",mouseY, "-",tileX,";",tileY)
            if (!GameState.hadfirstclick) {firstClick(GRID,tileX,tileY)}
            GRID[tileX][tileY].covered = false;
            GRID[tileX][tileY].uncoveredNeighbors = findUncoveredCount(GRID, tileX,tileY)
            }
            console.log(GRID[tileX][tileY])
        if (event.button === 2) {
            console.log(mouseX,";",mouseY, "-",tileX,";",tileY)
            GRID[tileX][tileY].flagged = !GRID[tileX][tileY].flagged;
        }
    });
    c.addEventListener("contextmenu", (e) => {
        e.preventDefault(); //prevents context menu from popping up when right clicking
    });
    document.addEventListener('keypress', (event) => {
        if (debugMode) {
            if (event.key == 'u') {
                toggleCover(maingrid)
            }
        }
    });
    document.addEventListener("pointerdown", () => updateGameState(maingrid));
    document.addEventListener("keydown", () => updateGameState(maingrid));
}
function updateGameState (grid) {
    //search part
    let nonMineTiles = 0
    for (let i = 0;i<grid.length;i++) {
        for (let j=0;j<grid.length;j++) {
            let sq = grid[i][j]
            if (!sq.isMine && sq.covered) {
                nonMineTiles ++
            } else if (sq.isMine && !sq.covered) {
                GameState.lost = true
                break
            }
            if (sq.mineCount == 0 && !sq.covered && sq.uncoveredNeighbors<8) { //logic for when a 0-square is uncovered
                console.log("0square uncovered!")
                let xlist = [sq.x-1, sq.x, sq.x+1].filter((item) => grid.length>item && item>-1)
                let ylist = [sq.y-1, sq.y, sq.y+1].filter((item) => grid[0].length>item && item>-1)
                for (let q=0;q<xlist.length;q++) {
                    for (let p=0;p<ylist.length;p++) {
                        grid[xlist[q]][ylist[p]].covered = false;
                    }
                }
            }
        }
    }
    GameState.nonMineTilesLeft = nonMineTiles
    if (GameState.nonMineTilesLeft == 0) {
        GameState.won = true
    }
    if (GameState.won || GameState.lost) {GameState.clicklock = true;console.log("time:",renderTime(GameState.elapsedTime))}
    if (GameState.won) {console.log("You Win!")} else if (GameState.lost) {console.log("You Lose!")} else {
        GameState.elapsedTime = Date.now()-GameState.startTime;
    }
    //console.log(GameState)
}
let GameState = {
    "nonMineTilesLeft": 0,
    "won": false,
    "lost": false,
    "clicklock": false,
    "hadfirstclick": false,
    "startTime": 0,
    "elapsedTime": 0
}
let debugMode = true
maingrid = createEmptyGrid(7,7)
initCanvas("maincanvas", 500, 500, 1, maingrid)
function drawAll() { 
    renderCanvas("maincanvas", 500, 500, 1, maingrid)
    if (!GameState.won && !GameState.lost) {
        requestAnimationFrame(drawAll)
        updateGameState(maingrid)
    }
}
setupInput("maincanvas", 500, 500, 1, maingrid)
drawAll()