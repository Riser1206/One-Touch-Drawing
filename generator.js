const ctx = canvas.getContext("2d");
resetMap();

const BTS = navigator.language == "ko-KR";
const Enter0 = BTS ? "설명" : "Enter";
const Enter1 = BTS ? "입력" : "Description";
const Reset = BTS ? "다시 시작" : "Reset";
const Undo = BTS ? "실행 취소" : "Undo";
let ValuePointStart = -1;
let ValuePointEnd = -1;
let ValueLine = 1;
drawSection();

function close0() {
    drawSection();
    dialog0.close();
}

function close1() {
    document.getElementsByName('pointStart').forEach((node) => {if (node.checked) ValuePointStart = node.value-0;});
    document.getElementsByName('pointEnd').forEach((node) => {if (node.checked) ValuePointEnd = node.value-0;});
    document.getElementsByName('line').forEach((node) => {if (node.checked) ValueLine = node.value-0;});
    drawSection();
    dialog1.close();
}

function resetMap() {
    Coord = [0,0];
    FileMap = {
        "Points": [],
        "Lines": []
    };
    FileMaps = [JSON.parse(JSON.stringify(FileMap))];
}

function makeSection() {
    const Z = [1,1,1];
    for (let i = 0; i < FileMap.Lines.length; i++) {
        const O = FileMap.Lines[i][0]+","+FileMap.Lines[i][1]+","+FileMap.Lines[i][2]+","+FileMap.Lines[i][3];
        if ([Coord,$coord].join() == O) Z[2] = 0;
        if ([$coord,Coord].join() == O) Z[2] = 0;
    }
    for (let i = 0; i < FileMap.Points.length; i++) {
        const O = FileMap.Points[i][0]+","+FileMap.Points[i][1];
        if (Coord.join() == O) Z[0] = 0;
        if ($coord.join() == O) Z[1] = 0;
    }
    if (Z[0]) FileMap.Points[FileMap.Points.length] = [Coord[0],Coord[1],ValuePointStart];
    if (Z[1]) FileMap.Points[FileMap.Points.length] = [$coord[0],$coord[1],ValuePointEnd];
    if (Z[2]) FileMap.Lines[FileMap.Lines.length] = [Coord[0],Coord[1],$coord[0],$coord[1],ValueLine];
    drawSection();
}

function drawSection(z, X, Y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let iX = 0; iX < 7; iX++) for (let iY = 0; iY < 9; iY++) {
        ctx.beginPath();
        ctx.arc(74+37*iX, 67+37*iY, 7, 0, 7);
        ctx.fillStyle = "#bfbfbf3f";
        ctx.fill();
        ctx.closePath();
    }
    for (let i = 0; i < FileMap.Lines.length; i++) {
        drawLine(FileMap.Lines[i][0],FileMap.Lines[i][1],FileMap.Lines[i][2],FileMap.Lines[i][3],FileMap.Lines[i][4]);
    }
    for (let i = 0; i < FileMap.Points.length; i++) {
        drawPoint(FileMap.Points[i][0],FileMap.Points[i][1],FileMap.Points[i][2]);
        if (z == undefined && Coord != undefined && Coord[0] == FileMap.Points[i][0] && Coord[1] == FileMap.Points[i][1]) condition = FileMap.Points[i][2];
    }
    const VAL = document.getElementById("input");
    if (VAL == null || VAL.value == "") drawNumber("¤¤¤"); else drawNumber(VAL.value);
    
    ctx.beginPath();
    ctx.rect(130-73, 392, 110, 37);
    ctx.fillStyle = "silver";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(Reset, 185-73, 418);
    const onR = ctx.isPointInPath(X, Y);
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(130+73, 392, 110, 37);
    ctx.fillStyle = "silver";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(Undo, 185+73, 418);
    const onU = ctx.isPointInPath(X, Y);
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, 50);
    const onD = ctx.isPointInPath(X, Y);
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(0, 500-37, canvas.width, 73);
    const onL = ctx.isPointInPath(X, Y);
    ctx.closePath();
    if (z) {
        if (Event0 == "onR" && Event1 == "onR") {
            resetMap();
            drawSection();
        } else if (Event0 == "onU" && Event1 == "onU") {
            if (FileMaps.length-- != 1) FileMap = FileMaps[FileMap.Lines.length-1];
            drawSection();
        } else if (Event0 == "onD" && Event1 == "onD") {
            dialog0.showModal();
        } else if (Event0 == "onL" && Event1 == "onL") {
            TitlePointStart.innerText = BTS ? "시작점 스타일" : "Start Point Style";
            TitlePointEnd.innerText = BTS ? "끝점 스타일" : "End Point Style";
            TitleLine.innerText = BTS ? "선 스타일" : "Line Style";
            dialog1.showModal();
            NaV0.focus();
            NaV0.hidden = true;
            NaV1.hidden = true;
        }
    } else if (z == 0) {
        Event0 = 0;
        if (onR) Event0 = "onR";
        if (onU) Event0 = "onU";
        if (onD) Event0 = "onD";
        if (onL) Event0 = "onL";
    } else {
        Event1 = 0;
        if (onR) Event1 = "onR";
        if (onU) Event1 = "onU";
        if (onD) Event1 = "onD";
        if (onL) Event1 = "onL";
    }
}

function touchCanvas(event, trigger) {
    if (trigger) {
        drawSection(1);
        if ($coord != undefined && Coord != undefined && Coord.join() != $coord.join()) makeSection();
        FileMaps[FileMap.Lines.length] = JSON.parse(JSON.stringify(FileMap));
        return;
    }
    
    event.preventDefault();
    const touch = event.touches[0];
    $coord = eventCanvas(touch.clientX, touch.clientY, trigger);
    if (trigger == 0) Coord = $coord;
}

function eventCanvas(x, y, z) {
    
    condition = ValuePointStart;
    
    const X0 = x-canvas.getBoundingClientRect().x;
    const Y0 = y-canvas.getBoundingClientRect().y;
    const coordX = Math.round(X0/37)-1;
    const coordY = Math.round(y/37)-1;
    
    drawSection(z, X0, Y0);
    let coord;
    if (coordX > 0 && coordX < 8 && coordY > 0 && coordY < 10) coord = [coordX, coordY];
    
    ctx.beginPath();
    ctx.arc(X0, Y0, 7, 0, 7);
    ctx.fillStyle = "#bfbfbf3f";
    ctx.fill();
    ctx.closePath();
    
    if (z == 0 || Coord == undefined) return coord;
    const X1 = 37+Coord[0]*37;
    const Y1 = 30+Coord[1]*37;
    
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
    ctx.stroke();
    ctx.closePath();
    
    drawPoint(Coord[0], Coord[1], condition);
    
    return coord;
}

function drawNumber(title) {
    const Z = document.getElementById("inputCol") == null || document.getElementById("inputCol").value == "";
    ctx.font = "20px Georgia";
    ctx.textAlign = "center";
    ctx.fillStyle = "Black";
    ctx.fillText(title, 185, 500);
    ctx.fillStyle = "White";
    ctx.fillStyle = Z ? "black" : document.getElementById("inputCol").value;
    ctx.fillText(Z ? Enter0 : BTS ? document.getElementById("input2").value : document.getElementById("input0").value, 185, 25);
    ctx.fillText(Z ? Enter1 : BTS ? document.getElementById("input3").value : document.getElementById("input1").value, 185, 50);
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

function storage() {
    const Notes = {
        "Korean": input2.value+"/"+input3.value,
        "English": input0.value+"/"+input1.value,
        "Color": inputCol.value
    };
    FileMap.Notes = Notes;
    const Content = JSON.stringify(FileMap);
    const blob = new Blob([Content], { type: 'text/plain' });
    objURL = URL.createObjectURL(blob);
    if (window._) URL.revokeObjectURL(_);
    _ = objURL;
    const a = document.createElement('a');
    a.download = input.value + '.json';
    a.href = objURL;
    a.click();
}
