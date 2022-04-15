/* Привет, ты на коде страницы task5. скрипт подключен к html*/ 


var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
sizeNode = 100;

for(let i=0;i<500;i+=sizeNode){
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 500); 
}
for (let i = 0; i <= 500; i+=sizeNode) {
    ctx.moveTo(0, i);
    ctx.lineTo(500, i);
}
ctx.strokeStyle = "#000";
ctx.stroke();

canvas.addEventListener('click', mouseClick);
let matrix = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];

function mouseClick(e){
    let clientX = e.pageX - e.target.offsetLeft;
    let clientY = e.pageY - e.target.offsetTop;

    let i = Math.floor(clientX / sizeNode);
    let j = Math.floor(clientY / sizeNode);

    console.log(`x:${clientX}, y:${clientY}`, i, j);
    let cellX = i * sizeNode;
    let cellY = j * sizeNode;
    if(matrix[j][i]===1){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(cellX+0.5,cellY+0.5,sizeNode-1,sizeNode-1);
        ctx.stroke();
        ctx.fill();
        matrix[j][i] = 0;
    }
    else{
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(cellX+0.5,cellY+0.5,sizeNode-1,sizeNode-1);
        ctx.stroke();
        ctx.fill(); 
        matrix[j][i] = 1;
    }
}

