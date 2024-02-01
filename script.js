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
    input.setAttribute("name", "distancia");
    input.setAttribute("max", "8");
    input.setAttribute("min", "1");
    input.setAttribute("placeholder", "Ex: 4");
    form.appendChild(input);
    
    let br2 = document.createElement("br");
    form.appendChild(br2);

    // Submit
    let submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("name", "submit");
    submit.setAttribute("value", "Moure's");
    form.appendChild(submit);
}

function crear_mapa_f()
{
    let coordenades = EL_MEU_LLOC;
    console.log(coordenades);
    let zoom = 14;
    let map = L.map('mapa').setView(coordenades, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    moviment_f(map);
    amagar_tresor_f(map);
}

function moviment_f(map)
{
    let formulari = document.forms[0];
    let direccio, distancia;
    let historia_moviment = [];
    let pos = [];
    let m = L.marker(EL_MEU_LLOC).addTo(map);  

    m.bindPopup("<b>Punt inicial</b>").openPopup();
    pos.push(...EL_MEU_LLOC);

    formulari.addEventListener("submit", function(e)
    {
        e.preventDefault();
        
        direccio = document.getElementsByName("sel_dir")[0];
        distancia = document.getElementsByName("distancia")[0];

        if (distancia.value != "")
        {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
            let novaPos = pos.slice(); // Fem una copia de pos
            switch (direccio.value)
            {
                case "amunt":
                    novaPos[0] = pos[0] + (distancia.value/1000);
                    break;

                case "abaix":
                    novaPos[0] = pos[0] - (distancia.value/1000);
                    break;

                case "esquerra":
                    novaPos[1] = pos[1] - (distancia.value/1000);
                    break;

                case "dreta":
                    novaPos[1] = pos[1] + (distancia.value/1000);
                    break;
            
                default:
                    console.log("Error en la direcció");
                    break;
            }

            historia_moviment.push(novaPos);
            /** INFO:
             * Hem de treballar amb una copia de "pos" "novaPos", ja que si no a l'hora de fer
             * push al historial de moviments utilitzant "pos" totes les posicions de l'historial
             * apuntaríen a la mateixa coordenada.
             */
            console.log(historia_moviment);
            pos = novaPos; // Actualitzem pos
            L.marker(pos).addTo(map);
        }
        else
        {
            alert("Introdueix distancia!");
        }
    });
}

function amagar_tresor_f(map)
{
    console.log(numRandom_f(1, 2));
}

function numRandom_f(min, max)
{
    let random = (Math.random() * (max - min + 1)) + 1; 
    return random.toFixed(3);
}