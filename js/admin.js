import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
onSnapshot,
doc,
updateDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";


/* ============================= */
/* ESTILO BOTONES */
/* ============================= */

const style = document.createElement("style");

style.innerHTML = `

.pdfBtn{
margin-top:18px;
background:#72bd99;
border:none;
color:white;
padding:10px 18px;
border-radius:10px;
font-size:14px;
font-weight:500;
cursor:pointer;
transition:all .25s ease;
box-shadow:0 4px 10px rgba(0,0,0,0.08);
}

.pdfBtn:hover{
transform:translateY(-2px);
box-shadow:0 8px 18px rgba(0,0,0,0.15);
background:#63a886;
}

.pdfBtn:active{
transform:scale(.96);
}

`;

document.head.appendChild(style);



/* ============================= */
/* FIREBASE */
/* ============================= */

const firebaseConfig = {
apiKey: "TU_API_KEY",
authDomain: "TU_AUTH_DOMAIN",
projectId: "estetica-8d067",
storageBucket: "TU_BUCKET",
messagingSenderId: "TU_ID",
appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



/* ============================= */
/* VARIABLES */
/* ============================= */

let agendaContainer;
let listaHistorias;

let reservas=[];

let mesActual=new Date().getMonth();
let yearActual=new Date().getFullYear();



document.addEventListener("DOMContentLoaded",()=>{

agendaContainer=document.getElementById("agendaContainer");
listaHistorias=document.getElementById("listaHistorias");

cargarReservas();

});



/* ============================= */
/* CARGAR RESERVAS */
/* ============================= */

function cargarReservas(){

onSnapshot(collection(db,"reservas"),(snapshot)=>{

reservas=[];

snapshot.forEach(docu=>{
reservas.push({
id:docu.id,
...docu.data()
});
});

renderCalendario();

});

}



/* ============================= */
/* CALENDARIO */
/* ============================= */

function renderCalendario(){

agendaContainer.innerHTML="";

const primerDiaMes=new Date(yearActual,mesActual,1);
const diasMes=new Date(yearActual,mesActual+1,0).getDate();

let primerDia=primerDiaMes.getDay();
primerDia=(primerDia===0)?6:primerDia-1;

const calendario=document.createElement("div");

calendario.innerHTML=`

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">

<button id="prevMes" style="background:#72bd99;border:none;color:white;padding:8px 14px;border-radius:8px;cursor:pointer">
◀
</button>

<h2>${nombreMes(mesActual)} ${yearActual}</h2>

<button id="nextMes" style="background:#72bd99;border:none;color:white;padding:8px 14px;border-radius:8px;cursor:pointer">
▶
</button>

</div>

<div class="diasSemana">
<div>Lun</div>
<div>Mar</div>
<div>Mié</div>
<div>Jue</div>
<div>Vie</div>
<div>Sáb</div>
<div>Dom</div>
</div>

<div id="gridDias" class="gridDias"></div>

`;

agendaContainer.appendChild(calendario);

const grid=document.getElementById("gridDias");

for(let i=0;i<primerDia;i++){
grid.appendChild(document.createElement("div"));
}

for(let d=1;d<=diasMes;d++){

const fecha=`${yearActual}-${String(mesActual+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const reservasDia=reservas.filter(r=>r.fecha===fecha);

const day=document.createElement("div");

day.className="day";
day.innerText=d;

if(reservasDia.length>0){
day.classList.add("ocupado");
}

day.onclick=()=>mostrarTurnos(fecha,reservasDia);

grid.appendChild(day);

}

document.getElementById("prevMes").onclick=()=>{

mesActual--;

if(mesActual<0){
mesActual=11;
yearActual--;
}

renderCalendario();

};

document.getElementById("nextMes").onclick=()=>{

mesActual++;

if(mesActual>11){
mesActual=0;
yearActual++;
}

renderCalendario();

};

}



/* ============================= */
/* TURNOS */
/* ============================= */

function mostrarTurnos(fecha,lista){

agendaContainer.innerHTML="";

const titulo=document.createElement("h2");
titulo.innerText="Turnos "+fecha;

agendaContainer.appendChild(titulo);

lista.sort((a,b)=>a.hora.localeCompare(b.hora));

lista.forEach(turno=>{

const card=document.createElement("div");

card.style.background="white";
card.style.padding="20px";
card.style.borderRadius="12px";
card.style.marginBottom="15px";
card.style.boxShadow="0 2px 6px rgba(0,0,0,0.05)";

card.innerHTML=`

<h3>${turno.clientName || "Paciente"}</h3>
<p><b>Hora:</b> ${turno.hora}</p>
<p><b>Servicio:</b> ${turno.servicioNombre}</p>

<textarea placeholder="Registro tratamiento">${turno.registro || ""}</textarea>

<br><br>
<button class="guardar">Guardar</button>

`;

agendaContainer.appendChild(card);

});

const volver=document.createElement("button");

volver.innerText="Volver calendario";
volver.onclick=renderCalendario;

agendaContainer.appendChild(volver);

}



/* ============================= */
/* HISTORIAS CLINICAS */
/* ============================= */

window.mostrarHistorias = async function(){

document.getElementById("agendaPanel").style.display="none";
document.getElementById("historiasPanel").style.display="block";

listaHistorias.innerHTML="";

const buscador = document.createElement("input");

buscador.placeholder="🔎 Buscar paciente por nombre o DNI";
buscador.style.width="100%";
buscador.style.padding="14px";
buscador.style.marginBottom="25px";
buscador.style.borderRadius="10px";
buscador.style.border="1px solid #ccc";

listaHistorias.appendChild(buscador);

const contenedor=document.createElement("div");

listaHistorias.appendChild(contenedor);

const snapshot = await getDocs(collection(db,"historias"));

let pacientes=[];

snapshot.forEach(docu=>{
pacientes.push({
dni:docu.id,
...docu.data()
});
});

function render(lista){

contenedor.innerHTML="";

lista.forEach(data=>{

const card=document.createElement("div");

card.style.background="white";
card.style.padding="25px";
card.style.borderRadius="12px";
card.style.marginBottom="20px";
card.style.boxShadow="0 3px 10px rgba(0,0,0,0.05)";

card.innerHTML=`

<h3>${data.nombre}</h3>

<p><b>DNI:</b> ${data.dni}</p>
<p><b>Edad:</b> ${data.edad}</p>
<p><b>Teléfono:</b> ${data.telefono}</p>

<hr>

<b>Antecedentes salud</b>
<p>Enfermedad: ${data.enfermedad}</p>
<p>Medicación: ${data.medicacion}</p>
<p>Alergias: ${data.alergias}</p>

<hr>

<b>Antecedentes ginecológicos</b>
<p>Embarazo: ${data.embarazo}</p>
<p>Lactancia: ${data.lactancia}</p>

<hr>

<b>Antecedentes estéticos</b>
<p>Tratamientos previos: ${data.esteticos}</p>

<hr>

<b>Otros antecedentes</b>
<p>Marcapasos: ${data.marcapasos}</p>
<p>Implantes: ${data.implantes}</p>
<p>Cáncer: ${data.cancer}</p>

<br>

<button class="pdfBtn">📄 Exportar PDF</button>

`;

contenedor.appendChild(card);

card.querySelector(".pdfBtn").onclick=()=>exportarPDF(data);

});

}

render(pacientes);

buscador.addEventListener("input",()=>{

const texto=buscador.value.toLowerCase();

const filtrados=pacientes.filter(p=>
(p.nombre || "").toLowerCase().includes(texto) ||
(p.dni || "").includes(texto)
);

render(filtrados);

});

}



/* ============================= */
/* EXPORTAR PDF */
/* ============================= */

function exportarPDF(data){

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Historia clínica",20,20);

doc.setFontSize(12);

let y=40;

function linea(texto){

doc.text(texto,20,y);
y+=8;

}

linea("Nombre: "+data.nombre);
linea("DNI: "+data.dni);
linea("Edad: "+data.edad);
linea("Teléfono: "+data.telefono);

y+=5;
linea("Antecedentes salud");
linea("Enfermedad: "+data.enfermedad);
linea("Medicación: "+data.medicacion);
linea("Alergias: "+data.alergias);

y+=5;
linea("Antecedentes ginecológicos");
linea("Embarazo: "+data.embarazo);
linea("Lactancia: "+data.lactancia);

y+=5;
linea("Antecedentes estéticos");
linea("Tratamientos previos: "+data.esteticos);

y+=5;
linea("Otros antecedentes");
linea("Marcapasos: "+data.marcapasos);
linea("Implantes: "+data.implantes);
linea("Cáncer: "+data.cancer);

doc.save("historia_"+data.nombre+".pdf");

}



/* ============================= */
/* UTIL */
/* ============================= */

function nombreMes(m){

const meses=[
"Enero","Febrero","Marzo","Abril","Mayo","Junio",
"Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

return meses[m];

}