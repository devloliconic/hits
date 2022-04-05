/* Привет, ты на коде страницы task3. скрипт подключен к html*/

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let vertexes = [];
let chromosomes = [];
let size = 750;
let lengthOfChromosome; // without start vertex in the end
let numberOfGenerations = 100000;
let chanceOfMutation = 40;

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

function perm(firstGeneration, curDeep, end) {
    let res = [];
    if (curDeep === end){
        return res;
    }
    for (let i = 0; i < firstGeneration.length; ++i) {
        let rest = perm(firstGeneration.slice(0, i).concat(firstGeneration.slice(i + 1)), curDeep + 1, end);
        if(!rest.length) {
            res.push([firstGeneration[i]])
        } else {
            for(let j = 0; j < rest.length; ++j) {
                res.push([firstGeneration[i]].concat(rest[j]))
            }
        }
    }
    return res;
}

function drawTheLines(from, to){
    for (let i = 0; i < from.length - 1; ++i){
        context.beginPath();
        let vector = [from[i + 1][0] - from[i][0] , from[i + 1][1] - from[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        //context.moveTo(bestChromosome[i][0], bestChromosome[i][1]);

        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = 2;
        context.stroke();

        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgba(243,243,243,0.34)";
        context.lineWidth = 1;
    }
    for (let q = 0; q < to.length - 1; ++q){
        context.beginPath();
        let vector = [to[q + 1][0] - to[q][0] , to[q + 1][1] - to[q][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(to[q][0] + vector[0] * 10 / s, to[q][1] + vector[1] * 10 / s);
        context.lineTo(to[q + 1][0] - vector[0] * 10 / s, to[q + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(250,142,142)"; //
        context.lineWidth = 1;
        context.stroke();
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
    for (let i = a.length - 2; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice();
}

function startPopulation(firstGeneration){
    let res = [];
    let buffer = firstGeneration.slice();
    buffer.push(distance(buffer));
    res.push(buffer.slice());
    //console.log(firstGeneration)

    for (let i = 0; i < 80; ++i){
        buffer = firstGeneration.slice();
        buffer.shift()
        buffer = shuffle(buffer)
        buffer.unshift(firstGeneration[0].slice())
        buffer.push(distance(buffer));
        addToPopulation(res, buffer.slice());//res =
        //console.log(buffer.slice())

    }

    // console.log("!")
    // console.log(res)
    // console.log("!")
    console.log(res.length)
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

function compare(a, b) {
    if (a[a.length - 1] > b[a.length - 1]) return 1;
    if (a[a.length - 1] === b[a.length - 1]) return 0;
    if (a[a.length - 1] < b[a.length - 1]) return -1;
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

function cross(firstParent, secondParent, breakPoint){
    let child = []
    for (let i = 0; i <= breakPoint; ++i){
        child.push(firstParent[i]);
    }

    for (let i = breakPoint + 1; i < lengthOfChromosome; ++i){
        if (child.indexOf(secondParent[i], 0) === -1){
            child.push(secondParent[i]);
        }
    }

    if (child.length !== lengthOfChromosome){
        for (let i = breakPoint + 1; i < lengthOfChromosome; ++i){
            if (child.indexOf(firstParent[i], 0) === -1){
                child.push(firstParent[i]);
            }
        }
    }

    if (Math.random() * 100 < chanceOfMutation){
        let rand = twoRandomNumbers(1, lengthOfChromosome);
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
    let breakPoint = 1;

    for (let i  = 1; i < lengthOfChromosome; ++i){
        if (firstParent[i] !== secondParent[i]){
            breakPoint = i;
            break;
        }
    }

    let firstChild = cross(firstParent, secondParent, breakPoint);
    let secondChild = cross(secondParent, firstParent, breakPoint);

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

    for (let i = 0; i < vertexes.length; ++i){
        firstGeneration.push(vertexes[i]);
    }
    lengthOfChromosome = firstGeneration.length;
    firstGeneration.push(vertexes[0]);

    let population = startPopulation(firstGeneration);
    console.log(population.length)

    let curSum = 0;
    let bestSum = 0;

    let bestChromosome = population[0].slice();

    for (let i = 0; i < bestChromosome.length - 1; ++i){
        context.beginPath();
        let vector = [bestChromosome[i + 1][0] - bestChromosome[i][0] , bestChromosome[i + 1][1] - bestChromosome[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(bestChromosome[i][0] + vector[0] * 10 / s, bestChromosome[i][1] + vector[1] * 10 / s);
        context.lineTo(bestChromosome[i + 1][0] - vector[0] * 10 / s, bestChromosome[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(250,142,142)";
        context.lineWidth = 1;
        context.stroke();
    }

    let lengthOfPopulation = population.length;

    for(let i = 0; i < numberOfGenerations; ++i){
        let start = new Date().getTime();

        let firstParent = population[randomNumber(0, Math.floor(lengthOfPopulation / 5))].slice();
        let secondParent = population[randomNumber(0, lengthOfPopulation)].slice();

        // let firstParent = [], secondParent = [];
        //
        // while (JSON.stringify(firstParent) === JSON.stringify(secondParent)){
        //     let rand = twoRandomNumbers(0, population.length);
        //     let j = rand[0], k = rand[1];
        //     // console.log(population.length, j, k)
        //     firstParent = population[j].slice();
        //     secondParent = population[k].slice();
        // }


        // while (JSON.stringify(firstParent) === JSON.stringify(secondParent)){
        //     console.log("!!!!!!")
        //     secondParent = population[randomNumber(0, lengthOfPopulation / 2)].slice();
        // }

        // population[0].slice()    population[Math.floor(Math.random() * population.length)].slice()

        // while (JSON.stringify(firstParent) === JSON.stringify(secondParent)){
        //     let rand = twoRandomNumbers(0, population.length);
        //     let j = rand[0], k = rand[1];
        //     // console.log(population.length, j, k)
        //     firstParent = population[j].slice();
        //     secondParent = population[k].slice();
        // }

        // console.log(firstParent);
        // console.log(secondParent);
        let children = crossingParents(firstParent, secondParent);

        // addToPopulation(population, children[0].slice());
        // addToPopulation(population, children[1].slice());
        // population.splice(population.length - 2, 2);


        if (population.filter(i => JSON.stringify(i) === JSON.stringify(children[0])).length === 0){
            addToPopulation(population, children[0].slice());//population =
            population.splice(population.length - 1, 1);
            //population.pop();
        }
        if (population.filter(i => JSON.stringify(i) === JSON.stringify(children[1])).length === 0){
            addToPopulation(population, children[1].slice());//population =
            population.splice(population.length - 1, 1);
            //population.pop();
        }

        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])){
            drawTheLines(bestChromosome, population[0])
            bestChromosome = population[0].slice();
        }

        if (i % 100 === 0){
            console.log(i);
        }
        //console.log(new Date().getTime() - start)
        redrawVertexes();
        await wait(0.00001);

        //console.log(population)
        // console.log(bestChromosome)
    }




    // for (let i = 0; i < permutations.length; ++i){
    //     curSum = permutations[i][permutations[i].length - 1];
    //     if (curSum < bestSum){
    //         context.beginPath();
    //         for (let i = 0; i < bestChromosome.length - 1; ++i){
    //
    //             let vector = [bestChromosome[i + 1][0] - bestChromosome[i][0] , bestChromosome[i + 1][1] - bestChromosome[i][1]];
    //             let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    //             context.moveTo(bestChromosome[i][0] + vector[0] * 10 / s, bestChromosome[i][1] + vector[1] * 10 / s);
    //             //context.moveTo(bestChromosome[i][0], bestChromosome[i][1]);
    //
    //             context.lineTo(bestChromosome[i + 1][0] - vector[0] * 10 / s, bestChromosome[i + 1][1] - vector[1] * 10 / s);
    //             context.strokeStyle = "rgb(0,0,0)";
    //             context.lineWidth = 1;
    //             context.stroke()
    //         }
    //         let curChromosome = permutations[i].slice();
    //         context.beginPath();
    //         for (let i = 0; i < curChromosome.length - 2; ++i){
    //             let vector = [curChromosome[i + 1][0] - curChromosome[i][0] , curChromosome[i + 1][1] - curChromosome[i][1]];
    //             let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    //             context.moveTo(curChromosome[i][0] + vector[0] * 10 / s, curChromosome[i][1] + vector[1] * 10 / s);
    //             //context.moveTo(curChromosome[i][0], curChromosome[i][1]);
    //
    //             context.lineTo(curChromosome[i + 1][0] - vector[0] * 10 / s, curChromosome[i + 1][1] - vector[1] * 10 / s);
    //             context.strokeStyle = "rgb(255,0,0)";
    //             context.stroke()
    //         }
    //         bestChromosome = curChromosome
    //         bestSum = curSum;
    //         await wait(100);
    //     }
    // }

}