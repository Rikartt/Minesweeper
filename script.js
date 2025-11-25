const imgcache = {} //image cache so it doesnt get super cluttered
//let numberwidth = 0.61803398875*sqheight*5/7; let numberheight = 0.61803398875*sqheight; let numberoffsetx = (sqwidth - numberwidth)/2; let numberoffsety = (sqheight - numberheight)/2
function initimg (name,width,height) {
    if (!imgcache[name]) {
                imgcache[name] = new Image(width, height)
                imgcache[name].src = `sprites/${name}.png`;
    }
}
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
        }
        
    }
}
function createEmptyGrid (width, height) {
    var retgrid = []
    for (i=0;i<width;i++) {
        retgrid.push([])
        for (j=0;j<height;j++) {
            retgrid[i].push({'covered':true,'isMine':false,'mineCount':0,'x':i,'y':j});
        }
    }
    return retgrid
}
function randomizeGrid (grid, minePercent) {
    var mineCount = Math.floor(grid.length * grid[0].length * minePercent)
    for (let m=0;m<mineCount;) {
        var i = Math.floor(Math.random()*grid.length);var j = Math.floor(Math.random()*grid[0].length); var sq = {x: i, y: j};
        if (!grid[sq.x][sq.y].isMine) {
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
function toggleCover(grid) { //debugging that uncovers all covered and covers all uncovered
    for (let row of grid) {
        for (let obj of row) {
            obj.covered = !obj.covered;
        }
    }
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
        getMouse(event);
        var tileX = Math.floor(mouseX / sqwidth); var tileY = Math.floor(mouseY / sqheight);
        console.log(mouseX,";",mouseY, "-",tileX,";",tileY)
        GRID[tileX][tileY].covered = !GRID[tileX][tileY].covered;
    });
    document.addEventListener('keypress', (event) => {
        if (debugMode) {
            if (event.key == 'u') {
                toggleCover(maingrid)
            }
        }
    });
}
let debugMode = true
maingrid = createEmptyGrid(10,10)
randomizeGrid(maingrid, 0.35)
updateGrid(maingrid)
initCanvas("maincanvas", 500, 500, 1, maingrid)
function drawAll() { 
    renderCanvas("maincanvas", 500, 500, 1, maingrid)
    requestAnimationFrame(drawAll)
}
setupInput("maincanvas", 500, 500, 1, maingrid)
drawAll()