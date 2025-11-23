function renderCanvas(id, width, height, gap, GRID) {
    var c = document.getElementById(id);
    c.width = width+gap*GRID.length
    c.height = height+GRID[0].length
    var ctx = c.getContext("2d");
    var sqwidth = width / GRID.length; var sqheight = height / GRID[0].length
    for (i=0;i<GRID.length;i++) {
        for (j=0;j<GRID[i].length;j++) {
            var currentsq = GRID[i][j];
            if (currentsq.covered) {ctx.fillStyle = "gray"} else {ctx.fillStyle = "red"}
            ctx.fillRect(currentsq.x*(sqwidth+gap),currentsq.y*(sqheight+gap), sqwidth, sqheight);
        }
    }
}
function createGrid (width, height) {
    var retgrid = []
    for (i=0;i<width;i++) {
        retgrid.push([])
        for (j=0;j<height;j++) {
            retgrid[i].push({'covered':true,'isMine':false,'x':i,'y':j})
        }
    }
    return retgrid
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
}
maingrid = createGrid(10,10)
function drawAll() { 
    renderCanvas("maincanvas", 500, 500, 1, maingrid)
    requestAnimationFrame(drawAll)
}
setupInput("maincanvas", 500, 500, 1, maingrid)
drawAll()