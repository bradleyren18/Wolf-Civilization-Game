const meatConsumedPerWolf = 2;
const meatProducedPerHunter = 4;
const woodProducedPerLumberjack = 2;
const stoneProducedPerMiner = 2;

const meatCountText = document.getElementById("meatCount");
const territoryCountText = document.getElementById("territoryCount");
const wolvesCountText = document.getElementById("wolvesCount");
const logText = document.getElementById("log");
const latestEventText = document.getElementById("latestEvent");
const timerText = document.getElementById("timer");
const hunterAddBtn = document.getElementById("hunterAdd");
const scoutAddBtn = document.getElementById("scoutAdd");
const helperAddBtn = document.getElementById("helperAdd");
const lumberjackAddBtn = document.getElementById("lumberjackAdd");
const minerAddBtn = document.getElementById("minerAdd");

var meat = 0;
var bone = 0;
var wood = 0;
var stone = 0;
var territory = 1;

var currentTime = 0;
var meatProductionRate = 2;

var hunters = 1;
var scouts = 0;
var helpers = 0;
var lumberjacks = 0;
var miners = 0;
var totalWolves = 0;

var knifeEquipped = false;
var swordEquipped = false;
var spearEquipped = false;
var bowEquipped = false;
var crossbowEquipped = false;

function daily(){
    meat -= totalWolves*meatConsumedPerWolf;
    bone -= totalWolves*meatConsumedPerWolf/2;
    currentTime++;
    totalWolves = hunters+scouts+helpers+lumberjacks+miners;

    const extraResources = (hunters+helpers)*meatProducedPerHunter/2;
    meat += extraResources*2;
    bone += extraResources;
    wood += lumberjacks*(woodProducedPerLumberjack+helpers);
    stone += miners*(stoneProducedPerMiner+helpers);
    for (let i = 0; i < (scouts+helpers); i++) {
        var chance = Math.floor(Math.random()*24);
        if (crossbowEquipped == true){
            if (chance < 22){
                territory++;
            }
        }
        else if (bowEquipped == true){
            if (chance < 20){
                territory++;
            }
        }
        else if (spearEquipped == true){
            if (chance < 18){
                territory++;
            }
        }
        else if (swordEquipped == true){
            if (chance < 16){
                territory++;
            }
        }
        else if (knifeEquipped == true){
            if (chance < 14){
                territory++;
            }
        }
        else {
            if (chance < 12){
                territory++;
            }
        }
    }
}

function perFrame(){
    display();
    upgrades();
    meatProductionRate = (hunters+helpers)*meatProducedPerHunter - totalWolves*meatConsumedPerWolf;
    lose = meatProductionRate == 0 && meat < 20;
    if (meat < 0 || lose){
        alert("You lose :(");
        clearInterval(interval);
    }
    if(meat >= 10 && bone >= 5){
        lumberjackAddBtn.disabled = false;
        minerAddBtn.disabled = false;
    }else{
        lumberjackAddBtn.disabled = true;
        minerAddBtn.disabled = true;
    }
    if (meat >= 20 && bone >= 10){
        hunterAddBtn.disabled = false;
        scoutAddBtn.disabled = false;
    }else{
        hunterAddBtn.disabled = true;
        scoutAddBtn.disabled = true;
    }
    if (meat >= 30 && bone >= 15){
        helperAddBtn.disabled = false;
    }else{
        helperAddBtn.disabled = true;
    }

    if (territory >= 500){
        alert("You win! :)");
        clearInterval(interval);
    }
    requestAnimationFrame(perFrame)
}
function events(){
    if (meat > 20 && territory > 1 && hunters > 1 && scouts > 1){
        const chance = Math.floor(Math.random()*40);
        if (chance == 10){
            meat -= 20;
            logText.innerText += "\n The meat storage hut was raided. You lose 20 meat :(";
            latestEventText.innerText = "The meat storage hut was raided. You lose 20 meat :(";
        }
        else if (19 < chance < 23){
            territory -= 1;
            logText.innerText += "\n One of your territories revolted. You lose 1 territory :(";
            latestEventText.innerText = "One of your territories revolted. You lose 1 territory :(";
        }
        else if (chance == 30){
            meat += 40;
            bone += 20;
            territory += 2;
            logText.innerText += "\n A neighboring pack joins yours. They gift you 40 meat, 20 bone and 2 territory.";
            latestEventText.innerText = "A neighboring pack joins yours. They gift you 40 meat, 20 bone and 2 territory.";
        }
    }
}

function upgrades(){
    if (stone > 10 && wood > 20 && bone > 20){
        if (knifeEquipped == false){
            knifeEquipped = true;
            logText.innerText += "\n All scouts have knives!";
            latestEventText.innerText = "All scouts have knives!";
            stone -= 10;
            wood -= 20;
            bone -= 20;
        }
    }
    if (stone > 20 && wood > 40 && bone > 40){
        if (swordEquipped == false){
            swordEquipped = true;
            logText.innerText += "\n All scouts have swords!";
            latestEventText.innerText = "All scouts have swords!";
            stone -= 20;
            wood -= 40;
            bone -= 40;
        }
    }
    if (stone > 30 && wood > 60 && bone > 60){
        if (spearEquipped == false){
            spearEquipped = true;
            logText.innerText += "\n All scouts have spears!";
            latestEventText.innerText = "All scouts have spears!";
            stone -= 30;
            wood -= 60;
            bone -= 60;
        }
    }
    if (stone > 40 && wood > 80 && bone > 80){
        if (bowEquipped == false){
            bowEquipped = true;
            logText.innerText += "\n All scouts have bows!";
            latestEventText.innerText = "All scouts have bows!";
            stone -= 40;
            wood -= 80;
            bone -= 80;
        }
    }
    if (stone > 50 && wood > 100 && bone > 100){
        if (crossbowEquipped == false){
            crossbowEquipped = true;
            logText.innerText += "\n All scouts have crossbows!";
            latestEventText.innerText = "All scouts have crossbows!";
            stone -= 50;
            wood -= 50;
            bone -= 50;
        }
    }
}

function display(){
    timerText.innerText = `Day ${currentTime}`;
    meatCountText.innerText = `Meat: ${meat} | Bone: ${bone} | Wood: ${wood} | Stone: ${stone}`;
    territoryCountText.innerText = `Territory: ${territory}`;
    wolvesCountText.innerText = `Hunters: ${hunters} | Scouts: ${scouts} | Helpers: ${helpers} | Lumberjacks: ${lumberjacks} | Miners: ${miners}`;
}

function update(){
    hunterAddBtn.onclick = ()=>{
        logText.innerText += "\n Hunter added.";
        latestEventText.innerText = "Hunter added.";
        hunters += 1;
        meat -= 20;
        bone -= 10;
    }
    scoutAddBtn.onclick = ()=>{
        logText.innerText += "\n Scout added.";
        latestEventText.innerText = "Scout added.";
        scouts += 1;
        meat -= 20;
        bone -= 10;
    }
    helperAddBtn.onclick = ()=>{
        logText.innerText += "\n Helper added.";
        latestEventText.innerText = "Helper added.";
        helpers += 1;
        meat -= 30;
        bone -= 15;
    }
    lumberjackAddBtn.onclick = ()=>{
        logText.innerText += "\n Lumberjack added.";
        latestEventText.innerText = "Lumberjack added.";
        lumberjacks += 1;
        meat -= 10;
        bone -= 5;
    }
    minerAddBtn.onclick = ()=>{
        logText.innerText += "\n Miner added.";
        latestEventText.innerText = "Miner added.";
        miners += 1;
        meat -= 10;
        bone -= 5;
    }
}

update();
requestAnimationFrame(perFrame)
var interval = setInterval(()=>{daily(); events()}, 1000);