var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
let coardDot = [];
let greenBox = [];
let redBox = [];
let centroidarry = [];
// let coardArrGreen =[];
// let coardArrRed = [];
let coardAll = [];
var floagForPoint = true;

canvas.onclick = function (event) {
    if (floagForPoint === true){
        var x = event.offsetX;
        var y = event.offsetY;
        coardDot.push({x,y});
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x,y,10,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
  return coardDot
}

document.getElementById("clearButton").onclick = clearFunc;
document.getElementById("addCentroidButton").onclick = addCentroid;

function clearFunc(){
    location.reload();
}
let flagLimitedCentroid = true // limited for 
function addCentroid(){
    if(flagLimitedCentroid == true){
        ctx.fillStyle = "green";
        ctx.beginPath();
        greenX = Math.ceil(Math.random()*500);
        greenY = Math.ceil(Math.random()*500);
        ctx.fillRect(greenX, greenY, 20, 20);
        centroidarry.push(greenX,greenY);
        ctx.fill();
        redX = Math.ceil(Math.random()*500);
        redY = Math.ceil(Math.random()*500);
        centroidarry.push(redX,redY);
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.fillRect(redX, redY, 20, 20);
      //  ctx.stroke();
        ctx.fill();
    }
    flagLimitedCentroid = false;
    floagForPoint = false;
    return centroidarry;
}
// console.log(coardDot)
// console.log(centroidarry);
document.getElementById("startButton").onclick = buildCluster;
function buildCluster(){ 
    for(let coard of coardDot){
        // console.log(coard.x);
        let chekGreenX = coard.x - centroidarry[0];
        let chekGreenY = coard.y - centroidarry[1];
        let chekRedX = coard.x- centroidarry[2];
        let chekRedY = coard.y - centroidarry[3];
        let vectorModulRed = Math.pow((Math.pow(chekRedY,2)+Math.pow(chekRedY,2)),0.5);
        vectorModulRed = Math.abs(vectorModulRed);
        let vectorModulGreen = Math.pow((Math.pow(chekGreenX,2)+Math.pow(chekGreenY,2)),0.5);
        vectorModulGreen = Math.abs(vectorModulGreen);
        if(vectorModulRed >= vectorModulGreen){
            greenBox.push(coard);
        }
        else if(vectorModulRed < vectorModulGreen) {
            redBox.push(coard);
        }
    }
    for(let i = 0; i < greenBox.length;i++){
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(greenBox[i].x,greenBox[i].y,10,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    for(let i = 0; i < redBox.length;i++){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(redBox[i].x,redBox[i].y,10,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}
document.getElementById("nextStep").onclick = avgCoard;
console.log(greenBox);
console.log(redBox);
console.log(centroidarry);
function avgCoard(){
    let sumX = 0;
    let sumY = 0;
    let sredX = 0;
    let sredY = 0;
    for(let i = 0; i < greenBox.length; i++){
        sumX = greenBox[i].x + sumX;
    }
    sredX = sumX/greenBox.length;
    coardAll.push(sredX);
    for(let i = 0; i < greenBox.length; i++){
        sumY = greenBox[i].y + sumY;
    }
    sredY = sumY/greenBox.length;
    coardAll.push(sredY);
    sumY = 0;
    sumX = 0;
    for(let i = 0; i < redBox.length; i++){
        sumX = redBox[i].x + sumX;
    }
    sredX = sumX/redBox.length;
    coardAll.push(sredX);
    for(let i = 0; i < redBox.length; i++){
        sumY = redBox[i].y + sumY;
    }
    sredY = sumY/redBox.length;
    coardAll.push(sredY);
    if((centroidarry[0] == coardAll[0])&&(centroidarry[1] == coardAll[1])&&(centroidarry[2] == coardAll[2])&&(centroidarry[3] == coardAll[3])){
        alert("done");
    }
    else{
        ctx.clearRect(centroidarry[0], centroidarry[1], 500, 500);
        ctx.clearRect(centroidarry[2], centroidarry[3], 500, 500);
        centroidarry[0] = coardAll[0];
        centroidarry[1] = coardAll[1];
        centroidarry[2] = coardAll[2];
        centroidarry[3] = coardAll[3];
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.fillRect(centroidarry[0], centroidarry[1], 20, 20);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.fillRect(centroidarry[2], centroidarry[3], 20, 20);
        ctx.fill();
        greenBox = [];
        redBox = [];
        coardAll = [];
        console.log(centroidarry);
        buildCluster();
    }
} 
console.log(centroidarry);