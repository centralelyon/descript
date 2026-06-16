let dataList = ["week15.csv", "week26.csv", "pinguins.csv"]


Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}



function fakeWeek15() {

    let dataProfile = {
        "topics": ["work", "dear-data", "looks", "personality", "specific"],
        "who": ["boyfriend", "stefanie", "friend", "acquaintance", "coworker","family","stranger"],
        "medium": ["twitter", "email", "text", "real-life", "phone"],
        "compliment": ["gave", "received"]
    }

    let n = 87

    let tkeys = Object.keys(dataProfile)

    const dataset = []

    for (let i = 0; i < n; i++) {

        let t = {}
        for (let j = 0; j < tkeys.length; j++) {
            t[tkeys[j]] = dataProfile[tkeys[j]].sample()

        }
        dataset.push(t)
    }

    return dataset
}

function fillSidePanel() {


    let opts = ""
    let select = document.getElementById("availableData")
    select.innerHTML = ""
    for (let i = 0; i < dataList.length; i++) {

        opts += `<option value="${dataList[i]}">${dataList[i]}</option>`
    }

    select.innerHTML = opts

    // const container = document.getElementById("datasetInfo")
    //
    // container.innerHTML = ""
    //
    // let tkeys = Object.keys(chartDataset.data[0])
    //
    // for (let i = 0; i < tkeys.length; i++) {
    //
    //     let cont = isCont(chartDataset.data, tkeys[i])
    //     if (cont) {
    //         let trange = d3.extent(chartDataset.data.map(d => d[tkeys[i]]))
    //         container.innerHTML += `<div dataColumn="${tkeys[i]}" class="dataRow"><p  class="dataColumn">${tkeys[i]}: </p><p>  [${trange[0]}-${trange[1]}]</p></div>`
    //     } else {
    //
    //         let set = new Set(chartDataset.data.map(d => d[tkeys[i]]));
    //         container.innerHTML += `<div dataColumn="${tkeys[i]}" class="dataRow"><p class="dataColumn">${tkeys[i]}: </p><p> [${Array.from(set)}]</p></div>`
    //     }
    //
    //
    // }
    //
    // const elements = document.querySelectorAll(".dataRow")
    //
    // for (let i = 0; i < elements.length; i++) {
    //
    //
    //     dragElement2(elements[i])
    // }


}


function fillTable() {
    let table = document.getElementById("newDataTable")
    let tkeys = Object.keys(chartDataset.data[0])
    let row = document.createElement("tr")
    for (let i = 0; i < tkeys.length; i++) {

        let th = document.createElement("th")

        th.innerHTML = tkeys[i]
        // row.innerHTML += `<th>${tkeys[i]}</th>`
            dragElement2(th)

        row.appendChild(th)

    }
    table.appendChild(row)
    for (let i = 0; i < chartDataset.data.length; i++) {
        let row = document.createElement("tr")
        for (let j = 0; j < tkeys.length; j++) {
            row.innerHTML += `<td>${chartDataset.data[i][tkeys[j]]}</td>`
        }
        table.appendChild(row)

    }


}