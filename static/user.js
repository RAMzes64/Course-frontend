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
function insertData(){
    date = document.getElementById("dt").value;
    type = document.getElementById("typeSelect").value;
    lon = parseFloat(document.getElementById("lon").value);
    lat = parseFloat(document.getElementById("lat").value);
    region = document.getElementById("region-select").value;

    var xhr = new XMLHttpRequest(); 
    var url = new URL("http://localhost:5500/api/addData");
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var params = new URLSearchParams();
    params.append('login', localStorage.getItem("username"));
    params.append('password', localStorage.getItem("password"));
    params.append('dt', date);
    params.append('type_id', type);
    params.append('lon', lon);
    params.append('lat', lat);
    params.append('region_id', region);
    
    xhr.onload = function (){
        if (xhr.status === 200) {
            responce = JSON.parse(xhr.responseText);
            if (this.response == '"ok"'){
                alert("Данные добавлены в базу данных")
            } else {
                alert("Данные не были добавлены в базу данных")
            }
        } else {
            console.log(xhr.status)
            alert("Ошибку")   
        }
    }
    xhr.send(params.toString());
}


document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.addFireData');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        form.addEventListener('submit', insertData);
    });

    const hrefIndex = document.getElementById("index");
    hrefIndex.addEventListener("click", function(event){
        window.location.href = "index.html";
    })
});
