let selectedPalette;
let newSelectedPalette;
let marks = {}
let primitive = {}
let palette_cat = {}

let stWidth = 1
let mode = "stroke"

let paletteScale = 1
let paletteOrigin = {x: 0, y: 0};
const paletteInitCoords = {x: 0, y: 0};
let paletteTempCan

let isPalettePanning = false
let palettePanLast = {x: 0, y: 0}

let paletteUndoStack = []
let paletteRedoStack = []
const PALETTE_UNDO_LIMIT = 20

let paletteInkMode = false
let palettePrevMoveTime = 0

let stColor = '#333'
let primRot

let global_anchors = {}
let currAnchor = 0

let palIt = 0

let megaPalettes = {}
let megaPalette2 = {}


let nSelPaltette;
let nSelMark;
let nSelType;

/*function addAPalette() {

    megaPalettes["temp" + palIt] = {
        displayType: "range",
        encodings: {
            "range": {marks: {}},
            "morph": {min: 0, max: 100},
            "repeat": {}
        }
    }
    // marks["temp" + palIt] = {}
    displayPalette("temp" + palIt)

    newSelectedPalette = "temp" + palIt
    ++palIt
    // fillPalette()
    // addAMark()
    // drawSvg()
}


function fillPalette(reset = false) {

    if (reset) {
        marks = {}
        primitive = {}
        global_anchors = {}
        palette_cat = {}
        // fillTable()
    }

    const container = document.getElementById("paletteCont")
    container.innerHTML = ""

    /!*    const anchorCont = document.createElement("div")
        anchorCont.className = "paletteMarks"
        // const anchorBlock = document.createElement("div")

        anchorCont.innerHTML = '' +
            '<h4 style="display: inline-block">Anchors</h4>'*!/
    /!*

        let anchorsDiv = document.getElementById("anchorsContainer")
        if (anchorsDiv === null) {
            anchorsDiv = document.createElement("div")
            anchorsDiv.setAttribute("id", "anchorsContainer")
        }

        updateAnchorCont(anchorsDiv)

        anchorCont.appendChild(anchorsDiv)
        anchorCont.innerHTML += '<div id="plusAnchor" onclick="addAnchor()">' +
            '<img src="assets/images/buttons/plus.png" style="width:25px;height:25px;margin-top: 12%;margin-left: 4.4%;">' +
            '</div>' +
            '<div class="buttonImg " id="anchorBtn">' +
            '<img src="assets/images/buttons/anchor.png" onClick="setAnchor()" style=""/>' +
            '</div>'
        container.appendChild(anchorCont)
    *!/


    const mess = getOptions()

    let allPalName = ""

    for (const [key, value] of Object.entries(megaPalette2)) {
        allPalName += `<option >${key}</option>`
    }


    const typesDisplay = "<option value ='range'>range</option>" +
        "<option value ='repeat'>repeat</option>" +
        "<option value ='morph'>morph</option>"

    for (const [key, value] of Object.entries(megaPalette2)) {
        const expo = document.createElement("button")
        expo.innerHTML = `<img class="buttonImg" src="/assets/images/buttons/export.png">`

        expo.setAttribute("class", "exportPaletteBtn")
        expo.setAttribute("id", "exportPaletteBtn_" + key)


        const tdiv = document.createElement("div")
        tdiv.id = "palette_" + key
        tdiv.className = "paletteMarks"
        tdiv.appendChild(expo)
        tdiv.innerHTML += `<input type="text" onchange="renameRow(this,'${key}')" row="${tdiv.id}" value="${key}" class="waypointTitle" />`

        if (value.displayType !== undefined) {
            if (value.displayType === "repeat") {
                const tdiv_mark = document.createElement("div")
                tdiv_mark.id = "mark_" + key
                tdiv_mark.className = "paletteMark"
                tdiv_mark.setAttribute("key", key)

                tdiv_mark.innerHTML =
                    // "<div class='primitiveData'>" +
                    // "<p class='primitiveLabel'> Display </p>" +
                    // "<select id='" + key + "_displayTypes' class='displayTypes'>" +
                    // typesDisplay +
                    // "</select>" +
                    // "</div>" +

                    "<div class='primitiveData'>" +
                    "<canvas id='canvas_" + key + "' style='width: 60px;height: 60px'>'" +
                    "</div>" +
                    "<div class='primitiveData'>" +
                    "<p class='primitiveLabel'> From anchor </p>" +
                    "<select id='" + key + "_markRepeatFrom' class='markRepeatFrom'>" +
                    "<option selected>None</option>" +
                    +mess +
                    "</select>" +
                    "</div>" +

                    "<div class='primitiveData'>" +
                    "<p class='primitiveLabel'> To anchor </p>" +
                    "<select id='" + key + "_markRepeatTo' class='markRepeatTo'>" +
                    "<option selected>None</option>" +
                    +mess +
                    "</select>" +
                    "</div>"

                tdiv_mark.onclick = function (e) {

                    if (mode !== "anchor") {
                        if (e.target.matches("canvas")) {
                            editPalette(this)
                        }
                    } else {
                        //TODO: Set for CATA and other primitive
                        setAnchorOnProto(e, this)
                    }
                }

                tdiv.appendChild(tdiv_mark)

            } else if (value.displayType === "range") {

                makeRangeMark(key, tdiv, value, typesDisplay)
            } else if (value.displayType === "morph") {


                const t = `<div class="primitiveData"> 
                      <p class='primitiveLabel'> Display </p>
                    <select id='${key + "_displayTypes"}' class='displayTypes'>${typesDisplay}
          
                    </select>
                    </div>`

                tdiv.innerHTML += t

                let minCan = document.createElement("canvas")
                minCan.width = 60
                minCan.height = 60

                let maxCan = document.createElement("canvas")
                maxCan.width = 60
                maxCan.height = 60

                megaPalettes[key].encodings.morph.min = {
                    proto: {
                        canvas: minCan,
                        corners: [[0, 0], [minCan.width, minCan.height]],
                        size: [minCan.width, minCan.height]
                    },
                }

                megaPalettes[key].encodings.morph.max = {
                    proto: {
                        canvas: maxCan,
                        corners: [[0, 0], [maxCan.width, maxCan.height]],
                        size: [maxCan.width, maxCan.height]
                    },
                }

                let min = makeSingleMark(key, "min", "morph", minCan)
                let max = makeSingleMark(key, "max", "morph", maxCan)
                tdiv.appendChild(min)
                tdiv.appendChild(max)
            }
        } else {

            // let rangeCont = document.createElement("div")
            // rangeCont.id = "range_"+key
            makeRangeMark(key, tdiv, value, typesDisplay)
            // tdiv.appendChild(rangeCont)
            // makeRangeMark(range, key, tdiv, value, typesDisplay)
        }



        container.appendChild(tdiv)

        // setMarkEvent(key, value.displayType)

        document.getElementById("exportPaletteBtn_" + key).onclick = function (e) {
            console.log("dsadas");
            savePalette2(key)
        }



    }

    let trange = document.getElementById("strokewidth")


    trange.onchange = function (e) {
        console.log("dsdsadas");
        const val = parseInt(document.getElementById("strokewidth").value);
        stWidth = val
        console.log("dsdsadas");
    }

    document.getElementById('strokecolor').onchange = function () {

        stColor = this.value
    }
    // populateSelect()
    // updateLink2Palette()
    updateSvg()
}*/


function editPalette(e) {
    let el = e

    document.getElementById("paletteContainer").style.display = "block";
    primRot = undefined

    let type = "markCan"
    let num = ""
    let key = ""
    if (!el.matches("canvas")) {
        num = el.getAttribute("number")
        key = el.getAttribute("key")
        type = el.getAttribute("id").split("_")[0]

        if (type === "canvas") {
            type = el.getAttribute("type")
            key = el.getAttribute("id").split("_")[1]

        }
        selectedPalette = [key, num, type]


    }

    let trange = document.getElementById("strokewidth")
    trange.onchange = function (e) {
        const val = parseInt(document.getElementById("strokewidth").value);
        stWidth = val

    }

    document.getElementById('strokecolor').onchange = function () {

        stColor = this.value
    }


    paletteResetZoom()

    let can = document.getElementById("paletteEdit")
    let cont = can.getContext("2d")

    let trec = can.getBoundingClientRect()

    can.width = trec.width;
    can.height = trec.height;

    applyPaletteCheckerboard(can)

    let w = trec.width
    let h = trec.height

    let proto

    if (type === "mark") {

        proto = megaPalettes[key].encodings.range.marks[num].proto


    } else {
        proto = {canvas: el, corners: [[0, 0], [el.width, el.height]]}
    }


    let tw = proto.canvas.width
    let th = proto.canvas.height
    if (proto.corners) {

        tw = proto.corners[1][0] - proto.corners[0][0]
        th = proto.corners[1][1] - proto.corners[0][1]

    }
    cont.clearRect(0, 0, 900, 900)
    cont.drawImage(proto.canvas,
        0,
        0,
        proto.canvas.width,
        proto.canvas.height,
        can.width / 2 - tw / 2,
        can.height / 2 - th / 2,
        tw,
        th
    );


    can.onpointerdown = onMouseDownPalette
    can.onpointermove = onMouseMovePalette
    can.onpointerup = onMouseUpPalette
    can.onclick = onClickPalette


    let control = document.getElementById('editControl')

    control.onclick = function (e) {

        let el = e.target

        if (el.matches('img')) {
            el = el.parentNode
            if (el.classList.contains('selectablePallete')) {
                document.getElementById("selectedButton2").removeAttribute("id")
                el.setAttribute("id", "selectedButton2")
            }
        }

    }
    // can.onwheel = paletteZoom

    document.getElementById("paletteEditRotate").oninput = function (e) {
        primRot = +this.value
        paletteRotate(primRot)
    }
    paletteTempCan = document.createElement("canvas");
    paletteTempCan.width = can.width;
    paletteTempCan.height = can.height;

    let tcon = paletteTempCan.getContext('2d')
    console.log(can);
    tcon.drawImage(can, 0, 0)

    paletteUndoStack = []
    paletteRedoStack = []

    can.addEventListener("mousewheel", paletteZoom, false);
    can.addEventListener("DOMMouseScroll", paletteZoom, false);
    can.addEventListener("wheel", paletteZoom, {passive: false});
    // can.addEventListener("mousewheel", zoom, false);
    // can.addEventListener("DOMMouseScroll", zoom, false);

    window.removeEventListener("keydown", paletteKeyHandler)
    window.addEventListener("keydown", paletteKeyHandler)
}

function applyPaletteCheckerboard(can) {
    can.style.backgroundImage =
        "linear-gradient(45deg, rgba(128,128,128,0.18) 25%, transparent 25%)," +
        "linear-gradient(-45deg, rgba(128,128,128,0.18) 25%, transparent 25%)," +
        "linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.18) 75%)," +
        "linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.18) 75%)"
    can.style.backgroundSize = "16px 16px"
    can.style.backgroundPosition = "0 0, 0 8px, 8px -8px, -8px 0px"
}

function onClickPalette(e) {
    if (e.shiftKey) {
        return
    }

    if (mode === "anchor") {
        let xy = getMousePos(e);
        xy = toWorld(xy, paletteOrigin, paletteScale)

        let selProto = marks[selectedPalette[0]][selectedPalette[1]].proto

        let tw = selProto.corners[1][0] - selProto.corners[0][0]
        let th = selProto.corners[1][1] - selProto.corners[0][1]


        if (selProto.anchors) {
            selProto.anchors[currAnchor] = {
                x: xy.x,
                y: xy.y,
                color: catColors[currAnchor],
                rx: xy.x / paletteTempCan.width,
                ry: xy.y / paletteTempCan.height,
                px: (xy.x - paletteTempCan.width / 2 + tw / 2),
                py: (xy.y - paletteTempCan.height / 2 + th / 2),
                prx: (xy.x - paletteTempCan.width / 2 + tw / 2) / paletteTempCan.width,
                pry: (xy.y - paletteTempCan.height / 2 + th / 2) / paletteTempCan.height,
            }
        } else {

            selProto.anchors = {
                currAnchor: {
                    x: xy.x,
                    y: xy.y,
                    color: catColors[currAnchor],
                    rx: xy.x / paletteTempCan.width,
                    ry: xy.y / paletteTempCan.height,
                    px: (xy.x - paletteTempCan.width / 2 + tw / 2),
                    py: (xy.y - paletteTempCan.height / 2 + th / 2),
                    prx: (xy.x - paletteTempCan.width / 2 + tw / 2) / paletteTempCan.width,
                    pry: (xy.y - paletteTempCan.height / 2 + th / 2) / paletteTempCan.height,
                },
            }
            ;

        }

        global_anchors[currAnchor] = {
            from: selectedPalette[0],
            data_from: selProto.anchors[currAnchor]
        }


    } else if (mode === "eraseColor") {
        let xy = getMousePos(e);
        xy = toWorld(xy, paletteOrigin, paletteScale)

        // Rotate the click back into paletteTempCan's own (unrotated) pixel
        // space before sampling — otherwise this samples the wrong pixel
        // whenever the canvas preview is rotated.
        const canvasXY = paletteToCanvasSpace(xy)

        let tcan = paletteTempCan


        let cont = tcan.getContext("2d")
        // const [r, g, b, a] = cont.getImageData(tx, ty, 1, 1).data;
        const [r, g, b, a] = cont.getImageData(canvasXY.x, canvasXY.y, 1, 1).data;

        const range = 20

        pushPaletteUndoSnapshot()
        removeColor(r, g, b, paletteTempCan, range)
        paletteRedraw()
        // syncPaletteThumbnail()
        // removeColor(r, g, b, megaPalettes[nSelPaltette].encodings.range.marks[nSelMark].source, range)
        // removeColor(r, g, b, megaPalettes[nSelPaltette].encodings.range.marks[nSelMark].proto.canvas, range)

    } else if (mode === "fill") {
        let xy = getMousePos(e);
        xy = toWorld(xy, paletteOrigin, paletteScale)

        const canvasXY = paletteToCanvasSpace(xy)

        const tolerance = 20

        pushPaletteUndoSnapshot()
        floodFillPaletteCanvas(paletteTempCan, canvasXY.x, canvasXY.y, stColor, tolerance)
        paletteRedraw()
        // syncPaletteThumbnail()
    }
}


function updateAnchorCont(container) {



    container.innerHTML = ''

    for (const [key, value] of Object.entries(global_anchors)) {

        const tdiv = document.createElement('div')

        let sel = ""

        if (key === currAnchor) {
            sel = " selectedAnchor"
        }

        tdiv.setAttribute('id', 'currAnchor_' + key)
        tdiv.setAttribute('class', 'currAnchor' + sel)

        tdiv.innerHTML = key
        tdiv.onclick = function (e) {
            document.querySelector(".selectedAnchor").classList.remove("selectedAnchor")
            this.classList.add("selectedAnchor")
            const id = this.getAttribute('id')
            currAnchor = id.split("_")[1]
        }
        container.appendChild(tdiv)
    }

}

function displayCircle(xy) {

    const toolColors = {
        stroke: stColor,
        erase: "#e5484d",
        eraseColor: "#f2994a",
        fill: "#27ae60",
        anchor: "#2f80ed",
    }

    let can = document.getElementById('paletteEdit');
    let cont = can.getContext('2d');
    cont.save()
    cont.strokeStyle = toolColors[mode] || "#333"
    cont.lineWidth = 1 / (paletteScale || 1)

    if (mode === "eraseColor" || mode === "fill") {
        // Both tools sample a point and act on the region around it by color
        // similarity — brush width is irrelevant, so show a crosshair/target
        // instead of a size ring that would otherwise imply a brush effect.
        const r = 6 / (paletteScale || 1)
        cont.beginPath();
        cont.arc(xy.x, xy.y, r, 0, 2 * Math.PI);
        cont.moveTo(xy.x - r * 1.8, xy.y);
        cont.lineTo(xy.x - r * 0.6, xy.y);
        cont.moveTo(xy.x + r * 0.6, xy.y);
        cont.lineTo(xy.x + r * 1.8, xy.y);
        cont.moveTo(xy.x, xy.y - r * 1.8);
        cont.lineTo(xy.x, xy.y - r * 0.6);
        cont.moveTo(xy.x, xy.y + r * 0.6);
        cont.lineTo(xy.x, xy.y + r * 1.8);
        cont.stroke();
        cont.closePath();
    } else {
        cont.beginPath();
        cont.arc(xy.x, xy.y, stWidth, 0, 2 * Math.PI);
        cont.stroke();
        cont.closePath();
    }

    cont.restore()
}


function paletteResetZoom() {
    let can = document.getElementById('paletteEdit');
    let cont = can.getContext('2d');
    cont.setTransform(1, 0, 0, 1, 0, 0);
    paletteScale = 1
    paletteOrigin.x = 0
    paletteOrigin.y = 0
}

function onMouseUpPalette(e) {
    if (isPalettePanning) {
        isPalettePanning = false
        if (e && e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
            e.target.releasePointerCapture(e.pointerId)
        }
        let can = document.getElementById("paletteEdit")
        if (can) can.style.cursor = ""
        return
    }

    const hadStroke = mouseDown === 1
    mouseDown = 0

    stroke = []



}

function drawPalette(cont, x, y, w, type, can) {
    cont.save()
    if (type === "erase")
        cont.globalCompositeOperation = 'destination-out';

    const rawPrev = stroke.length ? stroke[stroke.length - 1] : null

    // Local copies only — never mutate strokePoint/prevPoint in place, or the
    // next call (and the stroke history pushed in onMouseMovePalette) would
    // see an already-shifted value and end up drawing in the wrong frame,
    // which is what turned rotated strokes into jagged shapes.
    let start = [strokePoint[0], strokePoint[1]]
    let end = [x, y]
    let prev = rawPrev ? [rawPrev[0], rawPrev[1]] : null

    if (primRot) {
        const cx = paletteTempCan.width / 2
        const cy = paletteTempCan.height / 2
        cont.translate(cx, cy);
        cont.rotate(toRad(-primRot));
        start = [start[0] - cx, start[1] - cy]
        end = [end[0] - cx, end[1] - cy]
        if (prev) {
            prev = [prev[0] - cx, prev[1] - cy]
        }
    }


    cont.lineCap = 'round';
    cont.lineJoin = 'round';
    cont.beginPath();
    // cont.strokeStyle = "#333"
    cont.strokeStyle = stColor
    cont.lineWidth = w

    if (prev) {
        // Quadratic-smooth through the last three points instead of a straight
        // segment, so fast strokes don't come out faceted.
        const midPrev = [(prev[0] + start[0]) / 2, (prev[1] + start[1]) / 2]
        const midCurr = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
        cont.moveTo(midPrev[0], midPrev[1])
        cont.quadraticCurveTo(start[0], start[1], midCurr[0], midCurr[1])
    } else {
        cont.moveTo(start[0], start[1]);
        cont.lineTo(end[0], end[1]);
    }

    cont.stroke()
    cont.closePath();
    cont.restore()

    let tcon = can.getContext('2d')
    tcon.clearRect(0, 0, 9000, 9000);

    tcon.drawImage(cont.canvas, 0, 0)
}

function getPaletteInkWidth(e, xy) {
    // Real stylus/touch pressure when available; mice report 0 or undefined,
    // so fall back to a neutral mid-pressure in that case.
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5

    const now = performance.now()
    const dt = Math.max(now - palettePrevMoveTime, 1)
    palettePrevMoveTime = now

    const dx = xy.x - strokePoint[0]
    const dy = xy.y - strokePoint[1]
    const dist = Math.hypot(dx, dy)
    const speed = dist / dt // px per ms

    // Faster movement -> thinner line, slower -> thicker, mimicking how a
    // real pen lays down more ink when it lingers.
    const speedFactor = clampVal(1.15 - speed * 1.5, 0.35, 1.15)

    return Math.max(1, stWidth * pressure * speedFactor)
}

function onMouseDownPalette(e) {
    if (e.shiftKey) {
        isPalettePanning = true
        palettePanLast = {x: e.offsetX, y: e.offsetY}
        if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) {
            e.target.setPointerCapture(e.pointerId)
        }
        e.target.style.cursor = "grabbing"
        e.preventDefault()
        return
    }

    let xy = getMousePos(e);
    xy = toWorld(xy, paletteOrigin, paletteScale)
    strokePoint = [xy.x, xy.y];
    mouseDown = 1;
    palettePrevMoveTime = performance.now()

    pushPaletteUndoSnapshot()
}


function onMouseMovePalette(e) {
    if (isPalettePanning) {
        e.preventDefault()
        const dx = e.offsetX - palettePanLast.x
        const dy = e.offsetY - palettePanLast.y
        palettePanLast = {x: e.offsetX, y: e.offsetY}

        paletteOrigin.x += dx
        paletteOrigin.y += dy

        paletteRedraw()
        return
    }

    let xy = getMousePos(e);

    xy = toWorld(xy, paletteOrigin, paletteScale)
    let can = document.getElementById("paletteEdit")
    can.style.cursor = e.shiftKey ? "grab" : ""

    if (mouseDown === 1) {

        // let cont = can.getContext('2d');
        e.preventDefault()

        let w = stWidth
        if (paletteInkMode && mode === "stroke") {
            w = getPaletteInkWidth(e, xy)
        }

        let cont = paletteTempCan.getContext('2d')
        drawPalette(cont, xy.x, xy.y, w, mode, can);
        stroke.push([...strokePoint])
        strokePoint = [xy.x, xy.y];
    }
    let tcon = can.getContext('2d')
    tcon.clearRect(0, 0, 9000, 9000);

    if (primRot) {
        tcon.save()
        tcon.translate(paletteTempCan.width / 2, paletteTempCan.height / 2);
        tcon.rotate(toRad(primRot));
        tcon.drawImage(paletteTempCan, -paletteTempCan.width / 2, -paletteTempCan.height / 2, paletteTempCan.width, paletteTempCan.height);
        tcon.restore();
    } else {
        tcon.drawImage(paletteTempCan, 0, 0)
    }

    displayCircle(xy)

}

function getClosestPrev() {
    let ind = selectedPalette[1]
    let keys = Object.keys(marks[selectedPalette[0]])

    let bg

    for (let i = ind; i > 0; i--) {
        if (marks[selectedPalette[0]][keys[i]].type !== "fake") {
            bg = marks[selectedPalette[0]][keys[i]]
            break
        }
    }
    loadbg(bg)
}

function loadbg(bg) {
    if (bg) {

        let can = document.getElementById("paletteEdit")
        let cont = can.getContext("2d")

        let tw = bg.proto.corners[1][0] - bg.proto.corners[0][0]
        let th = bg.proto.corners[1][1] - bg.proto.corners[0][1]


        cont.clearRect(0, 0, 900, 900)
        cont.drawImage(bg.proto.canvas,
            0,
            0,
            bg.proto.canvas.width,
            bg.proto.canvas.height,
            can.width / 2 - tw / 2,
            can.height / 2 - th / 2,
            tw,
            th
        );

        paletteTempCan = document.createElement("canvas");
        paletteTempCan.width = can.width;
        paletteTempCan.height = can.height;

        let pcont = paletteTempCan.getContext("2d");

        pcont.drawImage(can, 0, 0, can.width, can.height)

        paletteUndoStack = []
        paletteRedoStack = []
    }
}

function getClosestNext() {
    let ind = selectedPalette[1]
    let keys = Object.keys(marks[selectedPalette[0]])

    let bg

    for (let i = ind; i < keys.length; i++) {
        if (marks[selectedPalette[0]][keys[i]].type !== "fake") {
            bg = marks[selectedPalette[0]][keys[i]]
            break
        }
    }

    loadbg(bg)
}

function switchmod(val) {
    mode = val
}

function togglePaletteInk(enabled) {
    paletteInkMode = !!enabled
}

function paletteRotate(angle) {
    let tcan = document.getElementById('paletteEdit');
    let tcont = tcan.getContext('2d');


    tcont.clearRect(0, 0, 9000, 9000)

    tcont.save()
    tcont.translate(paletteTempCan.width / 2, paletteTempCan.height / 2);
    tcont.rotate(toRad(angle));
    tcont.drawImage(paletteTempCan, -paletteTempCan.width / 2, -paletteTempCan.height / 2, paletteTempCan.width, paletteTempCan.height);
    tcont.restore();

    // paletteTempCan = can
    // tcont.drawImage(paletteTempCan, paletteInitCoords.x, paletteInitCoords.y);
}


function paletteZoom(e) {
    e.preventDefault();
    let zoomStep = 1.1

    let x = e.offsetX;
    let y = e.offsetY;
    let delta
    if (e.type === "mousewheel") {
        delta = e.wheelDelta
    } else if (e.type === "wheel") {
        delta = -e.deltaY
    } else {
        delta = -e.detail
    }

    if (delta > 0) {
        paletteScaleAt(x, y, zoomStep);
    } else {
        paletteScaleAt(x, y, 1 / zoomStep);
    }

    paletteRedraw();
}

function paletteRedraw() {
    let can = document.getElementById('paletteEdit');
    let cont = can.getContext('2d');

    cont.clearRect(0, 0, can.width, can.height);
    cont.setTransform(paletteScale, 0, 0, paletteScale, paletteOrigin.x, paletteOrigin.y);

    cont.save()
    cont.translate(paletteTempCan.width / 2, paletteTempCan.height / 2);
    cont.rotate(toRad(primRot));
    cont.drawImage(paletteTempCan, -paletteTempCan.width / 2, -paletteTempCan.height / 2, paletteTempCan.width, paletteTempCan.height);
    cont.restore();
    // cont.drawImage(paletteTempCan, paletteInitCoords.x, paletteInitCoords.y);
}

function paletteToCanvasSpace(xy) {
    // xy is in the (possibly visually rotated) display frame produced by
    // paletteRedraw. paletteTempCan's own pixel data is never rotated, so a
    // click needs to be rotated back around the canvas center before it can
    // be used to index into it directly (getImageData/putImageData), the
    // same compensation drawPalette applies via the context transform.
    if (!primRot) return {x: xy.x, y: xy.y}

    const cx = paletteTempCan.width / 2
    const cy = paletteTempCan.height / 2
    const rad = toRad(-primRot)
    const dx = xy.x - cx
    const dy = xy.y - cy
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    return {
        x: cx + (dx * cos - dy * sin),
        y: cy + (dx * sin + dy * cos)
    }
}

function hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
    }
    const num = parseInt(hex, 16)
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function floodFillPaletteCanvas(canvas, startX, startY, fillHex, tolerance) {
    const w = canvas.width
    const h = canvas.height
    startX = Math.round(startX)
    startY = Math.round(startY)
    if (startX < 0 || startY < 0 || startX >= w || startY >= h) return

    const ctx = canvas.getContext("2d")
    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data
    const idx = (x, y) => (y * w + x) * 4

    const startIdx = idx(startX, startY)
    const targetR = data[startIdx]
    const targetG = data[startIdx + 1]
    const targetB = data[startIdx + 2]
    const targetA = data[startIdx + 3]

    const [fr, fg, fb] = hexToRgb(fillHex)
    const fa = 255

    // Already the fill color (within tolerance)? Nothing to do.
    if (Math.abs(targetR - fr) <= tolerance && Math.abs(targetG - fg) <= tolerance &&
        Math.abs(targetB - fb) <= tolerance && Math.abs(targetA - fa) <= tolerance) {
        return
    }

    const matches = (i) =>
        Math.abs(data[i] - targetR) <= tolerance &&
        Math.abs(data[i + 1] - targetG) <= tolerance &&
        Math.abs(data[i + 2] - targetB) <= tolerance &&
        Math.abs(data[i + 3] - targetA) <= tolerance

    const visited = new Uint8Array(w * h)
    const stack = [[startX, startY]]

    while (stack.length) {
        const [x, y] = stack.pop()
        if (x < 0 || y < 0 || x >= w || y >= h) continue

        const vIdx = y * w + x
        if (visited[vIdx]) continue

        const pIdx = idx(x, y)
        if (!matches(pIdx)) continue

        visited[vIdx] = 1
        data[pIdx] = fr
        data[pIdx + 1] = fg
        data[pIdx + 2] = fb
        data[pIdx + 3] = fa

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }

    ctx.putImageData(imageData, 0, 0)
}

function paletteSnapshotCanvas(source) {
    const snap = document.createElement("canvas")
    snap.width = source.width
    snap.height = source.height
    snap.getContext("2d").drawImage(source, 0, 0)
    return snap
}

function pushPaletteUndoSnapshot() {
    if (!paletteTempCan) return
    try {
        paletteUndoStack.push(paletteSnapshotCanvas(paletteTempCan))
        if (paletteUndoStack.length > PALETTE_UNDO_LIMIT) {
            paletteUndoStack.shift()
        }
        paletteRedoStack = []
    } catch (err) {
        console.error("Palette undo snapshot failed", err)
    }
}

function paletteRestoreSnapshot(snap) {
    paletteTempCan.width = snap.width
    paletteTempCan.height = snap.height
    paletteTempCan.getContext("2d").drawImage(snap, 0, 0)

    paletteRedraw()
    // syncPaletteThumbnail()
}

function palettePerformUndo() {
    if (!paletteUndoStack.length || !paletteTempCan) return
    paletteRedoStack.push(paletteSnapshotCanvas(paletteTempCan))
    paletteRestoreSnapshot(paletteUndoStack.pop())
}

function palettePerformRedo() {
    if (!paletteRedoStack.length || !paletteTempCan) return
    paletteUndoStack.push(paletteSnapshotCanvas(paletteTempCan))
    paletteRestoreSnapshot(paletteRedoStack.pop())
}

function paletteKeyHandler(e) {
    const paletteContainer = document.getElementById("paletteContainer")
    if (!paletteContainer || paletteContainer.style.display !== "block") return

    const active = document.activeElement
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return

    const ctrlOrCmd = e.ctrlKey || e.metaKey
    if (!ctrlOrCmd) return

    const key = e.key.toLowerCase()

    if (key === "z" && e.shiftKey) {
        e.preventDefault()
        palettePerformRedo()
    } else if (key === "z") {
        e.preventDefault()
        palettePerformUndo()
    } else if (key === "y") {
        e.preventDefault()
        palettePerformRedo()
    }
}

function syncPaletteThumbnail() {
    if (!selectedPalette || !paletteTempCan) return

    const [key, num] = selectedPalette
    const thumbId = num ? "canvas_" + key + "_" + num : "canvas_" + key
    const thumb = document.getElementById(thumbId)
    if (!thumb) return

    try {
        const tctx = thumb.getContext("2d")
        tctx.clearRect(0, 0, thumb.width, thumb.height)
        tctx.drawImage(paletteTempCan, 0, 0, paletteTempCan.width, paletteTempCan.height, 0, 0, thumb.width, thumb.height)
    } catch (err) {
        console.error("Palette thumbnail sync failed", err)
    }
}


function paletteScaleAt(x, y, scaleBy) {  // at pixel coords x, y scale by scaleBy
    paletteScale *= scaleBy;
    paletteOrigin.x = x - (x - paletteOrigin.x) * scaleBy;
    paletteOrigin.y = y - (y - paletteOrigin.y) * scaleBy;
}


function savePalette() {
    const corn = getMinimalBoundingBox(paletteTempCan)

    let resCan

    if (selectedPalette === undefined) {
        resCan = currSampleEdited
    } else {

        if (selectedPalette[2] === "mark") {
            if (selectedPalette[1]) {
                resCan = megaPalettes[selectedPalette[0]].encodings.range.marks[selectedPalette[1]].proto.canvas
                // resCan = marks[selectedPalette[0]][selectedPalette[1]].proto.canvas
            } else {
                resCan = marks[selectedPalette[0]].proto.canvas
            }

        } else if (selectedPalette[2] === "cat") {
            resCan = palette_cat[selectedPalette[0]].proto.canvas
        }
    }

    let tw = Math.min(corn.width, resCan.width)
    let th = Math.min(corn.height, resCan.height)

    resCan.width = tw
    resCan.height = th

    const resCont = resCan.getContext('2d')


    resCont.clearRect(0, 0, 999, 999)
    resCont.save()
    resCont.translate(resCan.width / 2, resCan.height / 2);

    if (primRot !== undefined)
        resCont.rotate(toRad(primRot));

    let factor = 2

    if (tw < 15) {
        factor = 4
    } else if (tw < 40) {
        factor = 2.5
    } else {
        factor = 2
    }


    resCont.drawImage(paletteTempCan,
        corn.x,
        corn.y,
        corn.width,
        corn.height,
        -(tw / factor),
        -(th / factor),
        tw,
        th
    )


    if (selectedPalette) {
/*        let oldCan = document.getElementById("canvas_" + selectedPalette[0] + "_" + selectedPalette[1])
        oldCan.width = tw
        oldCan.height = th

        let oldCon = oldCan.getContext('2d')

        oldCon.drawImage(resCan, 0, 0, tw, th)*/
        if (selectedPalette[2] === "mark" && !palSwitch) {
            if (selectedPalette[1]) {

                // marks[selectedPalette[0]][selectedPalette[1]].proto.corners = corn
                megaPalettes[selectedPalette[0]].encodings.range.marks[selectedPalette[1]].proto.corners = [[corn.x, corn.y], [corn.x + corn.width, corn.y + corn.height]]
            } else {
                marks[selectedPalette[0]].proto.corners = [[corn.x, corn.y], [corn.x + corn.width, corn.y + corn.height]]

            }


        }
        updateSvg()
    }
    document.getElementById("paletteContainer").style.display = "none";

    // fillPalette()

    selectedPalette = undefined


}


function toBW() {
    let src = opencv.imread(paletteTempCan);

    // paletteTempCan.style.filter = 'grayscale(1)';

    let temp = new opencv.MatVector();
    let temp2 = new opencv.MatVector();
    opencv.split(src, temp)


    let dst = opencv.Mat.zeros(src.rows, src.cols, opencv.CV_8UC3);

    // dst = opencv.merge(src, temp.get(3))

    let mergedPlanes = new opencv.MatVector();

    opencv.cvtColor(src, src, opencv.COLOR_RGBA2GRAY, 1);

    opencv.split(src, temp2)

    mergedPlanes.push_back(temp2.get(0))
    mergedPlanes.push_back(temp2.get(0))
    mergedPlanes.push_back(temp2.get(0))
    mergedPlanes.push_back(temp.get(3))

    // opencv.merge(src, mergedPlanes)
    opencv.merge(mergedPlanes, src)

    opencv.imshow(paletteTempCan, src);


    let can = document.getElementById("paletteEdit")

    let tcon = can.getContext('2d')
    tcon.clearRect(0, 0, 900, 900);
    tcon.drawImage(paletteTempCan, 0, 0)

    src.delete();
    dst.delete();
    mergedPlanes.delete();
    temp.delete();
    temp2.delete();
}


function setAnchor() {
    let el = document.getElementById("anchorBtn")

    if (collageMod === 'anchor') {
        el.classList.remove('selectedAnchorBtn');
        collageMod = "details"
    } else {
        collageMod = 'anchor';
        el.classList.add('selectedAnchorBtn');
    }
    // mode = 'anchor';
}


function getOptions() {
    let ancres = Object.keys(global_anchors)

    let mess = ""


    for (let i = 0; i < ancres.length; i++) {

        mess += "<option class ='anchor_" + ancres[i] + "'>" + ancres[i] + "</option>"
    }

    return mess
}


function clampVal(val, min, max) {

    return Math.max(Math.min(val, max), min)
}
//
// function setAnchorOnProto(e, el) {
//
//     if (e.target.matches("canvas")) {
//         const xy = getMousePos(e)
//
//
//         let tcan = e.target
//         let trect = tcan.getBoundingClientRect()
//         let key = el.getAttribute("key")
//         let type = el.getAttribute("type")
//         let num = el.getAttribute("number")
//
//
//         let selProto
//         let source
//         let scale = 1
//
//         if (type === "range") {
//             selProto = megaPalettes[key].encodings.range.marks[num].proto
//             source = megaPalettes[key].encodings.range.marks[num].source
//             if (megaPalettes[key].encodings.range.scale) {
//                 scale = megaPalettes[key].encodings.range.scale
//             }
//
//         } else if (type === "morph") {
//             selProto = megaPalettes[key].encodings.morph[num].proto
//             source = megaPalettes[key].encodings.morph[num].source
//             if (megaPalettes[key].scale) {
//                 scale = megaPalettes[key].encodings.morph.scale
//             }
//         }
//
//
//         let tw = selProto.corners[1][0] - selProto.corners[0][0]
//         let th = selProto.corners[1][1] - selProto.corners[0][1]
//
//
//         let tx = xy.x
//         let ty = xy.y
//
//         if (source) {
//
//             if (source.width * scale < tw && source.height * scale < th) {
//
//                 tx = clampVal(xy.x - tw / 2 + source.width / 2, 0, source.width)
//                 ty = clampVal(xy.y - th / 2 + source.height / 2, 0, source.height)
//                 // tx = (xy.x *source.width) / tw
//                 // ty = (xy.y *source.height) / th
//
//             } else {
//
//                 // tx = clampVal(xy.x - tw / 2 + source.width / 2, 0, source.width)
//                 // ty = clampVal(xy.y - th / 2 + source.height / 2, 0, source.height)
//
//
//                 tx = clampVal(xy.x - tw / 2 + source.width / 2, 0, source.width)
//                 ty = clampVal(xy.y - th / 2 + source.height / 2, 0, source.height)
//             }
//             tw = source.width * scale
//             th = source.height * scale
//         }
//
//
//         if (selProto.anchors === undefined) {
//             selProto.anchors = {}
//         }
//         selProto.anchors[currAnchor] = {
//             x: tx,
//             y: ty,
//             rx: tx / tw,
//             ry: ty / th,
//
//
//             // px: (tx - tw / 2),
//             // py: (ty - th / 2),
//             // prx: (tx - tw / 2) / tw,
//             // pry: (ty - th / 2) / th,
//         }
//
//
//         console.log(selProto.anchors[currAnchor]);
//         console.log(source.width, source.height);
//
//         let cont = source.getContext("2d")
//         cont.beginPath();
//         cont.arc(selProto.anchors[currAnchor].x, selProto.anchors[currAnchor].y, 3, 0, 2 * Math.PI);
//         cont.closePath()
//         cont.fill();
//
//
//         // if (type === "mark") {
//         if (global_anchors[currAnchor] === undefined) {
//             global_anchors[currAnchor] = {}
//         }
//
//         global_anchors[currAnchor].from = {
//             type: type,
//             key: key,
//             number: num,
//             data: selProto.anchors[currAnchor]
//         }
//
//         // }
//         /*        else if (type === "cat") {
//                     if (global_anchors[currAnchor] === undefined) {
//                         global_anchors[currAnchor] = {}
//                     }
//                     palette_cat[key].apply = global_anchors[currAnchor].from
//
//                     global_anchors[currAnchor].to = {
//                         type: type,
//                         key: key,
//                         data: selProto.anchors[currAnchor]
//                     }
//
//                 }*/
//
//         // updateAnchorCont()
//         updateLinkTo()
//     }
// }


// function exportPalette(key, type) {
//     const elem = "";
//     let tdat
//     if (type === "mark") {
//         tdat = marks[key]
//     }
//
//     if (type === "primitive") {
//         tdat = primitive[key]
//     }
//     if (type === "category") {
//         tdat = palette_cat[key]
//     }
//
//     for (const [key, value] of Object.entries(tdat)) {
//
//         const tval = {...value}
//         if (tval?.proto?.canvas) {
//             tval.proto.canvas = tval.proto.canvas.toDataURL("image/png")
//         }
//         tdat[key] = tval
//     }
//
//     const res = {
//         type: type,
//         data: tdat,
//         name: key
//     }
//
//     download(JSON.stringify(res), "palette_" + key + ".json", "text/json");
// }
//
// function importPalette(e) {
//     const reader = new FileReader();
//
//     reader.onload = async function (e) {
//         let jsonObj = JSON.parse(e.target.result);
//
//         for (const [key, value] of Object.entries(jsonObj.encodings.range.marks)) {
//             if (value.proto) {
//                 value.proto.canvas = await convertToCanvas(value.proto.canvas)
//             }
//
//             if (value.source) {
//                 value.source = await convertToCanvas(value.source)
//             }
//         }
//
//
//         let n = Object.keys(megaPalettes).length
//
//         megaPalettes[`temp${n}`] = jsonObj
//
//
//         fillPalette(false)
//     }
//     reader.readAsText(e.target.files[0]);
// }



function updateMarksBindingDisplay(palette) {

    let cont = document.getElementById('bind-' + palette)
    cont.innerHTML = ""

    if (dataBinding[palette]) {
        makeBindingDisplay(cont, palette, dataBinding[palette])
    }


}

function makeRangeMark(key, tdiv, value, typesDisplay) {

    const marks = value.encodings.range.marks


    let dataBindinCont = document.createElement("div")
    dataBindinCont.id = "bind-" + key

    dataBindinCont.className = "dataBindingContainer"

    if (dataBinding[key]) {
        makeBindingDisplay(dataBindinCont, key, dataBinding[key])
    }

    tdiv.appendChild(dataBindinCont)

    for (const [name, value] of Object.entries(marks)) {
        let tmark = makeSingleMark(key, name, "range", value.proto.canvas)
        tdiv.appendChild(tmark)
        // makeBindingDisplay(key, dataBinding[key])
        let tcan = tmark.lastChild;
        let trect = tcan.getBoundingClientRect()

        let tsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tmark.appendChild(tsvg)

        dragElement3(tmark)
        tsvg = d3.select(tsvg)


        tsvg
            .attr("id", "svg-" + key + "-" + name)
            .attr("class", "markAnchorSvg")
            .attr("viewBox", `0 0 ${trect.width} ${trect.height}`)
            .attr("width", trect.width)
            .attr("height", trect.height)


        if (value.proto.anchors) {
            for (const [id, coords] of Object.entries(value.proto.anchors)) {
                tsvg.append("circle")
                    .attr("cx", trect.width * coords.rx)
                    .attr("cy", trect.height * coords.ry)
                    .attr("num", id)
                    .attr("fill", collageColScale(coords.relatedTo))
                    .style("stroke", "1px")
                    .attr("palette", key)
                    .attr("name", name)
                    .attr("r", "5")
                    .call(d3.drag()
                        .on("start", nodeDragst)
                        .on("drag", nodeDragged)
                        .on("end", nodeDragend))
            }

        }

    }

    let moreCan = document.createElement("div")

    moreCan.className = "moreCan"
    moreCan.innerHTML = ` <img  id="palettePlusMark" src="assets/images/buttons/plus.png" class="buttonImg" 
 style=";margin-top: 28%;margin-left: 28%;width: 25px; cursor: pointer" onclick="addACan(this,'${key}')">`
    tdiv.appendChild(moreCan)

}


function nodeDragst() {

}

function nodeDragged(event) {
    let elem = d3.select(this)
    let htmlSvg = elem.node().parentElement
    let svg = d3.select(htmlSvg)

    let x = clampVal(event.x, 0, htmlSvg.getAttribute("width"));
    let y = clampVal(event.y, 0, htmlSvg.getAttribute("height"));

    elem.attr("cx", x)
    elem.attr("cy", y)

    let pal = elem.attr("palette")
    let mark = elem.attr("name")
    let num = elem.attr("num")


    megaPalettes[pal].encodings.range.marks[mark].proto.anchors[num].x = x
    megaPalettes[pal].encodings.range.marks[mark].proto.anchors[num].y = y
    megaPalettes[pal].encodings.range.marks[mark].proto.anchors[num].rx = x / htmlSvg.getAttribute("width")
    megaPalettes[pal].encodings.range.marks[mark].proto.anchors[num].ry = y / htmlSvg.getAttribute("height")


}

function nodeDragend() {
    updateSvg()
}


function addACan(elem, key, img = undefined) {
    let len = Object.keys(megaPalettes[key].encodings.range.marks).length

    let tcan = document.createElement("canvas")

    tcan.width = 60
    tcan.height = 60
    let name = "mark" + len

    if (img) {
        drawCanvasWithScale(img, tcan, 1)
    }


    if (megaPalettes[key].encodings.range.marks) {
        let anchor = {}
        for (const [_, value] of Object.entries(megaPalettes[key].encodings.range.marks)) {
            if (value.proto.anchors) {
                anchor = deepClone(value.proto.anchors)
                break
            }
        }


        megaPalettes[key].encodings.range.marks[name] = {
            value: name,
            type: "fake",
            proto: {
                canvas: tcan,
                corners: [[0, 0], [tcan.width, tcan.height]],

            },
        }

        if (anchor != {}) {
            megaPalettes[key].encodings.range.marks[name].proto.anchors = anchor
        }

        let tmark = makeSingleMark(key, name, "range", tcan)
        elem.parentElement.parentElement.insertBefore(tmark, elem.parentElement)
        // let tcan = tmark.lastChild;
        let trect = tcan.getBoundingClientRect()

        let tsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tmark.appendChild(tsvg)

        dragElement3(tmark)
        tsvg = d3.select(tsvg)


        tsvg
            .attr("id", "svg-" + key + "-" + name)
            .attr("class", "markAnchorSvg")
            .attr("viewBox", `0 0 ${trect.width} ${trect.height}`)
            .attr("width", trect.width)
            .attr("height", trect.height)


        if (megaPalettes[key].encodings.range.marks[name].proto.anchors) {
            for (const [id, coords] of Object.entries(megaPalettes[key].encodings.range.marks[name].proto.anchors)) {
                tsvg.append("circle")
                    .attr("cx", trect.width * coords.rx)
                    .attr("cy", trect.height * coords.ry)
                    .attr("num", id)
                    .attr("fill", collageColScale(coords.relatedTo))
                    .style("stroke", "1px")
                    .attr("palette", key)
                    .attr("name", name)
                    .attr("r", "5")
                    .call(d3.drag()
                        .on("start", nodeDragst)
                        .on("drag", nodeDragged)
                        .on("end", nodeDragend))
            }

        }


    }
}

function getMarkRange(key) {
    let res = []
    for (let i = 0; i < sampleData.length; i++) {
        for (const [name, value] of Object.entries(sampleData[i].data)) {
            if (name === key && value?.proto?.canvas) {
                res.push([value.value, value.proto.corners])
            }
        }
    }
    let min = getFirstIndexOfMinValue(res)
    let max = getFirstIndexOfMaxValue(res)
    return [res[min], res[max]]
}


function makeBindingDisplay(container, palette, dataColumn) {
    if (!isCont(chartDataset.data, dataColumn)) {
        let set = new Set(chartDataset.data.map(d => d[dataColumn]));
        console.log(set);
        let uniques = Array.from(set).map(d => "" + d)
        console.log(uniques);
        let nMarks = Object.keys(megaPalettes[palette].encodings.range.marks).length

        for (let i = 0; i < uniques.length; i++) {

            let nameDiv = document.createElement("div")

            nameDiv.setAttribute("class", "dataBindingLabel")
            nameDiv.setAttribute("data", uniques[i])
            nameDiv.innerHTML = uniques[i]

            if (i > nMarks - 1) {
                nameDiv.style.color = "#EF5350"
                nameDiv.style.fontWeight = "600"
            }

            container.appendChild(nameDiv)

        }

    }

    return container

}

function makeSingleMark(key, label, type, can = undefined) {
    const tdiv_mark = document.createElement("div")
    tdiv_mark.id = "mark_" + key + "_" + label
    tdiv_mark.className = "paletteMark"
    tdiv_mark.setAttribute("key", key)
    tdiv_mark.setAttribute("type", type)
    tdiv_mark.setAttribute("number", "" + label)


    // let mess = `<input type='text' value='${label}' class='paletteMarkName'>`

    // if (type === "morph") {
    //     mess = `<p class='primitiveLabel'>${label}</p>`
    // }
    if (can === undefined) {
        /*
                can = document.createElement("canvas")

                can.width = 60
                can.height = 60
        */

        tdiv_mark.innerHTML = `            <canvas id='canvas_${key}_${label}' style='width: 60px;height: 60px'></canvas>`
    } else {
        // tdiv_mark.innerHTML = mess
        tdiv_mark.appendChild(can)


        can.id = `${"canvas_" + key}_${label}`

    }
    tdiv_mark.onclick = function (e) {

        if (mode !== "anchor") {
            if (e.target.matches("canvas")) {
                nSelPaltette = key
                nSelMark = label
                nSelType = type
                editPalette(this)
            }
        } else {
            setAnchorOnProto(e, this)
        }
    }
    return tdiv_mark
}

function renameRow(elem, key) {
    let name = elem.value

    document.getElementById("exportPaletteBtn_" + key).setAttribute("name", name)

    if (name !== "" && !palSources.includes(key)) {
        megaPalettes[name] = megaPalettes[key]
        delete megaPalettes[key]
        selectedPalette = name
    }


    fillPalette()
}

function savePalette2(key) {

    let res = megaPalettes[key]
    for (const [key, value] of Object.entries(res)) {
        if (typeof value === "object") {
            const tval = {...value}
            res[key] = tval
        }
    }

    for (const [key, value] of Object.entries(res.encodings.range.marks)) {
        res.encodings.range.marks[key].proto.canvas = res.encodings.range.marks[key].proto.canvas.toDataURL("image/png")
        if (res.encodings.range.marks[key].source) {
            res.encodings.range.marks[key].source = res.encodings.range.marks[key].source.toDataURL("image/png")
        }
    }


    download(JSON.stringify(res), "palette_" + key + ".json", "text/json");
}

function purgeAnchor(from, to, n) {
    megaPalettes[to].apply = ""
    megaPalettes[from].linkto = ""

    for (const [key, value] of Object.entries(megaPalettes[from].encodings.range.marks)) {

        delete value.proto.anchors[n]
    }

    for (const [key, value] of Object.entries(megaPalettes[to].encodings.range.marks)) {

        delete value.proto.anchors[n]
    }

    updateSvg()

}

function changeScale(palette, type) {
    const step = 0.1


    if (type === "-") {
        megaPalettes[palette].scale -= step
    } else if (type === "+") {
        megaPalettes[palette].scale += step
    }


    updateSvg()
}


function appendEncoding(palette) {


}

function makeEncodingSelect(key) {


    let select = document.createElement("select")
    select.className = "paletteEncodingSelect"
    select.id = `${key}_encodingSelect`
    select.innerHTML = ` <option value="new">*new*</option>  <option value="color">color</option>` + `<option value="size">size</option>` + `<option value="orientation">orientation</option>`

    select.onchange = function () {
        if (select.value !== "new") {
            let tdiv = document.createElement("div")

            tdiv.className = "dataSelectContainer"
            tdiv.setAttribute("key", key)
            tdiv.setAttribute("val", select.value)
            tdiv.setAttribute("type", select.value)

            let options = makeColumnsSelect()
            tdiv.innerHTML = `<img  onclick="delEncoding('${key}', '${select.value}')" class="delEncoding" src="assets/images/buttons/del.png"><p>${select.value}:</p> <select palette="${key}" encoding="${select.value}" onchange="updateSelectEncoding('${key}', '${select.value}')" class="dataSelect">${options}</select> `
            select.parentElement.parentElement.insertBefore(tdiv, select.parentElement)
            removeOptionByValue(select, select.value)
        }
    }
    return select
}

function removeOptionByValue(select, value) {
    const option = select.querySelector(`option[value="${value}"]`);
    if (option) {
        option.remove();
    }
}


function delEncoding(key, val) {
    let select = document.getElementById(`${key}_encodingSelect`)

    select.innerHTML += `<option value="${val}">${val}</option>`

    let div = document.querySelector(`div[key="${key}"][val="${val}"]`)

    if (val === "color") {
        megaGlyph[key].color.dataColumn = ""
    }


    div.remove()

    updateSvg()
}
