var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
let coardDot = [];
let centroidarry = [];
let coardAll = [];
let allvector = [];
let clusters = [];
const collorCentroid = ['red', 'green', 'gold', 'blue', 'DimGray'];



let slider = document.getElementById("myinput");
let output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}



canvas.onclick = function (event) {
    if (floagForPoint === true){
        let x = event.offsetX;
        let y = event.offsetY;
        let dot = {
            dotx: x,
            doty: y
        }
        coardDot.push(dot);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x,y,10,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
  return coardDot;
}

document.getElementById("clearButton").onclick = clearFunc;
document.getElementById("addCentroidButton").onclick = addCentroid;

function clearFunc(){
    location.reload();
}
let floagForPoint = true;
let flagLimitedCentroid = true // limited for 
function addCentroid(){
    if(flagLimitedCentroid == true && coardDot.length!=0){
        n = Number(document.getElementById("myinput").value);//get input
        for(let i = 0; i < n; i++){
            let Centroid = {
                coardX: Math.ceil(Math.random()*500),
                coardY: Math.ceil(Math.random()*500),
                collor: collorCentroid[i],
            };
            ctx.fillStyle = Centroid.collor;
            ctx.beginPath();
            ctx.fillRect(Centroid.coardX,Centroid.coardY, 20, 20);
            ctx.fill();
            console.log(centroidarry);
            centroidarry.push(Centroid);
        }
        for(let j = 0; j < n; j++){
            clusters.push([]);
        }
        flagLimitedCentroid = false;
        floagForPoint = false;
        return centroidarry;
    }
    else{
        alert("Установите точки");
    }
    

}

document.getElementById("startButton").onclick = buildCluster;
function buildCluster(){

    if(floagForPoint == true && flagLimitedCentroid == true){
        alert("Установите точки и центроиды");
        return 0;
    }   
    else if(flagLimitedCentroid == true) {
        alert("Установите цетроиды");
        return 0;
    }
    for(let i=0; i<coardDot.length; i++){
        let singleDotArry = []
        for(let j = 0; j<centroidarry.length; j++){
            let dotCoardX = coardDot[i].dotx - centroidarry[j].coardX;
            let dotCoardY = coardDot[i].doty - centroidarry[j].coardY;
            let vector = Math.pow((Math.pow(dotCoardX,2) + Math.pow(dotCoardY,2)),0.5);
            singleDotArry.push(vector)
        }
        allvector.push(singleDotArry);
    }
    for(let i=0; i<allvector.length; i++){
        let min = allvector[i][0];
        let indexMin = 0;
        for(let j=0 ; j<centroidarry.length; j++){
            if(min > allvector[i][j]){
                min = allvector[i][j];
                indexMin = j;
            }
        }
        clusters[indexMin].push(coardDot[i]);
        ctx.fillStyle = collorCentroid[indexMin];
        ctx.beginPath();
        ctx.arc(coardDot[i].dotx,coardDot[i].doty,10,0,2*Math.PI);
        ctx.stroke();
        ctx.fill(); 
    }
    return clusters;
}
document.getElementById("nextStep").onclick = avgCoard;
function avgCoard(){
    for(let i = 0; i < clusters.length; i++){
        let sumX = 0;
        let sumY = 0;
        let sredX = 0;
        let sredY = 0;
        let count = clusters[i].length;
        for(let j = 0; j < count; j++){
            sumX = clusters[i][j].dotx + sumX;
            sumY = clusters[i][j].doty + sumY;
        }
        sredX = sumX / clusters[i].length;
        sredY = sumY / clusters[i].length;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(centroidarry[i].coardX, centroidarry[i].coardY, 20, 20);
        ctx.fill();
        centroidarry[i].coardX = sredX;
        centroidarry[i].coardY = sredY;
        ctx.fillStyle = collorCentroid[i];
        ctx.beginPath();
        ctx.fillRect(centroidarry[i].coardX, centroidarry[i].coardY, 20, 20);
        ctx.fill();
    }   
        allvector = [];
        for(let i=0; i<clusters.length;i++){
            clusters[i] = [];
        }
        buildCluster();

} 
