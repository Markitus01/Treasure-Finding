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

    // Creem les direccions
    let label_dir = document.createElement("label");
    let text = document.createTextNode("Tria una direcció: ");
    label_dir.appendChild(text);
    form.appendChild(label_dir);

    let opt_dir = document.createElement("select");
    opt_dir.setAttribute("name", "op_dir");
    form.appendChild(opt_dir);
    
    let amunt = document.createElement("option");
    amunt.setAttribute("value", "amunt");
    text = document.createTextNode("Amunt");
    amunt.appendChild(text);
    opt_dir.appendChild(amunt);

    let label_salt = document.createElement("label");
    text = document.createTextNode("Longitud del salt: ");
    label_salt.appendChild(text);
    form.appendChild(label_salt);
}

function crear_mapa_f()
{

}