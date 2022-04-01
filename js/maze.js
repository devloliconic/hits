const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let sizeNode;
let matrix;
let n;
let beginCell = [-1, -1]
let endCell = [-1, -1]
let typeOfClick = 0; // 0 - place walls, 1 - begin cell, 2 - end cell

const checkBox = document.getElementById("checkBox");

document.getElementById("map").onclick = generateMap;
document.getElementById("generateMaze").onclick = function() {maze(beginCell, endCell)};
document.getElementById("alg").onclick = function() {A_star(beginCell, endCell)};

let slider = document.getElementById("myinput");
let output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

function generateMap(){
    n = Number(document.getElementById("myinput").value);//get input
    console.log(n);
    context.clearRect(0, 0, 500, 500);
    context.beginPath();
    //sizeNode = Math.floor(500/n);
    sizeNode = 500 / n;
    matrix = getMatrix(n, 0);
    console.log(sizeNode)

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
    document.getElementById("beginCell").onclick = function (){typeOfClick = 1;};
    document.getElementById("endCell").onclick = function (){typeOfClick = 2;};
    document.getElementById("walls").onclick = function (){typeOfClick = 0;};
}

function maze(start, end = [-1, -1]){
    if (JSON.stringify(start) === JSON.stringify([-1, -1])){
        alert("Установите начальную клетку!");
        return;
    }

    let visited = getMatrix(n, 0);
    let unVisitedCells = n * n;

    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            if (!((i === start[0] && j === start[1])|| (i === end[0] && j === end[1]))){//
                matrix[i][j] = 1;
                context.fillStyle="#000000";
                context.fillRect(j * sizeNode, i * sizeNode, sizeNode, sizeNode);
            }
        }
    }

    let stack = [];
    let current = start;
    visited[current[0]][current[1]] = 1;

    while (unVisitedCells){
        let neighbours = [];

        let curX = current[0];
        let curY = current[1];
        if (curX + 2 < n && !visited[curX + 2][curY]){
            neighbours.push([curX + 2, curY]);
        }
        if (curY + 2 < n && !visited[curX][curY + 2]){
            neighbours.push([curX, curY + 2]);
        }
        if (curX - 2 >= 0 && !visited[curX - 2][curY]){
            neighbours.push([curX - 2, curY]);
        }
        if (curY - 2 >= 0 && !visited[curX][curY - 2]){
            neighbours.push([curX, curY - 2]);
        }

        if (neighbours.length){
            stack.push(current);
            let currentNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            let differenceX = (currentNeighbour[0] - curX) / 2;
            let differenceY = (currentNeighbour[1] - curY) / 2;

            matrix[currentNeighbour[0]][currentNeighbour[1]] = 0;
            matrix[curX + differenceX][curY + differenceY] = 0;
            context.fillStyle="#ffffff";
            context.fillRect(currentNeighbour[1] * sizeNode + 0.5, currentNeighbour[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            context.fillRect((curY + differenceY) * sizeNode + 0.5,(curX + differenceX) * sizeNode + 0.5,  sizeNode - 1, sizeNode - 1);
            visited[currentNeighbour[0]][currentNeighbour[1]] = 1;
            unVisitedCells--;
            current = currentNeighbour;
        }
        else{
            if (stack.length){
                current = stack.shift();
            }
            else break;
        }
    }

    if (end[0] !== -1 && end[1] !== -1){
        context.fillStyle="#ff0216";
        context.fillRect(end[1] * sizeNode + 0.5, end[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
    }
}

function mouseClick(e){
    let clientX = e.pageX - e.target.offsetLeft;
    let clientY = e.pageY - e.target.offsetTop;

    let i = Math.floor(clientX / sizeNode);
    let j = Math.floor(clientY / sizeNode);

    console.log(`x:${clientX}, y:${clientY}`, i, j);
    let cellX = i * sizeNode;
    let cellY = j * sizeNode;
    switch (typeOfClick){
        case 0:
            if (beginCell[0] === j && beginCell[1] === i){
                beginCell = [-1, -1];
            }

            if (endCell[0] === j && endCell[1] === i){
                endCell = [-1, -1];
            }

            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            }
            else {
                matrix[j][i] = 1;
                context.fillStyle="#000000";
                context.fillRect(cellX, cellY, sizeNode, sizeNode);
            }
            break;

        case 1:
            if (JSON.stringify(beginCell) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(beginCell[1] * sizeNode + 0.5, beginCell[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            }

            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            }

            if (JSON.stringify([j, i]) === JSON.stringify(endCell)){
                context.fillStyle="#ffffff";
                context.fillRect(endCell[1] * sizeNode + 0.5, endCell[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
                endCell = [-1, -1];
            }

            context.fillStyle="#0cfa00";
            context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            beginCell[0] = j;
            beginCell[1] = i;
            break;

        case 2:
            console.log(matrix[j][i]);
            if (JSON.stringify(endCell) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(endCell[1] * sizeNode + 0.5, endCell[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            }

            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            }

            if (JSON.stringify([j, i]) === JSON.stringify(beginCell)){
                context.fillStyle="#ffffff";
                context.fillRect(beginCell[1] * sizeNode + 0.5, beginCell[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
                beginCell = [-1, -1];
            }

            context.fillStyle="#ff0216";
            context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            endCell[0] = j;
            endCell[1] = i;
            break;
    }

}

function getMatrix(n, fill) {
    let matrix = new Array(n);
    for (let i = 0; i < n; i++) {
        matrix[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            matrix[i][j] = fill;
        }
    }
    return matrix;
}

function PriorityQueue() { // input: [[x, y], priority]
    let array = [];

    this.enqueue = function(element) {
        if (this.isEmpty()) {
            array.push(element);
        }
        else {
            let added = false
            for (let i = 0; i < array.length; i++) {
                if (element[1] < array[i][1]) {
                    array.splice(i, 0, element);
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

    this.isEmpty = function() {
        return array.length === 0;
    }

    this.size = function() {
        return array.length;
    }
}

function heuristicFunc(current, end, type){
    if (type){
        return 2 * Math.sqrt(Math.pow(current[0] - end[0], 2) + Math.pow(current[1] - end[1], 2));
    }
    else{
        return 2 * Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
    }
}

function unVisitedNeighbours(current, matrix, costTo){
    let neighbours = [];
    let curX = current[0];
    let curY = current[1];
    if (curX + 1 < n && !matrix[curX + 1][curY] && costTo[curX + 1][curY] === -1){
        neighbours.push([curX + 1, curY]);
    }
    if (curY + 1 < n && !matrix[curX][curY + 1] && costTo[curX][curY + 1] === -1){
        neighbours.push([curX, curY + 1]);
    }
    if (curX - 1 >= 0 && !matrix[curX - 1][curY] && costTo[curX - 1][curY] === -1){
        neighbours.push([curX - 1, curY]);
    }
    if (curY - 1 >= 0 && !matrix[curX][curY - 1] && costTo[curX][curY - 1] === -1){
        neighbours.push([curX, curY - 1]);
    }
    return neighbours
}

function wait(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

async function A_star(start, end){
    let typeOfHeuristic = checkBox.checked;
    if (JSON.stringify(start) === JSON.stringify([-1, -1])){
        alert("Установите начальную клетку!");
        return;
    }

    if (JSON.stringify(end) === JSON.stringify([-1, -1])){
        alert("Установите конечную клетку!");
        return;
    }

    let queue = new PriorityQueue();
    let costTo = getMatrix(n, -1);

    costTo[start[0]][start[1]] = 0;

    let parent = new Array(n);
    for (let i = 0; i < n; i++) {
        parent[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            parent[i][j] = new Array(2);
            parent[i][j][0] = -1;
            parent[i][j][1] = -1;
        }
    }

    queue.enqueue([start, heuristicFunc(start, end, typeOfHeuristic)])
    while (!queue.isEmpty()){
        let current = queue.dequeue()
        let curX = current[0][0];
        let curY = current[0][1];
        if (curX === end[0] && curY === end[1]){
            console.log(current[0][0], current[0][1])
            break;
        }

        let neighbours = unVisitedNeighbours([curX, curY], matrix, costTo);
        for (let i = 0; i < neighbours.length; ++i){
            let currentNeighbour = neighbours[i];
            let currentNeighbourX = neighbours[i][0];
            let currentNeighbourY = neighbours[i][1];

            await wait(100);
            context.fillStyle = "#FFC567FF";
            context.fillRect(currentNeighbourY * sizeNode + 1, currentNeighbourX * sizeNode + 1, sizeNode - 2, sizeNode - 2);

            if (costTo[currentNeighbourX][currentNeighbourY] === -1 || costTo[curX][curY] + 1 < costTo[currentNeighbourX][currentNeighbourY]){
                parent[currentNeighbourX][currentNeighbourY][0] = curX;
                parent[currentNeighbourX][currentNeighbourY][1] = curY;
                costTo[currentNeighbourX][currentNeighbourY] = costTo[curX][curY] + 1;
                queue.enqueue([currentNeighbour, costTo[currentNeighbourX][currentNeighbourY] + heuristicFunc(currentNeighbour, end, typeOfHeuristic)])
            }
        }

    }

    if (JSON.stringify(parent[end[0]][end[1]]) !== JSON.stringify([-1, -1])){
        let current = parent[end[0]][end[1]];
        let counter = 0;
        while (current[0] !== -1 && current[1] !== -1){
            counter++;
            context.fillStyle = "#06d9fd";
            context.fillRect(current[1] * sizeNode + 0.5, current[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            current = parent[current[0]][current[1]];
        }

        context.fillStyle="#ff0216";
        context.fillRect(end[1] * sizeNode + 0.5, end[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
        context.fillStyle="#0cfa00";
        context.fillRect(start[1] * sizeNode + 0.5, start[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);

        counter--;
        alert("Длина пути = " + counter)
    }
    else{
        alert("НЕТ ПУТИ :(")
    }
}