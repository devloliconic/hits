const SIZE = 10;
const PAD = 5;
const WALL_COLOR = "black";
const CELL_COLOR = "white";
const BACGROUND_COLOR = "gray";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");


document.getElementById("mybutton").onclick = click;

function click(){
    //get input 
    let a = Number(document.getElementById("myinput").value);
    console.log(a);
    const COLUMNS = a;
    const ROWS = a;   
    canvas.width = PAD * 2 + COLUMNS * SIZE;
    canvas.height = PAD * 2 + ROWS  * SIZE;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = BACGROUND_COLOR;
    context.fill();

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