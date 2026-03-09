import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
deleteDoc,
updateDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


let reservasCache=[];

const calendarGrid=document.getElementById("calendarGrid");
const selectedDayDiv=document.getElementById("selectedDay");

const historialModal=document.getElementById("historialModal");
const historialBody=document.getElementById("historialBody");

let clienteActual=null;



async function cargarReservas(){

const snap=await getDocs(collection(db,"reservas"));

reservasCache=snap.docs.map(d=>({
id:d.id,
...d.data()
}));

renderCalendar();

}



function renderCalendar(){

calendarGrid.innerHTML="";

for(let i=1;i<=31;i++){

const day=document.createElement("div");
day.className="day";
day.innerText=i;

const dia=i.toString().padStart(2,"0");

const tieneReserva=reservasCache.some(r=>{

if(!r.fecha) return false;

return r.fecha.includes("-"+dia);

});

if(tieneReserva){
day.classList.add("has-reservation");
}

day.onclick=()=>mostrarReservasDia(dia);

calendarGrid.appendChild(day);

}

}



async function mostrarReservasDia(dia){

selectedDayDiv.innerHTML="";

const reservas=reservasCache.filter(r=>{

if(!r.fecha) return false;

return r.fecha.includes("-"+dia);

});

for(const r of reservas){

let nombre="Cliente";
let email="";

if(r.clientId){

const clienteSnap=await getDoc(doc(db,"clients",r.clientId));

if(clienteSnap.exists()){

const c=clienteSnap.data();
nombre=c.fullName || "Cliente";
email=c.email || "";

}

}

const registro=r.registroSesion || "";

const servicio=r.servicioNombre || r.servicio || "";

const card=document.createElement("div");
card.className="reserva-card";

card.innerHTML=`

<strong>${r.hora} · ${nombre}</strong>

<br>Servicio: ${servicio}

<br>Email: ${email}

<br><br>

<div class="registro-box">

<textarea>${registro}</textarea>

<button class="btn-guardar">Guardar registro</button>

</div>

<button class="btn-historial">Historial del cliente</button>

<button class="btn-cancel">Cancelar turno</button>

`;

const textarea=card.querySelector("textarea");
const btnGuardar=card.querySelector(".btn-guardar");
const btnHistorial=card.querySelector(".btn-historial");
const btnCancel=card.querySelector(".btn-cancel");


btnGuardar.onclick=async()=>{

await updateDoc(doc(db,"reservas",r.id),{
registroSesion:textarea.value
});

card.querySelector(".registro-box").innerHTML=

`Registro guardado ✓ 
<br>
<button class="btn-historial">Ver / editar</button>`;

};


btnHistorial.onclick=()=>abrirHistorial(r.clientId);


btnCancel.onclick=async()=>{

await deleteDoc(doc(db,"reservas",r.id));

alert("Turno cancelado");

cargarReservas();

};


selectedDayDiv.appendChild(card);

}

}



async function abrirHistorial(clientId){

clienteActual=clientId;

const q=query(
collection(db,"reservas"),
where("clientId","==",clientId)
);

const snap=await getDocs(q);

historialBody.innerHTML="";

snap.forEach(d=>{

const r=d.data();

historialBody.innerHTML+=`

<p>

<strong>${r.fecha}</strong>

<br>${r.servicioNombre || r.servicio || ""}

<br>${r.registroSesion || ""}

</p>

<hr>

`;

});

historialModal.style.display="flex";

}



document.getElementById("exportPDF").onclick=async function(){

let contenido = historialBody.innerText;

let nombreCliente = "Cliente";

if(clienteActual){

const clienteSnap = await getDoc(doc(db,"clients",clienteActual));

if(clienteSnap.exists()){

nombreCliente = clienteSnap.data().fullName || "Cliente";

}

}

const ventana = window.open();

ventana.document.write(`
<html>

<head>

<title>Historial</title>

<style>

body{
font-family:Arial;
padding:40px;
}

h1{
margin-bottom:5px;
}

h2{
margin-top:0;
color:#555;
}

pre{
font-family:inherit;
font-size:14px;
line-height:1.6;
}

</style>

</head>

<body>

<h1>Espacio Mimar</h1>

<h2>Historial de tratamientos</h2>

<p><strong>Cliente:</strong> ${nombreCliente}</p>

<hr>

<pre>${contenido}</pre>

</body>

</html>
`);

ventana.print();

};



cargarReservas();