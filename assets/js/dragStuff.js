let dragMode = "canvas"

let dragging = false;

let offsetX = 0;
let offsetY = 0;

let selectedDataColumn = ""


let markOffx = 0
let markOffy = 0

let tdragName = ""

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;
    let tsvg = document.getElementById("selectedPaletteCont");

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        dragging = true
        if (elmnt.className === "allPaletteRow") {
            dragMode = "palette"
        } else {
            dragMode = "canvas";
        }


        const rect = elmnt.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        tsvg.classList.add("dropArea")
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        elmnt.style.position = "absolute";

        document.body.style.cursor = "grabbing";

        elmnt.style.left =
            (e.pageX - offsetX) + "px";

        elmnt.style.top =
            (e.pageY - offsetY + 50) + "px";

        if (e.target === tsvg || e.target.matches(".leftSideSelected") || e.target.matches(".selectedCanPreview") || e.target.matches(".propertyContainer")) {
            tsvg.classList.add("dragOver")
            tsvg.classList.remove("dropArea")
        } else {
            tsvg.classList.remove("dragOver")
            tsvg.classList.add("dropArea")
        }

    }

    function closeDragElement(e) {
        // stop moving when mouse button is released:
        elmnt.style.position = "";
        elmnt.style.top = ""
        elmnt.style.left = ""
        document.onmouseup = null;
        document.onmousemove = null;
        dragging = false

        document.body.style.cursor = "";


        tsvg.classList.remove("dragOver")
        tsvg.classList.remove("dropArea")

        if (dragMode === "canvas") {
            dropCanvas(e, elmnt)
        } else {
            dropPalette(e, elmnt)
        }


    }
}


function dragElement2(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;


    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        selectedDataColumn = elmnt.getAttribute("datacolumn");

        const rect = elmnt.getBoundingClientRect();

        offsetX = e.clientX - rect.left
        offsetY = e.clientY - rect.top;

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        d3.selectAll(".dataSelectContainer").style("border", "2px dashed #424242")
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        elmnt.style.position = "absolute";

        let tcords = elmnt.parentElement.getBoundingClientRect();

        elmnt.style.left =
            ((e.pageX - offsetX) - tcords.x) + "px";

        elmnt.style.top =
            ((e.pageY - offsetY + 50) - 50) + "px";

        // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


        if (e.target.matches(".dataSelectContainer")) {
            d3.select(e.target).style("border", "2px dashed red")

        } else if (e.target.parentNode.matches(".dataSelectContainer")) {
            d3.select(e.target.parentNode).style("border", "2px dashed red")
        } else {
            d3.select(".dataSelectContainer").style("border", "2px dashed #424242")
        }
    }

    function closeDragElement(e) {
        // stop moving when mouse button is released:
        elmnt.style.position = "";
        elmnt.style.top = ""
        elmnt.style.left = ""
        document.onmouseup = null;
        document.onmousemove = null;
        dragging = false

        d3.selectAll(".dataSelectContainer").style("border", "none")
        let id = ""
        let type = ""
        let telm

        if (e.target.matches(".dataSelectContainer")) {
            id = e.target.getAttribute("key")
            type = e.target.getAttribute("type")
            telm = e.target

        } else if (e.target.parentElement.matches(".dataSelectContainer")) {
            id = e.target.parentElement.getAttribute("key")
            telm = e.target.parentElement
            type = e.target.parentElement.getAttribute("type")
        }

        if (id !== "") {

            elmnt.innerHTML = `<div style="display: table-cell;background-color: ${collageColScale(id)};margin-left: calc(50% - 38px);" class="colorBrand"></div>${elmnt.innerText}`

            let tsel = d3.select(telm).select("select")

            tsel.selectAll("option").attr("selected", "false")

            tsel = tsel.node()

            let n = +elmnt.getAttribute("num")

            tsel.getElementsByTagName('option')[n + 1].selected = true;

            let key = elmnt.getAttribute("key");
            console.log(type);
            let flag = false
            if (type === "shape") {
                megaGlyph[id].dataColumn = key

                dataBinding[id] = key
                updateMarksBindingDisplay(id)
            } else if (type === "color") {
                megaGlyph[id].color.dataColumn = key

                megaGlyph[id]['color'] = makeColorScale(id, key)

            } else if (type === "size") {
                megaGlyph[id]["size"] = makeSizeScale(id, key)
                flag = true
            } else if (type === "orientation") {
                megaGlyph[id]["orientation"] = makeOrrScale(id, key)
            }

            updateSvg(flag)

        }

        selectedDataColumn = ""
    }
}


function makeSizeScale(id, key) {
    let data = chartDataset.data

    let scale

    if (isCont(data, key)) {
        scale = d3.scaleLinear(d3.extent(data.map(d => d[key])), [0.6, 1.5])
    } else {
        let uniques = [...new Set(data.map(d => d[key]))];

        scale = d3.scalePoint()
            .domain(uniques)
            .range([0.6, 1.5]);
    }

    return {
        dataColumn: key,
        scale: scale
    }
}

function updateSelectEncoding(palette, key) {
    console.log("dadsadas");
    let sel = document.querySelector(`.dataSelect[palette="${palette}"][encoding="${key}"]`)

    let val = sel.value

    console.log(val);
    if (key === "color") {
        megaGlyph[palette].color.dataColumn = key

        megaGlyph[palette]['color'] = makeColorScale(palette, val)

    } else if (key === "size") {
        megaGlyph[palette]["size"] = makeSizeScale(palette, val)
    } else if (key === "orientation") {
        megaGlyph[palette]["orientation"] = makeOrrScale(palette, val)
    }

    updateSvg()


}

function makeOrrScale(id, key) {
    let data = chartDataset.data

    let scale

    if (isCont(data, key)) {
        scale = d3.scaleLinear(d3.extent(data.map(d => d[key])), [0, 360])
    } else {
        let uniques = [...new Set(data.map(d => d[key]))];

        scale = d3.scalePoint()
            .domain(uniques)
            .range([0, 360]);
    }

    return {
        dataColumn: key,
        scale: scale
    }
}

function dropPalette(e, elmnt) {

    if (e.target.matches("#paletteCont") || e.target.matches(".paletteMark") || e.target.matches(".paletteMarks")) {

        let num = +elmnt.getAttribute("number")
        let name = elmnt.getAttribute("name")
        let tpal = allPalettes[num]


        if (megaPalettes[name] !== undefined) {
            name += Object.keys(megaPalettes[name]).length
        }
        megaPalettes[name] = tpal


        fillPalette()

        let tPalCont = document.getElementById("paletteCont")
        tPalCont.classList.remove("draggedover")

    } else if (e.target.matches("#selectedPaletteCont") || e.target.matches(".selectedPaletteRow") || e.target.matches(".leftSideSelected") || e.target.matches(".selectedCanPreview") || e.target.matches(".propertyContainer")) {

        let num = +elmnt.getAttribute("number")
        let name = elmnt.getAttribute("name")

        selectThisPalette(name,num)
    }
}

function dropCanvas(e, elmnt) {
    if (e.target.matches(".paletteMark")) {


    } else if (e.target.parentElement.matches(".paletteMark")) {

        let telem = e.target.parentElement

        let id = telem.id.split("_")[1];

        let type = telem.getAttribute("type");

        let can = e.target

        // removeColor(230, 230, 230, can, 25)
        // removeColor(230, 230, 230, elmnt, 25)
        if (type === "range") {
            let num = telem.getAttribute("number")
            // marks[id][num].source = elmnt
            megaPalette2[id].encodings.range.marks[num].source = elmnt

            drawCanvasWithScale(elmnt, can, megaPalette2[id].encodings.range.scale)
        } else if (type === "morph") {

            let num = telem.getAttribute("number")
            megaPalette2[id].encodings.morph[num].proto.canvas = elmnt
            megaPalette2[id].encodings.morph[num].proto.size = [elmnt.width, elmnt.height]
            drawCanvasWithScale(elmnt, can, 1)

        }

        updateSvg()

    }
}

function drawCanvasWithScale(elmnt, can, scale) {

    let elemW = elmnt.width
    let elemH = elmnt.height
    if (scale == null) {
        scale = 1
    }

    if (typeof elemW === "object") {
        elemW = +elmnt.getAttribute("width")
        elemH = +elmnt.getAttribute("height")
    }

    let cont = can.getContext("2d")
    cont.clearRect(0, 0, can.width, can.height)
    let x = can.width / 2
    let y = can.height / 2

    let scaledW = elemW * scale
    let scaledH = elemH * scale

    if (can.width > scaledW && can.height > scaledH) {
        x -= scaledH / 2
        y -= scaledH / 2

        cont.drawImage(elmnt, x, y, scaledW, scaledH)
    } else {
        if (can.width <= scaledW) {
            let ratio = can.width / scaledW

            let w = scaledW * ratio
            let h = scaledH * ratio
            x -= w / 2
            y -= h / 2

            cont.drawImage(elmnt, x, y, w, h)
        } else if (can.height <= scaledH) {

            let ratio = can.height / scaledH

            let w = scaledW * ratio
            let h = scaledH * ratio
            x -= w / 2
            y -= h / 2


            cont.drawImage(elmnt, x, y, w, h)
        }
    }
}


function dragstarted(event, d) {

    let elem = d3.select(this)

    elem.raise().attr("stroke", "black");


}

function dragged(event, d) {
    let elem = d3.select(this)

    console.log(elem.attr("name"));
    let type = elem.attr("type")
    let name = elem.attr("name")
    let toName = elem.attr("to")
    let fromName = elem.attr("from")
    let svg = d3.select("#composition")

    let tname = ""
    let related = ""
    if (type === "from") {
        // let node = svg.select(`circle[name='${name}'][type='from']`)

        tname += svg.select(`circle[name='${name}'][type='from']`).attr("from")


    } else if (type === "to") {
        tname += svg.select(`circle[name='${name}'][type='to']`).attr("to")
    }

    let mark = svg.select(`#collage-${tname}`)


    let tx = event.x - mark.attr("x")
    let ty = event.y - mark.attr("y")

    console.log(tx, event.x, mark.attr("x"));
    console.log(ty, event.y, mark.attr("y"));
    // console.log(ty);

    if ((tx > 0 && tx < 60) && (ty > 0 && ty < 60)) {
        elem.attr("cx", event.x).attr("cy", event.y);


        let from = svg.select(`circle[name='${name}'][from='${fromName}'][to='${toName}'][type='from']`)
        let to = svg.select(`circle[name='${name}'][from='${fromName}'][to='${toName}'][type='to']`)

        /*    console.log(from);
            console.log("----------");
            console.log(to);*/

        let link = svg.select(`path[name='${name}'][from='${fromName}'][to='${toName}']`)

        link.transition().duration(40).attr("d", makeLink(+from.attr("cx"), +from.attr("cy"), +to.attr("cx"), +to.attr("cy")))
        // megaPalettes[name].apply = tFrom.name

        if (type === "from") {
            related = from.attr("to")
        } else {
            related = to.attr("from")
        }


        let id = from.attr("nAnchor")

        let nb = elem.attr("nAnchor")


        // setAnchorOnAllMarks(tname, tx, ty, +id)

        setAnchorOnAllMarks(tname, tx, ty, +id, nb, related)
        updateDotsAndSvgs()


    }
}

function dragended(event, d) {
    // d3.select(this).attr("stroke", null);
    // let elem = d3.select(this)
    updateSvg()
}


function dragElement3(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    let placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");

    let key = elmnt.getAttribute("key");

    function dragMouseDown(e) {
        e = e || window.event;
        // e.preventDefault();
        selectedDataColumn = elmnt.getAttribute("datacolumn");
        const rect = elmnt.getBoundingClientRect();

        offsetX = e.clientX - rect.left
        offsetY = e.clientY - rect.top;

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        elmnt.style.position = "absolute";

        let rect = elmnt.parentElement.getBoundingClientRect();

        // elmnt.style.left =
        //     ((e.pageX ) - tcords.x) + "px";
        let parentRect = elmnt.parentElement.getBoundingClientRect()
        console.log(parentRect.top);
        elmnt.style.top =
            ((e.pageY - offsetY + 50) - (parentRect.top -40)) + "px";
        // console.log('sdsadas');

        // elmnt.style.top  = e.pageY  - (rect.top + rect.height / 2);


        // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


        let container = document.getElementById("list-" + key)
        let tt = getInsertionPoint(container, e.pageY)
        // tt === placeholder.nextSibling ||

        if (tt.matches(".colorBrand") || tt.matches(".sizeDiv")) {
            return;
        }
        if (tt) {
            container.insertBefore(placeholder, tt);
        } else {
            container.appendChild(placeholder);
        }

    }

    function closeDragElement(e) {
        // stop moving when mouse button is released:
        elmnt.style.position = "";
        elmnt.style.top = ""
        elmnt.style.left = ""
        document.onmouseup = null;
        document.onmousemove = null;
        dragging = false
        let telem = placeholder.nextSibling

        if (telem !== null) {
            let curNb = elmnt.getAttribute("number")


            let id = elmnt.getAttribute("id").split("mark_")[1].split("_mark")[0]
            let tkeys = Object.keys(megaPalettes[id].encodings.range.marks)
            let nb = tkeys[tkeys.length - 1]

            if (telem.getAttribute("id") != null) {
                nb = telem.getAttribute("number")
            }


            // console.log("from:", curNb, " to:", nb)

            let nMarks = {}
            let tid = tkeys.indexOf(nb)
            let oldid = tkeys.indexOf(curNb)
            for (let i = 0; i < tkeys.length; i++) {

                if (i === tid) {
                    nMarks[curNb] = megaPalettes[id].encodings.range.marks[curNb]
                    nMarks[nb] = megaPalettes[id].encodings.range.marks[nb]
                } else if (i === oldid) {

                } else {
                    nMarks[tkeys[i]] = megaPalettes[id].encodings.range.marks[tkeys[i]]
                }
            }
            megaPalettes[id].encodings.range.marks = nMarks

            placeholder.replaceWith(elmnt);

            updateSvg()
        }
    }
}


function getInsertionPoint(container, mouseY) {
    const items = [...container.children].filter(
        el =>
            !el.classList.contains("dragging") &&
            !el.classList.contains("placeholder")
    );

    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    for (const item of items) {
        const rect = item.getBoundingClientRect();
        const offset = mouseY - (rect.top + rect.height / 2);

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = item;
        }
    }

    return closest;
}

/////////////////// Drag marks in composition

function markDragStarted(event, d) {
    let mark = d3.select(this)
    markOffx = event.x - mark.attr("x")
    markOffy = event.y - mark.attr("y")

    console.log();
    mark.style("cursor", "grabbing");
}

function markDragged(event, d) {
    let elem = d3.select(this)

    let name = elem.attr("id").replace("collage-", "")
    console.log(name);

    // console.log(event.x, "vs", drawnMarks[name].x, "with", markOffx)

    elem.attr("x", event.x- markOffx);
    elem.attr("y", event.y - markOffy);

    drawnMarks[name].x = event.x- markOffx
    drawnMarks[name].y = event.y - markOffy
    // drawnMarks[name]
    // d3.select("circles")
    drawAllCollageAnchor()
}

function markDragEnded(event, d) {
    // if (!event.active) simulation.alphaTarget(0);
    // d.fx = null;
    // d.fy = null;
    let mark = d3.select(this)
    mark.style("cursor", "grab");
    markOffx =0
    markOffy =0
}