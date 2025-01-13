const ctx = canvas.getContext('2d');
Loading = 1;
const Level = location.search.split('?');
ctx.font = "20px Georgia";
ctx.textAlign = "center";

fetch('StageMaps/' + Level[1] + '/' + Level[2] + '.json').then(res => res.json()).then(data => initMap(data)).catch($ => exception($));

function exception($) {
  ctx.fillStyle = Level[1];
  ctx.fillText(Level[1] + " World", 185, 26);
    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 9; x++) {
        ctx.beginPath();
        ctx.rect(3 + 41*x, 39 + 41*y, 37, 37);
        ctx.fillStyle = Level[1];
        ctx.fill();
        ctx.fillStyle = "white";
        const i = 1 + x + 9*y;
        ctx.fillText(i, 21 + 41*x, 65 + 41*y);
        ctx.closePath();
  /*
        if (z && ctx.isPointInPath(X0, Y0)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resetMap();
            return;
        }
  */
        }
    }
}

function initMap(data) {
    Map = data;
    Description = navigator.language == "ko-KR" ? Map.Notes.Korean : Map.Notes.English;
    Reset = navigator.language == "ko-KR" ? "다시 시작" : "Reset";
    Continue = navigator.language == "ko-KR" ? "다음" : "Continue";
    Complete = navigator.language == "ko-KR" ? "완료했습니다!" : "Completed!";
    resetMap();
}

function resetMap() {
    Points = JSON.parse(JSON.stringify(Map.Points));
    Lines = JSON.parse(JSON.stringify(Map.Lines));
    completed = false;
    PositionX = 0;
    PositionY = 0;
    PointTypes = [];
    LineTypes = [];
    count = 0;
    Movable = [[],[],[],[],[],[],[]];
    for (let i = 0; i < Points.length; i++) {
        Movable[Points[i][0]-1][Points[i][1]-1] = true;
        PointTypes[i] = Points[i][2];
    }
    for (let i = 0; i < Lines.length; i++) LineTypes[i] = Lines[i][4];
    section = [[PositionX, PositionY, PointTypes, LineTypes]];
    makeSection();
    if (Loading) Loading = 0;
}

function move(x, y) {
    if (count > 1 && section[count-1][0] == x && section[count-1][1] == y) {
        PositionX = x;
        PositionY = y;
        count--;
        for (let i = 0; i < Points.length; i++) {
            Points[i][2] = section[count][2][i];
            if (PositionX == Points[i][0] && PositionY == Points[i][1]) condition = Points[i][2];
        }
        for (let i = 0; i < Lines.length; i++) Lines[i][4] = section[count][3][i];
    } else if (Movable[x-1][y-1]) {
        let clear;
        let clear0;
        let clear1;
        PointTypes = [];
        LineTypes = [];
        PositionX = x;
        PositionY = y;
        for (let i = 0; i < Lines.length; i++) {
            if (section[count][0] == Lines[i][0] && section[count][1] == Lines[i][1]) {
                if (PositionX == Lines[i][2] && PositionY == Lines[i][3]) discard(i);
                if (1**Lines[i][4]**-1) clear0 = true;
            }
            if (section[count][0] == Lines[i][2] && section[count][1] == Lines[i][3]) {
                if (PositionX == Lines[i][0] && PositionY == Lines[i][1]) discard(i);
                if (1**Lines[i][4]**-1) clear0 = true;
            }
            if (PositionX == Lines[i][0] && PositionY == Lines[i][1] && 1**Lines[i][4]**-1) clear1 = true;
            if (PositionX == Lines[i][2] && PositionY == Lines[i][3] && 1**Lines[i][4]**-1) clear1 = true;
            if (1**Lines[i][4]**-1) clear = true;
            LineTypes[i] = Lines[i][4];
        }
        for (let i = 0; i < Points.length; i++) {
            if (!clear0 && section[count][0] == Points[i][0] && section[count][1] == Points[i][1]) Points[i][2] = undefined;
            if (PositionX == Points[i][0] && PositionY == Points[i][1]) {
                if (!clear1) Points[i][2] = undefined;
                condition = Points[i][2];
            }
            PointTypes[i] = Points[i][2];
        }
        section[count+1] = [PositionX, PositionY, PointTypes, LineTypes];
        completed = !clear;
        return true;
    }
}

function discard(i) {
    let n;
    switch (Lines[i][4]) {
        case -3: case -1: n = 0; break;
        case -2: n = -1; break;
        case 2: n = 1; break;
        default: break;
    }
    Lines[i][4] = n;
}

function makeSection() {
    drawNumber(Level[2], Level[1]);
    for (let i = 0; i < Lines.length; i++) drawLine(Lines[i][0], Lines[i][1], Lines[i][2], Lines[i][3], Lines[i][4]);
    for (let i = 0; i < Points.length; i++) drawPoint(Points[i][0], Points[i][1], Points[i][2]);
}

function touchCanvas(event) {
    event.preventDefault();
    const touch = event.touches[0];
    eventCanvas(touch.clientX, touch.clientY);
}

function clickCanvas(event) {
    eventCanvas(event.pageX, event.pageY, true);
}

function eventCanvas(x, y, z) {
    if (Loading) return;
    const X0 = x-canvas.getBoundingClientRect().x;
    const Y0 = y-canvas.getBoundingClientRect().y;
    if (completed) {
        ctx.clearRect(128, 390, 115, 42);
        ctx.beginPath();
        ctx.rect(130-73, 392, 110, 37);
        ctx.fillStyle = "silver";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(Reset, 185-73, 418);
        ctx.closePath();
        if (z && ctx.isPointInPath(X0, Y0)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resetMap();
            return;
        }
        ctx.beginPath();
        ctx.rect(130+73, 392, 110, 37);
        ctx.fillStyle = "silver";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(Continue, 185+73, 418);
        ctx.closePath();
        if (z && ctx.isPointInPath(X0, Y0)) {
            Loading = 1;
            location.replace("drawing.html?" + Level[1] + "?" + ++Level[2]);
            return;
        }
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const coordX = Math.round(X0/37)-1;
    const coordY = Math.round(y/37)-1;
    if (coordX > 0 && coordX < 8 && coordY > 0 && coordY < 10 && move(coordX, coordY)) count++;
    makeSection();
    if (completed) {
        ctx.fillText(Complete, 185, 500-37);
        eventCanvas();
        return;
    }
    const X1 = 37+PositionX*37;
    const Y1 = 30+PositionY*37;
    ctx.beginPath();
    ctx.arc(X0, Y0, 7, 0, 7);
    ctx.fillStyle = "#bfbfbf3f";
    ctx.fill();
    ctx.closePath();
    if (PositionX == 0 && PositionY == 0) return;
    ctx.beginPath();
    const gra = ctx.createLinearGradient(X0, Y0, X1, Y1);
    gra.addColorStop(0, "#ff000000");
    gra.addColorStop(1/6, "#ffff007f");
    gra.addColorStop(1/3, "#00ff007f");
    gra.addColorStop(1/2, "#00ffff7f");
    gra.addColorStop(2/3, "#0000ff7f");
    gra.addColorStop(5/6, "#ff00ff7f");
    gra.addColorStop(1, "#ff00007f");
    ctx.strokeStyle = gra;
    ctx.moveTo(X0, Y0);
    ctx.lineTo(X1, Y1);
    ctx.lineWidth = 3;
    ctx.closePath();
    ctx.stroke();
    drawPoint(PositionX, PositionY, condition);
    ctx.beginPath();
    ctx.rect(130, 392, 110, 37);
    ctx.fillStyle = "silver";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(Reset, 185, 418);
    ctx.closePath();
    if (z && ctx.isPointInPath(X0, Y0)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resetMap();
        return;
    }
    Movable = [[],[],[],[],[],[],[]];
    for (let i = 0; i < Lines.length; i++) {
        if (1**Lines[i][4]**-1) {
            if (Lines[i][0] == PositionX && Lines[i][1] == PositionY) Movable[Lines[i][2]-1][Lines[i][3]-1] = true;
            if (Lines[i][4] < 0) continue;
            if (Lines[i][2] == PositionX && Lines[i][3] == PositionY) Movable[Lines[i][0]-1][Lines[i][1]-1] = true;
        }
    }
}

function drawNumber(stage, world) {
    const sentence = Description.split("/");
    ctx.fillStyle = "White";
    ctx.fillStyle = world;
    ctx.fillText(stage, 185, 500);
    ctx.fillStyle = "White";
    ctx.fillStyle = Map.Notes.Color;
    ctx.fillText(sentence[0], 185, 25);
    ctx.fillText(sentence[1], 185, 50);
}

function drawPoint(coordX, coordY, type) {
    ctx.beginPath();
    ctx.arc(37+coordX*37, 30+coordY*37, 7, 0, 7);
    switch (type) {
        case -1: color = "blue"; break;
        case 0: color = "gold"; break;
        case 1: color = "lime"; break;
        case 2: color = "red"; break;
        case 3: color = "silver"; break;
        default: color = "black"; break;
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawLine(startX, startY, endX, endY, type) {
    $a = 37+startX*37;
    $b = 30+startY*37;
    $c = 37+endX*37;
    $d = 30+endY*37;
    ctx.beginPath();
    ctx.moveTo($a, $b);
    ctx.lineTo($c, $d);
    switch (type) {
        case -3: color = "lime"; break;
        case -2: color = "red"; break;
        case -1: color = "blue"; break;
        case 0: color = "black"; break;
        case 1: color = "blue"; break;
        case 2: color = "red"; break;
        case 3: color = "silver"; break;
        default: color = "black"; break;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    if (type < 1) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(($a*7+$c*3)/10, ($b*7+$d*3)/10);
        ctx.rotate(Math.atan2($c-$a, $b-$d));
        ctx.fillText("▲", 0, 0);
        ctx.restore();
    }
}

