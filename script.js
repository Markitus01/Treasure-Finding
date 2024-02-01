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
    // Multipliquem x 1 per transformar la cadena que retorna el toFixed en un numero
    EL_MEU_LLOC[0] = p.coords.latitude.toFixed(3)*1;
    EL_MEU_LLOC[1] = p.coords.longitude.toFixed(3)*1;

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
    let zoom = 14;
    let map = L.map('mapa').setView(coordenades, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let ubi_tresor = amagar_tresor_f();
    moviment_f(map, ubi_tresor);
}

function moviment_f(map, tresor)
{
    let formulari = document.forms[0];
    let label_pista = document.createElement("label");
    formulari.appendChild(label_pista);

    let direccio, distancia;
    let historia_moviment = [];
    let pos = [];
    let m_ini = L.marker(EL_MEU_LLOC).addTo(map);  // Marcador inicial
    let m_act; // Marcador actual

    m_ini.bindPopup("<b>Punt inicial</b>").openPopup();
    pos.push(...EL_MEU_LLOC);
    L.marker(tresor).addTo(map);
    historia_moviment.push(pos.slice()); // Afegim la posicio inicial com a primera posició al historial 

    formulari.addEventListener("submit", function(e)
    {
        e.preventDefault();
        
        direccio = document.getElementsByName("sel_dir")[0];
        distancia = document.getElementsByName("distancia")[0];

        if (distancia.value != "")
        {
            // Si el marcador actual existeix, l'eliminem ja que será substituit pel nou
            if (m_act)
            {
                map.removeLayer(m_act);
            }

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
            // console.log(historia_moviment);
            /** INFO:
             * Hem de treballar amb una copia de "pos" > "novaPos", ja que si no a l'hora de fer
             * push al historial de moviments utilitzant "pos" totes les posicions de l'historial
             * acaben fent referencia a la ultima coordenada.
             */
            // Actualitzem posició
            pos[0] = novaPos[0].toFixed(3)*1;
            pos[1] = novaPos[1].toFixed(3)*1;
            m_act = L.marker(novaPos).addTo(map).bindPopup("<b>Punt actual</b>").openPopup();

            console.log(tresor, "Tresor");
            console.log(pos, "Tu");

            // Parsejem els arrays a strings per facilitar la comparació
            if (pos.toString() === tresor.toString())
            {
                alert("ENHORABONA, HAS TROBAT EL TRESOR");

                // Un cop trobat el tresor deshabilitem inputs
                document.getElementsByName("sel_dir")[0].disabled = true;
                document.getElementsByName("distancia")[0].disabled = true;
                document.getElementsByName("submit")[0].disabled = true;
                
                let linea = L.polyline(historia_moviment, { color: 'blue' }).addTo(map);

                let arrowHead = L.polylineDecorator(linea, {
                    patterns: [
                        { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: false, pathOptions: { color: 'blue' } }) }
                    ]
                }).addTo(map);

                label_pista.textContent = ""; // Netejem label pista si guanya
            }
            else // Si no l'ha trobat li donem una pista 
            {
                let pista = "Pista: ";
                if (novaPos[0] > tresor[0])
                {
                    pista += "més abaix ";
                }
                else if (novaPos[0] < tresor[0])
                {
                    pista += "més amunt ";
                }

                if (novaPos[1] > tresor[1])
                {
                    pista += "a l'esquerra ";
                }
                else if (novaPos[1] < tresor[1])
                {
                    pista += "a la dreta. ";
                }

                label_pista.textContent = pista;
            }
        }
        else
        {
            alert("Introdueix distancia!");
        }
    });
}

/** La funció crea 4 posibles posicions on amagar el tresor i retorna 1 */
function amagar_tresor_f()
{
    let coords = EL_MEU_LLOC;

    let ubis = []; // Array on guardarem les 4 posibles ubicacions

    for (let i = 0; i < 4; i++)
    {
        let tresor_lat = generarCoordenades(coords[0]-0.02, coords[0]+0.02, 3);
        let tresor_lon = generarCoordenades(coords[1]-0.02, coords[1]+0.02, 3);
        let tresor_ubi = [tresor_lat, tresor_lon];

        ubis.push(tresor_ubi);
    }
    // console.log(ubis);
    return ubis[Math.floor(Math.random() * ubis.length)];
}

// https://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
function generarCoordenades(from, to, fixed)
{
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}