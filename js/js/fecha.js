import { db } from "./js/firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ====== EMAILJS ====== */
/* Usa tu PUBLIC KEY de EmailJS */
emailjs.init("TU_PUBLIC_KEY_AQUI");

/* IDs de EmailJS */
const EMAIL_SERVICE = "service_p8k8xah";
const EMAIL_TEMPLATE = "template_3nk7shm";

/* ===================== */

const params=new URLSearchParams(window.location.search);

const servicioId=params.get("sid");
const servicioNombre=decodeURIComponent(params.get("servicio")||"Servicio");

document.getElementById("titulo-servicio").innerText=servicioNombre;

const userDni=sessionStorage.getItem("userDni");

let clientName="";
let clientEmail="";

if(userDni){

const snap=await getDoc(doc(db,"clients",userDni));

if(snap.exists()){

clientName=snap.data().fullName;
clientEmail=snap.data().email;

document.getElementById("user-display").innerHTML=
`Cliente: <b>${clientName}</b>`;

}

}

let fechaGlobal="";
let horaGlobal="";

/* ===== cargar excepciones ===== */

const excepcionesSnap = await getDocs(collection(db,"calendarExceptions"));

const fechasBloqueadas=[];
const motivosBloqueo={};

excepcionesSnap.forEach(docSnap=>{

const data=docSnap.data();

if(data.active && data.type==="blocked"){

fechasBloqueadas.push(data.date);
motivosBloqueo[data.date]=data.reason;

}

});

/* ===== calendario ===== */

flatpickr("#calendar",{

inline:true,
locale:"es",

onDayCreate:(dObj,dStr,fp,dayElem)=>{

const fecha = dayElem.dateObj.toISOString().split("T")[0];

if(fechasBloqueadas.includes(fecha)){

dayElem.classList.add("dia-bloqueado");
dayElem.title="No disponible: "+motivosBloqueo[fecha];

}

},

onChange:(dates,dateStr)=>{

if(motivosBloqueo[dateStr]){

alert("No hay atención este día: "+motivosBloqueo[dateStr]);
return;

}

fechaGlobal=dateStr;

cargarHorarios(dateStr);

}

});

/* ===== horarios ===== */

async function cargarHorarios(fecha){

const container=document.getElementById("horarios");

container.innerHTML="Cargando horarios...";

const q=query(collection(db,"reservas"),where("fecha","==",fecha));

const snap=await getDocs(q);

const ocupados=snap.docs.map(d=>d.data().hora);

container.innerHTML="";

const horarios=[
"07:00","08:00","09:00","10:00","11:00","12:00",
"12:30","16:00","17:00","18:00","19:00","20:00","20:30"
];

horarios.forEach(h=>{

const btn=document.createElement("button");

btn.className="hora-btn";
btn.innerText=h;

if(ocupados.includes(h)){
btn.disabled=true;
}

btn.onclick=()=>{

document.querySelectorAll(".hora-btn")
.forEach(b=>b.classList.remove("selected"));

btn.classList.add("selected");

horaGlobal=h;

};

container.appendChild(btn);

});

}

/* ===== reservar ===== */

document.getElementById("btn-finalizar").onclick=async()=>{

if(!horaGlobal){

alert("Seleccioná un horario");
return;

}

await addDoc(collection(db,"reservas"),{

clientId:userDni,
clientName,
clientEmail,
servicioId,
servicioNombre,
fecha:fechaGlobal,
hora:horaGlobal,
timestamp:new Date()

});

/* ===== enviar correo ===== */

try{

await emailjs.send(
EMAIL_SERVICE,
EMAIL_TEMPLATE,
{
to_name: clientName,
to_email: clientEmail,
servicio: servicioNombre,
fecha: fechaGlobal,
hora: horaGlobal
}
);

}catch(error){

console.error("Error enviando email:", error);

}

/* ===== feedback UI ===== */

const btn=document.getElementById("btn-finalizar");

btn.innerText="Turno reservado ✓";
btn.style.background="#5fa887";
btn.disabled=true;

setTimeout(()=>{

window.location.href="index.html";

},1500);

};