const btn = document.getElementById("btnEnviar");

btn.onclick = async () => {

try {

const respuesta = await fetch(
"https://enviarconfirmacionturno-iccpnou5ja-uc.a.run.app",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
nombre: "Braulio",
telefono: "5493757671229",
servicio: "Prueba",
fecha: "Hoy",
hora: "Ahora"
})
}
);

const texto = await respuesta.text();

document.getElementById("estado").innerText = texto;

} catch (error) {

console.error(error);
document.getElementById("estado").innerText = "Error enviando mensaje";

}

};