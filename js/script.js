import { db } from "./firebase.js"; 
import {
  collection, getDocs, getDoc, doc, query, where, addDoc, setDoc, serverTimestamp, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- VERIFICACIÓN DE CARGA ---
console.log("Script cargado correctamente desde la carpeta JS");

const btnIngresar = document.getElementById("btn-ingresar");

if (btnIngresar) {
    btnIngresar.addEventListener("click", async () => {
        // Capturamos los 3 datos
        const keyword = document.getElementById("usuario").value.toUpperCase().trim();
        const email = document.getElementById("email").value.trim();
        const whatsapp = document.getElementById("whatsapp").value.trim();

        // Validación
        if (!keyword || !email || !whatsapp) {
            alert("Por favor, completa los 3 campos: Usuario, Email y WhatsApp.");
            return;
        }

        try {
            console.log("Intentando conectar con Firestore para:", keyword);
            const clienteRef = doc(db, "clients", keyword);
            const clienteSnap = await getDoc(clienteRef);

            if (clienteSnap.exists()) {
                // Si ya existe, actualizamos sus datos de contacto
                await updateDoc(clienteRef, { 
                    email: email, 
                    telefono: whatsapp 
                });
            } else {
                // Si es nuevo, lo creamos
                await setDoc(clienteRef, {
                    nombre: keyword,
                    email: email,
                    telefono: whatsapp,
                    monthlyLimit: 4,
                    role: "client"
                });
            }

            // Guardamos sesión y avisamos
            localStorage.setItem("usuario", keyword);
            alert("¡Ingreso exitoso! Hola " + keyword);
            
            // Recargamos para que el sistema reconozca al usuario
            location.reload(); 

        } catch (error) {
            console.error("Error detallado:", error);
            alert("Error al conectar: " + error.message);
        }
    });
} else {
    console.error("No se encontró el botón con ID 'btn-ingresar'. Revisa tu HTML.");
}