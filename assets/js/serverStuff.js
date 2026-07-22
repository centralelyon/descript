const serverBaseUrl = "https://randou.liris.cnrs.fr/vizapi/descript-sketches/"

let username = ""
let password = ""
let credentials = ""
let useServer = true

async function getPaletteList() {

    let palettes = await d3.json(serverBaseUrl + "palettes")


    console.log(palettes);


    for (const [key, value] of Object.entries(palettes)) {
        palSources.push(key)


        let t = await loadSavedPalette(serverBaseUrl + "palettes/" + value.name)

        appendSingle(t, value.name)

    }

}


function login() {
    username = prompt("Username:");
    password = prompt("Password:");

    credentials = btoa(`${username}:${password}`);
}



function uploadPalette(palette,name) {

    if (credentials === "") {
        login()
    }
    let tsrc = palette.originImg.src

    let tt = JSON.parse(dumpObject(palette))
    if (tt.preloadName) {
        tt.originImg = ""
    } else {
        tt.originImg = tsrc
    }

    console.log(tt);

    const blob =  new Blob([JSON.stringify(tt)], {type: "application/json"})
    const data = new FormData();

    // data.append("document", blob, name+".json");
    // data.append("document", blob, name+".json");
    // data.append("document", JSON.stringify(tt));

    data.append(
        "document",
        new Blob([JSON.stringify(tt)], { type: "text/json" }),
        name+".json"
    );


    fetch(serverBaseUrl +"palettes", {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${credentials}`,
            'Accept': 'application/json',


        },
        body:  data


    })

}