const SIZE = 10;
const PAD = 5;
const WALL_COLOR = "black";
const CELL_COLOR = "white";
const BACKGROUND_COLOR = "gray";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

document.getElementById("mybutton").onclick = click;

function click(){
    //get input
    let a = Number(document.getElementById("myinput").value);
    console.log(a);
    const COLUMNS = a;
    const ROWS = a;   
    // canvas.width = PAD * 2 + COLUMNS * SIZE;
    // canvas.height = PAD * 2 + ROWS  * SIZE;
    context.clearRect(0, 0, 500, 500)
    context.beginPath();

    const sizeNode = Math.floor(500/a);

    // if (!Number.isInteger(sizeNode)){
    //     canvas.width = Math.round(sizeNode * a) + 5
    //     canvas.height = Math.round(sizeNode * a) + 5
    // }

    console.log("-->  " + sizeNode + "  " + Number.isInteger(sizeNode))

    for (let x = 0; x <= 500; x += sizeNode) {
        context.moveTo(x, 0);
        context.lineTo(x, sizeNode * a);
    }

    for (let y = 0; y <= 500; y += sizeNode) {
        context.moveTo(0, y);
        context.lineTo(sizeNode * a, y);
    }

    //context.strokeStyle = "#888";
    context.stroke();

    /*
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = BACKGROUND_COLOR;
    context.fill();*/

}

const matrix = getMatrix(COLUMNS, ROWS);
const eraser = {
    x: 0, y: 0,
};

function getMatrix(columns, rows) {
    const matrix = [];

    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < columns; x++) {
            row.push(false);
        }
        matrix.push(row);
    }
    return matrix;
}

/*function drawMaze() {
    canvas.width = PAD * 2 + COLUMNS * SIZE;
    canvas.height = PAD * 2 + ROWS  * SIZE;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = BACGROUND_COLOR;
    context.fill();

}
*/