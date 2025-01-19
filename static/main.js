function downLoadData(){
    let url = new URL("localhost:8080/data.html");
    let xhr = new XMLHttpRequest(); 

    xhr.open('GET');
    xhr.responseType = 'json';
    xhr.onload = function (){

    }
}

function createSubcategory(){
    const diagramCategory = document.getElementById("diagram-type")
    console.log("Запускается")
    switch (diagramCategory.value){
        case "StandartScore": standartScoreSubcategory()
        
    }
}

function standartScoreSubcategory(){
    const form = document.getElementById("diagram-form");
    const divElement = document.createElement("div");
    divElement.classList.add("diagram-type-container");
    divElement.id = "region-select-div";
    
    if(!document.getElementById("select-region")){
        const label = document.createElement("label");
        label.setAttribute("for", "regions");
        label.innerText = "Регион ";
        divElement.appendChild(label);
    
        if (document.getElementById("select-region")){
            form.appendChild(divElement);
        }
        else{
            divElement.appendChild(regionsSelect());
            form.appendChild(divElement);
        }
    }

    const btn = document.createElement("input");
    btn.type = "submit";
    btn.onchange = function(){
        form.action = "http://127.0.0.1:5500/api/getStandartScoreChart"
    };
}

function regionsSelect(){
    const select = document.createElement("select");
    const option = document.createElement("option");
    option.value = ""
    option.textContent = "Выберите регион"
    select.appendChild(option);
    select.id = "select-region"

    let url = new URL("http://127.0.0.1:5500/api/getRegions");
    let xhr = new XMLHttpRequest(); 

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function (){
        if (xhr.status === 200){
            const regions = xhr.response;

            regions.forEach(region => {
                const option = document.createElement("option");
                option.value = region.Region_id;
                option.textContent = region.Region_name;
                select.appendChild(option);
            });
        }
    }
    xhr.send();

    return select;
}
