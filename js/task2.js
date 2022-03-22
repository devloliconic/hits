var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
let coardDot = [];
let greenBox = [];
let redBox = [];
let centroidarry = [];


canvas.onclick = function (event) {
    var x = event.offsetX;
    var y = event.offsetY;
    coardDot.push({x,y});
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
    
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
    return centroidarry
}
console.log(coardDot)
console.log(centroidarry);
document.getElementById("startButton").onclick = buildCluster;
function buildCluster(){ 
    for(let coard of coardDot){
        console.log(coard.x)
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
    console.log(greenBox);
    console.log(redBox);
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
