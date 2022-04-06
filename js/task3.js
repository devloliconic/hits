/* Привет, ты на коде страницы task3. скрипт подключен к html*/

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let vertexes = [];
let size = 500;
let lengthOfChromosome; // without start vertex in the end
let numberOfGenerations = 100000;
let chanceOfMutation = 30;

canvas.addEventListener('click', mouseClick);
document.getElementById("clear").onclick = clearFunc;
document.getElementById("start").onclick = geneticAlg;

context.moveTo(0, 0); // border for canvas
context.lineTo(size, 0);
context.moveTo(size, 0);
context.lineTo(size, size);
context.moveTo(0, 0);
context.lineTo(0, size);
context.moveTo(0, size);
context.lineTo(size, size);
context.stroke();

function clearFunc(){
    location.reload();
}

function mouseClick(e){
    let clientX = e.pageX - e.target.offsetLeft;
    let clientY = e.pageY - e.target.offsetTop;

    context.beginPath();
    if (vertexes.length >= 1){
        for(let vert of vertexes){
            let vertX = vert[0];
            let vertY = vert[1];

            let vector = [clientX - vertX , clientY - vertY];
            let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
            context.moveTo(vertX + vector[0] * 10 / s, vertY + vector[1] * 10 / s);

            context.lineTo(clientX, clientY);
            context.strokeStyle = "rgba(243,243,243,0.34)";
            context.stroke();
        }
    }

    context.beginPath();
    context.arc(clientX, clientY, 10, 0, 2*Math.PI, false);
    context.fillStyle = '#a8a1a1';
    context.fill();

    vertexes.push([clientX, clientY]);
}

function drawTheLines(from, to){
    for (let i = 0; i < from.length - 1; ++i){
        context.beginPath();
        let vector = [from[i + 1][0] - from[i][0] , from[i + 1][1] - from[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = 2;
        context.stroke();

        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgba(243,243,243,0.34)";
        context.lineWidth = 1;
        context.stroke()
    }
    for (let q = 0; q < to.length - 1; ++q){
        context.beginPath();
        let vector = [to[q + 1][0] - to[q][0] , to[q + 1][1] - to[q][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(to[q][0] + vector[0] * 10 / s, to[q][1] + vector[1] * 10 / s);
        context.lineTo(to[q + 1][0] - vector[0] * 10 / s, to[q + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(250,142,142)";
        context.lineWidth = 1;
        context.stroke();
    }

}

function drawFinishPath(bestPath, color){
    for (let i = 0; i < bestPath.length - 1; ++i){
        context.beginPath();
        let vector = [bestPath[i + 1][0] - bestPath[i][0] , bestPath[i + 1][1] - bestPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = 2;
        context.stroke();

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke()
    }
}

function redrawVertexes(){
    for (let i = 0; i < vertexes.length; ++i){
        context.beginPath();
        context.arc(vertexes[i][0], vertexes[i][1], 10, 0, 2*Math.PI, false);
        context.fillStyle = '#a8a1a1';
        context.fill();
    }
}

function shuffle(array) {
    let a = array.slice()
    for (let i = 0; i < vertexes.length - 1; ++i) {
        let r1 = randomNumber(1, vertexes.length - 1);
        let r2 = randomNumber(1, vertexes.length - 1);
        [a[r1], a[r2]] = [a[r2], a[r1]];
    }
    return a.slice();
}

function startPopulation(firstGeneration){
    let res = [];
    let buffer = firstGeneration.slice();
    buffer.push(distance(buffer));
    res.push(buffer.slice());

    for (let i = 0; i < vertexes.length * vertexes.length; ++i){
        buffer = firstGeneration.slice();
        buffer.shift()
        buffer = shuffle(buffer)
        buffer.unshift(firstGeneration[0].slice())
        buffer.push(distance(buffer));
        res.push(buffer.slice())
    }
    return res;
}

function addToPopulation(population, chromosome) {
    if (!population.length) {
        population.push(chromosome.slice());
    }
    else {
        let added = false
        for (let i = 0; i < population.length; ++i) {
            if (chromosome[chromosome.length - 1] < population[i][population[i].length - 1]) {
                population.splice(i, 0, chromosome);
                added = true;
                break;
            }
        }
        if (!added) {
            population.push(chromosome.slice());
        }
    }
}

function wait(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

function distance(chromosome){
    let ans = 0;
    for (let i = 0; i < chromosome.length - 1; ++i){
        ans += Math.sqrt(Math.pow(chromosome[i][0] - chromosome[i + 1][0], 2) + Math.pow(chromosome[i][1] - chromosome[i + 1][1], 2));
    }
    return ans;
}

function twoRandomNumbers(min, max){
    let a = Math.floor(Math.random() * (max - min) + min);
    let b = Math.floor(Math.random() * (max - min) + min);
    while (a === b){
        a = Math.floor(Math.random() * (max - min) + min);
    }
    return [a, b];
}

function randomNumber(min, max){
    return  Math.floor(Math.random() * (max - min) + min);
}

function cross(firstParent, secondParent){
    let child = []

    let breakPoint = randomNumber(0, lengthOfChromosome);
    for (let i = 0; i < breakPoint; ++i){
        child.push(firstParent[i]);
    }

    for (let i = breakPoint; i < lengthOfChromosome; ++i){
        if (child.indexOf(secondParent[i]) === -1){
            child.push(secondParent[i]);
        }
    }

    if (child.length !== lengthOfChromosome){
        for (let i = breakPoint; i < lengthOfChromosome; ++i){
            if (child.indexOf(firstParent[i]) === -1){
                child.push(firstParent[i]);
            }
        }
    }

    if (Math.random() * 100 < chanceOfMutation){
        let rand = twoRandomNumbers(1, lengthOfChromosome - 1);
        let i = rand[0], j = rand[1];
        [child[i], child[j]] = [child[j], child[i]];
    }

    child.push(firstParent[0]);
    child.push(distance(child));
    return child;
}

function crossingParents(firstParentWithDistance, secondParentWithDistance){
    let firstParent = firstParentWithDistance.slice(0, firstParentWithDistance.length - 1);
    let secondParent = secondParentWithDistance.slice(0, secondParentWithDistance.length - 1);

    let firstChild = cross(firstParent, secondParent);
    let secondChild = cross(firstParent, secondParent);

    if (firstChild.length > lengthOfChromosome + 2){
        console.log("First Child fail")
        console.log(firstChild);
        console.log(firstParent)
    }
    if (secondChild.length > lengthOfChromosome + 2){
        console.log("Second Child fail")
        console.log(secondChild);
        console.log(secondParent)
    }

    return [firstChild, secondChild];
}

async function geneticAlg(){
    let firstGeneration = [];
    let end = 800;

    for (let i = 0; i < vertexes.length; ++i){
        firstGeneration.push(vertexes[i]);
    }
    lengthOfChromosome = firstGeneration.length;
    firstGeneration.push(vertexes[0]);

    let population = startPopulation(firstGeneration);
    population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1]}));

    let bestChromosome = population[0].slice();

    drawFinishPath(bestChromosome, "rgb(250,142,142)")

    for(let i = 0; i < numberOfGenerations; ++i){

        if (end === 0){
            drawFinishPath(bestChromosome, "rgb(142,250,142)")
            break;
        }

        population = population.slice(0, vertexes.length * vertexes.length);
        for (let j = 0; j < vertexes.length * vertexes.length; ++j){
            let firstParent = population[randomNumber(0, population.length)].slice();
            let secondParent = population[randomNumber(0, population.length)].slice();

            let children = crossingParents(firstParent, secondParent);
            population.push(children[0].slice())
            population.push(children[1].slice())
        }

        population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1]}));

        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])){
            drawTheLines(bestChromosome, population[0])
            bestChromosome = population[0].slice();
            end = 800;
        }

        if (i % 100 === 0){
            console.log(i);
            end -= 100;
        }

        redrawVertexes();
        await wait(0);
    }
}