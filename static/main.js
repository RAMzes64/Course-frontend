function createSubcategory(){
    const diagramCategory = document.getElementById("diagram-type")
    switch (diagramCategory.value){
        case "StandartScore": standartScoreSubcategory()
        
    }
}

function standartScoreSubcategory(){
    console.log("Запускается")
    const divContainer = document.getElementById("diagram-type-container-2");
    if (!document.getElementById("fireTypes-checkbox")){
        const divElement = document.createElement("div");
        divElement.classList.add("diagram-type-container");
        divElement.id = "fireTypes-checkbox";
        divElement.appendChild(fireTypeCheckBox())
        divContainer.after(divElement)
    }
    
}

function fireTypeCheckBox(){
    const fieldSet = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "Тип пожара"; 
    fieldSet.appendChild(legend)

    let url = new URL("http://127.0.0.1:5500/api/getFireTypes");
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status === 200) {
            const types = xhr.response;

            types.forEach(type => {            
                fieldSet.appendChild(createCheckBox(type.Type_id, type.Type_name, false));
            });
        }
    }
    xhr.send();
    fieldSet.appendChild(createCheckBox(0, "Все", true));
    return fieldSet
}

function createCheckBox(id, name, checked){
    const div = document.createElement("div");
    div.classList.add("fireTypeCheckBox")

    const label = document.createElement("label");
    label.setAttribute("for", id)
    label.innerText = name

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = id;
    checkBox.value = id;
    checkBox.name = name;
    checkBox.checked = checked;
    div.appendChild(label);
    div.appendChild(checkBox);
                
    return div
}

function regionsSelect() {
    const select = document.getElementById("region-select");

    let url = new URL("http://127.0.0.1:5500/api/getRegions");
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status === 200) {
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
}

async function getStandartScore(regionId, types){
    let url = new URL("http://localhost:5500/api/getStandartScoreStat");
    let xhr = new XMLHttpRequest(); 

    return new Promise((resolve, reject) => {
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                resolve(responseData);
            } else {
                reject('Ошибка при получении данных');
            }
        };
        
        xhr.onerror = function () {
            reject('Ошибка сети');
        };

        var params = new URLSearchParams();
        params.append('region_id', regionId);
        params.append('type1', types['type1']);
        params.append('type2', types['type2']);
        params.append('type3', types['type3']);
        params.append('type4', types['type4']);
        
        xhr.send(params.toString());
    });
    
}
function drawChart(data) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    ctx.font = "normal 10px sans-serif"

    // Настройки графика
    const padding = 100;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Нормализация данных
    const fireDates = data.map(item => item.Fire_date);
    const fireCounts = data.map(item => item.Fire_count);
    
    const maxFireCount = Math.max(...fireCounts);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем оси
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    ctx.stroke();
    
    // Рисуем точки и линии
    ctx.beginPath();
    
    // Добавляем метки на оси Y
    ctx.fillStyle = 'black';
    for (let i = 0; i <= 5; i++) {
        const yValue = Math.round((maxFireCount / 5) * i);
        const yPos = canvas.height - padding - (yValue / maxFireCount) * height;
        ctx.fillText(yValue, padding - 35, yPos + 5); // Смещение для текста
        ctx.beginPath();
        ctx.moveTo(padding - 5, yPos);
        ctx.lineTo(padding, yPos);
        ctx.stroke();
    }
    
    var date;
    fireCounts.forEach((count, index) => {
        const x = padding + (width / (fireCounts.length - 1)) * index;
        const y = canvas.height - padding - (count / maxFireCount) * height;
        
        // Рисуем линию до текущей точки
        ctx.lineTo(x, y);
        ctx.stroke();
        // Если условие выполняется, рисуем и заполняем круг
        if(data[index].Standart_score > 2){
            ctx.fillStyle = "red"; // Устанавливаем цвет заливки
            ctx.beginPath(); // Начинаем новый путь для круга
            ctx.arc(x, y, 5, 0, Math.PI * 2); // Рисуем круг
            ctx.fill(); // Заполняем круг цветом
            ctx.stroke();
        }
        // Ставим текстовые метки на оси X
        if (index % Math.ceil(fireCounts.length / 10) === 0) {
            ctx.fillStyle = 'black';
            date = fireDates[index].substr(4,2)+ "." +fireDates[index].substr(0,4) 
            ctx.fillText(date, x - 10, canvas.height - padding + 20);
            ctx.stroke();
        }
    });
    ctx.font = "bold 13pt Arial";
    ctx.fillText("Дата", width/2+83, canvas.height - padding + 40)
    ctx.fillText("Аномальные всплески количества пожаров", width/2-100, 40)
    ctx.stroke()

// Завершаем линию графика

}

function getDrawChart(){
    event.preventDefault();
    const regionId = document.getElementById("region-select").value
    switch (document.getElementById("diagram-type").value){
        case "StandartScore":    
            getStandartScore(regionId, getFireTypes()).then(data => {
                drawChart(data);
            }).catch(error => {
                console.error(error);
            });
        case "CircleFiretypes":    
    }
}

function getFireTypes() {
    const types = {}; 
    const fireTypeIds = ["type1", "type2", "type3", "type4"]; 

    if (document.getElementById("0").checked) {
        fireTypeIds.forEach((type, index) => {
            types[type] = index + 1; 
        });
    } else {
        fireTypeIds.forEach((type, index) => {
            const isChecked = document.getElementById((index + 1).toString()).checked;
            types[type] = isChecked ? index + 1 : "NULL";
        });
    }
    return types; 
}