const serverBaseUrl = "https://randou.liris.cnrs.fr/vizapi/descript-sketches/"

let username = ""
let password = ""
let credentials = ""
let useServer = true

async function getPaletteList() {

    let palettes = await d3.json(serverBaseUrl + "palettes")


    for (const [key, value] of Object.entries(palettes)) {

        let t = await loadStateFromJson(serverBaseUrl + "palettes/" + value.name)

        console.log(t);

        if (!t.preloadName) {
            t.originImg = await getImage(t.originImg)
        }


        appendSingle(t, value.name)
    }

}


function login() {
    username = prompt("Username:");
    password = prompt("Password:");

    credentials = btoa(`${username}:${password}`);
}


function uploadPalette(palette, name) {

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


    const blob = new Blob([JSON.stringify(tt)], {type: "application/json"})
    const data = new FormData();

    data.append(
        "file",
        blob,
        name + ".json"
    );


    fetch(serverBaseUrl + "palettes", {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${credentials}`,
        },
        body: data
    })
}