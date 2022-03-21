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

            context.fillStyle="#0cfa00";
            context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            beginCell[0] = j;
            beginCell[1] = i;
            break;

        case 2:
            if (JSON.stringify(endCell) !== JSON.stringify([-1, -1])){
                context.fillStyle="#ffffff";
                context.fillRect(endCell[0] * sizeNode + 0.5, endCell[1] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            }
            if (matrix[j][i]){
                matrix[j][i] = 0;
                context.fillStyle="#ffffff";
                context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            }
            context.fillStyle="#ff0216";
            context.fillRect(cellX + 0.5, cellY + 0.5, sizeNode - 1, sizeNode - 1);
            endCell[0] = j;
            endCell[1] = i;
            break;
    }

}

function getMatrix(n) {
    let matrix = new Array(n);
    for (let i = 0; i < n; i++) {
        matrix[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function PriorityQueue() { // input: [[x, y], priority]
    let array = [];

    this.print = function() {
        let outPut = "";
        for (let i = 0; i < array.length; ++i){
            outPut += array[i][0][0] + " " + array[i][0][1] + " " + array[i][1] + "   ";
        }
        console.log(outPut);
    }

    this.enqueue = function(element) {
        if (this.isEmpty()) {
            array.push(element);
        } else {
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
    return 2 * Math.sqrt(Math.pow(current[0] - end[0], 2) + Math.pow(current[1] - end[1], 2));
    //return Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
}

function unVisitedNeighbours(current, costTo){
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
    if (JSON.stringify(start) === JSON.stringify([-1, -1])){
        alert("Установите начальную клетку!");
        return;
    }

    if (JSON.stringify(end) === JSON.stringify([-1, -1])){
        alert("Установите конечную клетку!");
        return;
    }
    console.log(start, end)
    let queue = new PriorityQueue();
    let costTo = new Array(n);

    for (let i = 0; i < n; i++) {
        costTo[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            costTo[i][j] = -1;
        }
    }
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
    queue.enqueue([start, heuristicFunc(start, end)])
    while (!queue.isEmpty()){
        let current = queue.dequeue()
        let curX = current[0][0];
        let curY = current[0][1];
        if (curX === end[0] && curY === end[1]){
            // parent[end[0]][end[1]][0] = curX;
            // parent[end[0]][end[1]][1] = curY;
            console.log(current[0][0], current[0][1])
            break;
        }

        let neighbours = unVisitedNeighbours([curX, curY], costTo);
        for (let i = 0; i < neighbours.length; ++i){
            let currentNeighbour = neighbours[i];
            let currentNeighbourX = neighbours[i][0];
            let currentNeighbourY = neighbours[i][1];

            await wait(150);
            context.fillStyle = "#FFC567FF";
            context.fillRect(currentNeighbourY * sizeNode + 1, currentNeighbourX * sizeNode + 1, sizeNode - 2, sizeNode - 2);

            if (costTo[currentNeighbourX][currentNeighbourY] === -1 || costTo[curX][curY] + 1 < costTo[currentNeighbourX][currentNeighbourY]){
                parent[currentNeighbourX][currentNeighbourY][0] = curX;
                parent[currentNeighbourX][currentNeighbourY][1] = curY;
                console.log(curX, curY, currentNeighbourX, currentNeighbourY + " !!!!")
                costTo[currentNeighbourX][currentNeighbourY] = costTo[curX][curY] + 1;
                queue.enqueue([currentNeighbour, costTo[currentNeighbourX][currentNeighbourY] + heuristicFunc(currentNeighbour, end)])
            }
        }

    }

    let output = "";
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            output += "[" + parent[i][j] + "]" + " ";
        }
        output += "\n"
    }
    console.log(output)

    if (JSON.stringify(parent[end[0]][end[1]]) !== JSON.stringify([-1, -1])){
        let current = parent[end[0]][end[1]];
        while (current[0] !== -1 && current[1] !== -1){
            context.fillStyle = "#06d9fd";
            context.fillRect(current[1] * sizeNode + 0.5, current[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
            current = parent[current[0]][current[1]];
        }

        context.fillStyle="#ff0216";
        context.fillRect(end[1] * sizeNode + 0.5, end[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
        context.fillStyle="#0cfa00";
        context.fillRect(start[1] * sizeNode + 0.5, start[0] * sizeNode + 0.5, sizeNode - 1, sizeNode - 1);
    }
    else{
        alert("НЕТ ПУТИ :(")
    }
}