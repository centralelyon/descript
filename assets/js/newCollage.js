let drawnMarks = {}
const spiralOptions = {
    padding: 30,
    step: 12,
    maxRadius: 150,
};

let tFrom, tTo = {}

let anchoring = false

let newAnchors = []
let anchoringRef = ""
let nAnchor = 0

let collageMod = "details"

function placeMark() {

    let rects = Object.keys(drawnMarks).map(d => drawnMarks[d])
    if (Object.keys(drawnMarks).length === 0) {
        return {x: 125 - 30, y: 125 - 30, w: 60, h: 60};
    } else {
        return placeRectangleSpiral(rects,
            {w: 60, h: 60}, spiralOptions
        )
    }

}

function setMarker() {
    let svg = d3.select("#composition")

    svg.selectAll("defs").remove("*");

    let def = svg.append("defs")

    let marker = def.append("marker")
        .attr("id", "arrow")
        .attr("refX", "-0")
        .attr("refY", "3.5")
        .attr("markerWidth", "7")
        .attr("markerHeight", "7")
        .attr("orient", "auto")


    // marker.append("path")
    //     .attr("d", "M 0 5 L 8 0 L 8 9 z")
    //     .attr("stroke-width", 3)
    //     .attr("stroke", "red")
    //     .attr("fill", "none")

    marker.append("image")
        .attr("xlink:href", "assets/images/buttons/side.png")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "7")
        .attr("height", "7")
}


function addPaletteInfoToCollage(palette, name) {

    let svg = d3.select("#composition")

    let show = palette.encodings.range.marks["mark0"].proto.canvas

    drawnMarks[name] = placeMark()
    setMarker()

    svg.append("g")
        .attr("id","g-"+name)
        .append("image")
        .attr("class", "collageElement")
        .style("outline", `${collageColScale(name)} solid 3px`)
        .attr("xlink:href", show.toDataURL("image/png"))
        .attr("id", `collage-${name}`)
        .attr("x", drawnMarks[name].x)
        .attr("y", drawnMarks[name].y)
        .attr("width", drawnMarks[name].w)
        .attr("height", drawnMarks[name].h)
        .on("click", function (e) {
            let elem = e.target
            if (collageMod !== "details") {
                if (!anchoring) {
                    anchoring = true
                    anchoringRef = name

                    let imCord = {x: +elem.getAttribute("x"), y: +elem.getAttribute("y")}

                    let offx = e.offsetX - imCord.x
                    let offy = e.offsetY - imCord.y
                    svg.append("circle")
                        .attr("cx", drawnMarks[name].x + offx)
                        .attr("cy", drawnMarks[name].y + offy)
                        .attr("r", 5)
                        .attr("fill", drawnMarks[name].x)
                        .attr("type", "from")
                        .attr("from", name)
                        .attr("name", name)
                        .attr("nAnchor", nAnchor)
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended))

                    tFrom = {x: drawnMarks[name].x + offx, y: drawnMarks[name].y + offy, rx: offx, ry: offy, name: name}
                    megaPalettes[name].linkto = name
                    setAnchorOnAllMarks(name, offx, offy, nAnchor, "")
                } else {
                    if (anchoringRef !== name) {

                        let imCord = {x: +elem.getAttribute("x"), y: +elem.getAttribute("y")}


                        let offx = e.offsetX - imCord.x
                        let offy = e.offsetY - imCord.y


                        svg.append("circle")
                            .attr("cx", drawnMarks[name].x + offx)
                            .attr("cy", drawnMarks[name].y + offy)
                            .attr("r", 5)
                            .attr("fill", drawnMarks[name].x)
                            .call(dragCircle)

                        //TODO: Add a link
                        tTo = {
                            x: drawnMarks[name].x + offx,
                            y: drawnMarks[name].y + offy,
                            rx: offx,
                            ry: offy,
                            name: name
                        }


                        const cx = (tFrom.x + tTo.x) / 2;
                        const curve = 2;


                        svg.append("path")
                            // .attr("d", `M ${tFrom.x} ${tFrom.y} Q ${cx} ${curve} ${tTo.x} ${tTo.y}`)
                            .attr("d", makeLink(tFrom.x, tFrom.y, tTo.x, tTo.y))
                            .attr("marker-mid", "url(#arrow)")
                            .attr("stroke-width", 3)
                            .style("stroke", "#424242")
                            .attr("fill", "none")


                        // .attr("stroke", drawnMarks[name].x)

                        megaPalettes[name].apply = tFrom.name
                        megaPalettes[name].linkTo = nAnchor
                        setAnchorOnAllMarks(name, offx, offy, nAnchor,tFrom.name)
                        // setAnchorOnAllMarks(tFrom.name, offx, offy, name)
                        nAnchor++
                        anchoring = false
                        anchoringRef = ""

                    } else {
                        let imCord = {x: +elem.getAttribute("x"), y: +elem.getAttribute("y")}


                        let offx = e.offsetX - imCord.x
                        let offy = e.offsetY - imCord.y
                        svg.append("circle")
                            .attr("cx", drawnMarks[name].x + offx)
                            .attr("cy", drawnMarks[name].y + offy)
                            .attr("r", 5)
                            .attr("fill", drawnMarks[name].x)
                            .attr("type", "to")
                            .attr("from", tFrom.name)
                            .attr("to", tTo.name)
                            .attr("name", name)
                            .attr("nAnchor", nAnchor)
                            .call(d3.drag()
                                .on("start", dragstarted)
                                .on("drag", dragged)
                                .on("end", dragended))
                    }
                }

            } else {

                // displayPalette(name)

            }
        })

    let tkeys = Object.keys(drawnMarks)

    if (tkeys.length > 1) {
        console.log(tkeys[0]);
        setAnchorOnAllMarks(name, drawnMarks[name].w * 0.5, drawnMarks[name].h * 0.5, nAnchor,0,tkeys[0])
        setAnchorOnAllMarks(tkeys[0], drawnMarks[tkeys[0]].w * 0.5, drawnMarks[tkeys[0]].h * 0.5, nAnchor,0,name)
        megaPalettes[tkeys[0]].linkto = tkeys[0]

        tFrom = {
            x: drawnMarks[tkeys[0]].x + drawnMarks[tkeys[0]].w * 0.5,
            y: drawnMarks[tkeys[0]].y + drawnMarks[tkeys[0]].h * 0.5,
            name: tkeys[0]
        }
        tTo = {
            x: drawnMarks[name].x + drawnMarks[name].w * 0.5,
            y: drawnMarks[name].y + drawnMarks[name].h * 0.5,
            name: name
        }


        svg.append("path")
            // .attr("d", `M ${tFrom.x} ${tFrom.y} Q ${cx} ${curve} ${tTo.x} ${tTo.y}`)
            .attr("d", makeLink(tFrom.x, tFrom.y, tTo.x, tTo.y))
            .attr("stroke-width", 3)
            .style("stroke", "#424242")
            .attr("fill", "none")
            .attr("name", name)
        // .attr("marker-mid", "url(#arrow)")
        // .attr("stroke", drawnMarks[name].x)


        svg.append("circle")
            .attr("cx", tFrom.x)
            .attr("cy", tFrom.y)
            .attr("type", "from")
            .style("fill", collageColScale(tTo.name))
            .attr("from", tFrom.name)
            .attr("to", tTo.name)
            .attr("name", name)
            .attr("nAnchor", nAnchor)
            .attr("r", 5)

            .attr("fill", drawnMarks[name].x)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))


        svg.append("circle")
            .attr("cx", tTo.x)
            .attr("cy", tTo.y)
            .attr("type", "to")
            .attr("from", tFrom.name)
            .attr("to", tTo.name)
            .attr("name", name)
            .style("fill", collageColScale(tFrom.name))
            .attr("nAnchor", nAnchor)
            .attr("r", 5)
            .attr("fill", drawnMarks[name].x)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        megaPalettes[name].apply = tFrom.name
        megaPalettes[name].linkTo = nAnchor
        nAnchor++
    }
}

function hidePalette() {
    const container = document.getElementById("paletteDetails")
    container.style.display = "none"
}


function delPalette(key) {

    delete megaPalettes[key]
    delete megaGlyph[key]
    delete dataBinding[key]
    d3.select("#collage-" + key).remove()
    d3.selectAll(`#composition circle[name="${key}"]`).remove()
    d3.select(`#composition path[name="${key}"]`).remove()


    if(Object.keys(megaPalettes).length > 0){
        updateSvg()
    } else {
        d3.select("#fakePreviewSvg").selectAll("image").remove()
    }

    // hidePalette()
    d3.select(`.selectedPaletteRow[name='${key}']`).remove()
    d3.select(`#list-${key}`).remove()
}


function newSavePalette() {
    savePalette2(selectedPalette)
}

function displayPalette(name) {

    selectedPalette = name

    let trange = document.getElementById("strokewidth")

    trange.onchange = function (e) {

        const val = parseInt(document.getElementById("strokewidth").value);
        stWidth = val

    }

    document.getElementById('strokecolor').onchange = function () {

        stColor = this.value
    }


    const expo = document.createElement("button")
    expo.innerHTML = `<img class="buttonImg" src="/assets/images/buttons/export.png">`

    expo.setAttribute("class", "exportPaletteBtn")
    expo.setAttribute("id", "exportPaletteBtn_" + name)


    const tdiv = document.createElement("div")
    tdiv.id = "palette_" + name
    tdiv.className = "paletteName"
    tdiv.appendChild(expo)
    tdiv.innerHTML += `<input type="text" onchange="renameRow(this,'${name}')" row="${tdiv.id}" value="${name}" class="waypointTitle" />`

    const container = document.getElementById("paletteDetails")
    container.style.display = "flex"


    const containerTitle = document.getElementById("paletteTitle")
    const containerMarks = document.getElementById("paletteMarks")
    const containerControls = document.getElementById("paletteControls")

    containerTitle.innerHTML = ""
    containerMarks.innerHTML = ""
    containerControls.innerHTML = ""

    const palette = megaPalettes[name]
    containerTitle.appendChild(tdiv)


    document.getElementById("exportPaletteBtn_" + name).onclick = function (e) {

        // savePalette2(name)
        // console.log(e.target.parentElement);

        let tname = e.target.parentElement.getAttribute("name")

        appendSingle(palette, tname)
    }

    newSelectedPalette = name
    const tdiv_mark = document.createElement("div")
    tdiv_mark.id = "mark_" + name
    tdiv_mark.className = "paletteMark"
    tdiv_mark.setAttribute("key", name)

    tdiv_mark.onclick = function (e) {
        e.preventDefault()
        if (mode !== "anchor") {
            if (e.target.matches("canvas")) {
                editPalette(this)
            }
        } else {
            //TODO: Set for CATA and other primitive
            setAnchorOnProto(e, this)
        }
    }


    makeRangeMark(name, containerMarks, palette, "range")

    containerMarks.appendChild(tdiv_mark)

    // dragElement3(tdiv_mark)

    if (megaGlyph[name]) {
        let columns = Object.keys(chartDataset.data[0])
        let [tsel, opts] = makeDataColumnMenu(columns, name, megaGlyph[name].dataColumn)

        tsel.style.marginTop = "5px"

        let tdiv = document.createElement("div")
        tdiv.style.display = "flex";

        tdiv.innerHTML = `<p style="margin-top: 9px;
  margin-right: 6px;">Data Column: </p>`
        tdiv.appendChild(tsel)

        let color = makeParamOption("color", columns, name)
        let size = makeParamOption("size", columns, name)

        containerControls.appendChild(tdiv)
        containerControls.appendChild(color)
        containerControls.appendChild(size)

    }
}


function makePaletteControls(name, container, palette) {


}


function setAnchorOnAllMarks(name, x, y, from, nb,related) {


    for (const [id, value] of Object.entries(megaPalettes[name].encodings.range.marks)) {
        if (!value.proto.anchors) {
            value.proto.anchors = {}
        }

        value.proto.anchors[from] = {
            x: x,
            y: y,
            rx: x / 60,
            ry: y / 60,
            relatedTo: related
        }
    }
    if (selectedPalette === name) {
        d3.selectAll(`.markAnchorSvg circle[num="${nb}"]`).attr("fill",collageColScale(related)).transition().duration(60).attr("cx", x).attr("cy", y)
    }

}


function rand(n) {
    return (Math.random() - 0.5) * n;
}

function makeLink(x1, y1, x2, y2, tension = 0.3) {
    const dx = x2 - x1;


    const c1x = x1 + dx * tension + rand(40);
    const c1y = y1 + rand(40);
    const c2x = x2 - dx * tension + rand(40);
    const c2y = y2 + rand(40);

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}


function overlaps(a, b, padding = 0) {
    return !(
        a.x + a.w + padding <= b.x ||
        b.x + b.w + padding <= a.x ||
        a.y + a.h + padding <= b.y ||
        b.y + b.h + padding <= a.y
    );
}

function intersectsAny(rect, rects, padding = 0) {
    for (const other of rects) {
        if (overlaps(rect, other, padding)) {
            return true;
        }
    }
    return false;
}

function placeRectangleSpiral(
    rects,
    size,
    options = {}
) {


    // console.log(size);
    const center = {x: 125, y: 125}

    const containerWidth = 250
    const containerHeight = 250;

    const padding = options.padding ?? 6;
    const step = options.step ?? 12;

    const maxIterations = 5000;

    const GOLDEN_ANGLE =
        Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < maxIterations; i++) {

        // Faster radial growth
        const radius = step * Math.sqrt(i);

        const theta = i * GOLDEN_ANGLE;

        const x =
            center.x +
            Math.cos(theta) * radius -
            size.w / 2;

        const y =
            center.y +
            Math.sin(theta) * radius -
            size.h / 2;

        const candidate = {
            x,
            y,
            w: size.w,
            h: size.h,
        };

        // Reject outside container
        if (
            candidate.x < 0 ||
            candidate.y < 0 ||
            candidate.x + candidate.w > containerWidth ||
            candidate.y + candidate.h > containerHeight
        ) {
            continue;
        }

        // Reject overlaps
        if (!intersectsAny(candidate, rects, padding)) {
            return candidate;
        }
    }

    return null;
}

