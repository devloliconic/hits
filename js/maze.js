const SIZE = 10;
const PAD = 5;
const WALL_COLOR = "black";
const CELL_COLOR = "white";
const BACKGROUND_COLOR = "gray";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

document.getElementById("mybutton").onclick = generateMap;

let sizeNode;
let matrix;
let n;
let beginCell = [-1, -1]
let endCell = [-1, -1]
let typeOfClick = 0; // 0 - place walls, 1 - begin cell, 2 - end cell

document.getElementById("alg").onclick = function() { A_star(beginCell, endCell) };

function generateMap(){
    n = Number(document.getElementById("myinput").value);//get input

    console.log(n);
    context.clearRect(0, 0, 500, 500);
    context.beginPath();
    sizeNode = Math.floor(500/n);
    matrix = getMatrix(n);

    console.log("-->  " + sizeNode + "  " + Number.isInteger(sizeNode));

    let x = 0;
    let y = 0;
    for (let i = 0; i <= n; i++) {
        context.moveTo(x, 0);
        context.lineTo(x, sizeNode * n);
        x += sizeNode;
    }

    for (let i = 0; i <= n; i++) {
        context.moveTo(0, y);
        context.lineTo(sizeNode * n, y);
        y += sizeNode;
    }

    context.stroke();
    canvas.addEventListener('click', mouseClick);
    document.getElementById("beginCell").onclick = btn1;
    document.getElementById("endCell").onclick = btn2;
    document.getElementById("walls").onclick = btn3;
}
function btn1(){
    typeOfClick = 1;
}
function btn2(){
    typeOfClick = 2;
}
function btn3(){
    typeOfClick = 0;
}

function mouseClick(e){
    let clientX = e.pageX - e.target.offsetLeft;
    let clientY = e.pageY - e.target.offsetTop;
    let i = Math.floor(clientX / sizeNode);
    let j = Math.floor(clientY / sizeNode);
    console.log(`x:${clientX}, y:${clientY}`);
    let cellX = Math.floor(clientX / sizeNode) * sizeNode;
    let cellY = Math.floor(clientY / sizeNode) * sizeNode;
    if (typeOfClick === 0){
        if (matrix[i][j]){
            matrix[i][j] = 0;
            context.fillStyle="#ffffff";
            context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
        }
        else {
            matrix[i][j] = 1;
            context.fillStyle="#000000";
            context.fillRect(cellX, cellY, sizeNode, sizeNode);
        }
    }
    if (typeOfClick === 1){
        if (JSON.stringify(beginCell) !== JSON.stringify([-1, -1])){
            context.fillStyle="#ffffff";
            context.fillRect(beginCell[0] * sizeNode + 0.5, beginCell[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
        }
        context.fillStyle="#0cfa00";
        context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
        beginCell[0] = i;
        beginCell[1] = j;
    }

    if (typeOfClick === 2){
        if (JSON.stringify(endCell) !== JSON.stringify([-1, -1])){
            context.fillStyle="#ffffff";
            context.fillRect(endCell[0] * sizeNode + 0.5, endCell[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
        }
        context.fillStyle="#ff0216";
        context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
        endCell[0] = i;
        endCell[1] = j;
    }
}

function getMatrix(a) {
    let matrix = new Array(a);
    for (let i = 0; i < a; i++) {
        matrix[i] = new Array(a);
    }
    for (let i = 0; i < a; ++i){
        for (let j = 0; j < a; ++j){
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function PriorityQueue() { // input: [[x, y], priority]
    let array = [];

    this.print = function() {
        console.log(array);
    }

    this.enqueue = function(element) {
        if (this.isEmpty()) {
            array.push(element);
        } else {
            let added = false
            for (let i = 0; i < array.length; i++) {
                if (element[1] < array[i][1]) {
                    console.log(array);
                    array.splice(i, 0, element);
                    console.log(array);
                    added = true;
                    break;
                }
            }
            if (!added) {
                array.push(element);
            }
        }
    }

    this.dequeue = function() {
        return array.shift();
    }

    this.front = function() {
        return array[0];
    }

    this.isEmpty = function() {
        return array.length === 0;
    }

    this.size = function() {
        return array.length;
    }
}

function heuristicFunc(current, end){
    return Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
}

function unVisitedNeighbours(current, visited){
    let neighbours = []
    let curX = current[0];
    let curY = current[1];
    if (curX + 1 < n && !visited[curX + 1][curY] && !matrix[curX + 1][curY]){
        neighbours.push([curX + 1, curY]);
    }
    if (curY + 1 < n && !visited[curX][curY + 1] && !matrix[curX][curY + 1]){
        neighbours.push([curX, curY + 1]);
    }
    if (curX - 1 >= 0 && !visited[curX - 1][curY] && !matrix[curX - 1][curY]){
        neighbours.push([curX - 1, curY]);
    }
    if (curY - 1 >= 0 && !visited[curX][curY - 1]&& !matrix[curX][curY - 1]){
        neighbours.push([curX, curY - 1]);
    }
    return neighbours
}

function A_star(start, end){
    if (JSON.stringify(start) === JSON.stringify([-1, -1])){
        alert("Установите начальную клетку!");
        return;
    }

    if (JSON.stringify(end) === JSON.stringify([-1, -1])){
        alert("Установите конечную клетку!");
        return;
    }

    let queue = new PriorityQueue();
    let visited = getMatrix(n);
    let costTo = getMatrix(n);

    let parent = new Array(n);
    for (let i = 0; i < n; i++) {
        parent[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            parent[i][j] = [-1, -1];
        }
    }
    queue.enqueue([[start[0], start[1]], heuristicFunc(start, end)])
    visited[start[0]][start[1]] = 1;

    while (!queue.isEmpty()){
        let current = queue.dequeue()
        let curX = current[0][0];
        let curY = current[0][1];
        if (JSON.stringify(current[0]) === JSON.stringify(end)){
            break;
        }

        let neighbours = unVisitedNeighbours([curX, curY], visited);
        for (let i = 0; i < neighbours.length; ++i){
            let currentNeighbour = neighbours[i];
            let currentNeighbourX = neighbours[i][0];
            let currentNeighbourY = neighbours[i][1];
            context.fillStyle = "#FFC567FF";
            context.fillRect(currentNeighbourX * sizeNode + 0.5, currentNeighbourY * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);

            if (!visited[currentNeighbourX][currentNeighbourY] || costTo[curX][curY] + 1 < costTo[currentNeighbourX][currentNeighbourY]){
                parent[currentNeighbourX][currentNeighbourY] = [curX, curY];
                costTo[currentNeighbourX][currentNeighbourY] = costTo[curX][curY] + 1;
            }
            if (!visited[currentNeighbourX][currentNeighbourY]){
                queue.enqueue([currentNeighbour, costTo[currentNeighbourX][currentNeighbourY] + heuristicFunc(currentNeighbour, end)])
                visited[currentNeighbourX][currentNeighbourY] = 1;
            }
        }


    }

    if (JSON.stringify(parent[end[0]][end[1]]) !== JSON.stringify([-1, -1])){
        let current = end;
        while (JSON.stringify(current) !== JSON.stringify([-1, -1])){
            context.fillStyle = "#06d9fd";
            context.fillRect(current[0] * sizeNode + 0.5, current[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            current = parent[current[0]][current[1]];
        }
        context.fillStyle="#ff0216";
        context.fillRect(end[0] * sizeNode + 0.5, end[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
        context.fillStyle="#0cfa00";
        context.fillRect(start[0] * sizeNode + 0.5, start[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
    }
    else{
        alert("НЕТ ПУТИ :(")
    }

}