document.addEventListener("DOMContentLoaded", main_f);

const EL_MEU_LLOC = [];

function main_f()
{
    let m = document.querySelector('#mapa');
    m.setAttribute('style','height:500px;width:700px;');
    
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(funcioOk,funcioKo);
    }
}

function funcioOk(p)
{
    EL_MEU_LLOC[0] = p.coords.latitude;
    EL_MEU_LLOC[1] = p.coords.longitude;

    crear_form_f();
    crear_mapa_f();
}
function funcioKo(error)
{
    console.info(error.code);
    console.info(error.message);

    alert("Si no dones permís no pots gaudir del joc");
}

function crear_form_f()
{
    let main = document.getElementsByTagName("main")[0];

    let form = document.createElement("form");
    form.setAttribute("name", "formulari");
    form.setAttribute("action", "#");

    main.appendChild(form);

    // Creem direccions i distancia de salt
    let label_dir = document.createElement("label");
    let text = document.createTextNode("Tria una direcció: ");
    label_dir.appendChild(text);
    form.appendChild(label_dir);

    // Select de direccions
    let opt_dir = document.createElement("select");
    opt_dir.setAttribute("name", "sel_dir");
    form.appendChild(opt_dir);
    
    // Opcions del select
    let amunt = document.createElement("option");
    amunt.setAttribute("value", "amunt");
    text = document.createTextNode("Amunt");
    amunt.appendChild(text);
    opt_dir.appendChild(amunt);

    let abaix = document.createElement("option");
    abaix.setAttribute("value", "abaix");
    text = document.createTextNode("Abaix");
    abaix.appendChild(text);
    opt_dir.appendChild(abaix);

    let esquerra = document.createElement("option");
    esquerra.setAttribute("value", "esquerra");
    text = document.createTextNode("Esquerra");
    esquerra.appendChild(text);
    opt_dir.appendChild(esquerra);

    let dreta = document.createElement("option");
    dreta.setAttribute("value", "dreta");
    text = document.createTextNode("Dreta");
    dreta.appendChild(text);
    opt_dir.appendChild(dreta);

    let br = document.createElement("br");
    form.appendChild(br);

    // Inserció del salt
    let label_salt = document.createElement("label");
    text = document.createTextNode("Longitud del salt: ");
    label_salt.appendChild(text);
    form.appendChild(label_salt);

    let input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("max", "1000");
    input.setAttribute("min", "0");
    input.setAttribute("placeholder", "Ex: 33");
    form.appendChild(input);
}

function crear_mapa_f()
{
    let coordenades = EL_MEU_LLOC;
    console.info(coordenades);
    let zoom = 16; // com més gran, més aprop del lloc
    let map = L.map('mapa').setView(coordenades, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    marcador_f(map)
}

function marcador_f(map)
{
    let m = L.marker(EL_MEU_LLOC).addTo(map);  

    m.bindPopup("<b>Punt inicial</b>").openPopup();
    
    let pos = [];
    pos.push(...EL_MEU_LLOC);
    // latitud 90 -90
    // longitud 180 -180
    //pos[0]= pos[0]-0.002;// restar latitud desplaçament al sud
    pos[0]= pos[0]+0.05; // sumar latitud desplaçament al nord
    //pos[1]= pos[1]-0.02; // restar longitud desplaçament al oest
    //pos[1]= pos[1]+0.05; // sumar longitud desplaçament a l'est
    
    // PUNTS EXTREMS MAPA
    //pos=[75,180]; // nord,est
    //pos=[180,-75];// nord,oest
    //pos=[-75,180]; // sud,est
    //pos=[-75,-180]; // sud,oest
    
    // console.info(pos);
    // L.marker(pos).addTo(map).bindPopup("<i>Aquí no hi som</i>");
}