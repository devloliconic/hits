var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
let coardDot = [];
let centroidArry = [];
let coardAll = [];
let allVector = [];
let clusters = [];
const collorCentroid = ['red', 'green', 'gold', 'blue', 'DimGray'];



let slider = document.getElementById("myinput");
let output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}



canvas.onclick = function (event) { //get dot
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
let flagLimitedCentroid = true 
function addCentroid(){
    let n = Number(document.getElementById("myinput").value);//get input dot_count 
    if(flagLimitedCentroid === true && coardDot.length !== 0 && n <= coardDot.length){
        for(let i = 0; i < n; i++){ // random centroid generator
            let randomdot = Math.floor(Math.random() * coardDot.length);
            console.log(randomdot);
            let Centroid = {
                coardX: coardDot[randomdot].dotx,
                coardY: coardDot[randomdot].doty,
                collor: collorCentroid[i],
            };
            ctx.fillStyle = Centroid.collor;
            ctx.beginPath();
            ctx.fillRect(Centroid.coardX,Centroid.coardY, 20, 20);
            ctx.fill();
            console.log(centroidArry);
            centroidArry.push(Centroid);
        }
        for(let j = 0; j < n; j++){ // generator mas for single centroid
            clusters.push([]);
        }
        flagLimitedCentroid = false;
        floagForPoint = false;
        return centroidArry;
    }
    else if(flagLimitedCentroid === true && coardDot.length !== 0){
        alert("Установите точки");
    }
    

}

document.getElementById("startButton").onclick = buildCluster;
function buildCluster(){ //main func for clusters

    if(floagForPoint === true && flagLimitedCentroid === true){
        alert("Установите точки и центроиды");
        return 0;
    }   
    else if(flagLimitedCentroid === true) {
        alert("Установите цетроиды");
        return 0;
    }
    for(let i=0; i<coardDot.length; i++){ // calculating avg coard for i clusters
        let singleDotArry = [];
        for(let j = 0; j<centroidArry.length; j++){
            let dotCoardX = coardDot[i].dotx - centroidArry[j].coardX;
            let dotCoardY = coardDot[i].doty - centroidArry[j].coardY;
            let vector = Math.pow((Math.pow(dotCoardX,2) + Math.pow(dotCoardY,2)),0.5);
            singleDotArry.push(vector)
        }
        allVector.push(singleDotArry);
    }
    for(let i=0; i<allVector.length; i++){
        let min = allVector[i][0];
        let indexMin = 0;
        for(let j=0 ; j<centroidArry.length; j++){
            if(min > allVector[i][j]){
                min = allVector[i][j];
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
function avgCoard(){ //offset centroids
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
        if(count!==0){
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.fillRect(centroidArry[i].coardX, centroidArry[i].coardY, 20, 20);
            ctx.fill();
            sredX = sumX / clusters[i].length;
            sredY = sumY / clusters[i].length;
            centroidArry[i].coardX = sredX ;
            centroidArry[i].coardY = sredY;
            ctx.fillStyle = centroidArry[i].collor;
            ctx.beginPath();
            ctx.fillRect(sredX, sredY, 20, 20);
            ctx.fill();
        }
        // else if(count==0){
        //     sredX = centroidArry[i].coardX;
        //     sredY = centroidArry[i].coardY;
        //     // centroidArry[i].coardX = sredX ;
        //     // centroidArry[i].coardY = sredY;
        //     // ctx.fillStyle = centroidArry[i].collor;
        //     // ctx.beginPath();
        //     // ctx.fillRect(sredX, sredY, 20, 20);
        //     // ctx.fill();
        // }
        
        

        // centroidArry[i].coardX = sredX ;
        // centroidArry[i].coardY = sredY;
        // ctx.fillStyle = centroidArry[i].collor;
        // ctx.beginPath();
        // ctx.fillRect(sredX, sredY, 20, 20);
        // ctx.fill();

    }   
    allVector = [];
    singleDotArry = [];
    for(let i=0; i<clusters.length;i++){
        clusters[i] = [];
    }
    buildCluster();

} 
