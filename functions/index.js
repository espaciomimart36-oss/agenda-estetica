const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// Credenciales extraídas de tus capturas
const TOKEN_PERMANENTE = "EAAMzA3ngIUkBQ630dPYUcq6NBWPoybtHpMw8KbMEqTzv49lsAXW9honZCnblqcVdlxltSO35kXQc42D8P6dNwgx2YN4JWxpCwUxoZAziQVyK5jZArVQYaL63CZChQNZCdZBppqIEymvfBbZCsrdBJbXnUnlpdj06DSpYorrgnkmZCJ4wda6M3pQEdIh1PRHOfwZDZD";
const PHONE_NUMBER_ID = "995248997010108";

exports.enviarConfirmacionTurno = functions.https.onRequest(async (req, res) => {
    
    // Configuración de CORS para que tu local no rebote
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).send("");
    }

    try {
        const { nombre, servicio, fecha, hora } = req.body;

        if (!nombre || !servicio || !fecha || !hora) {
            return res.status(400).json({ error: "Faltan datos en el body." });
        }

        // Buscamos al cliente por el campo 'username' como se ve en tu captura
        let clientSnapshot = await db.collection("clients")
            .where("username", "==", nombre.toLowerCase())
            .limit(1)
            .get();

        if (clientSnapshot.empty) {
            return res.status(404).json({ error: "Cliente no encontrado en Firestore." });
        }

        const clientData = clientSnapshot.docs[0].data();
        const rawPhone = clientData.phone; // Coincide con tu captura de Firestore
        const nombreReal = clientData.fullName || nombre;

        if (!rawPhone) {
            return res.status(400).json({ error: "El cliente no tiene número de teléfono." });
        }

        // Limpieza y formato del número (549 + número)
        let cleanPhone = rawPhone.toString().replace(/\D/g, "");
        if (!cleanPhone.startsWith("54")) {
            cleanPhone = "549" + cleanPhone;
        }

        // ENVÍO A WHATSAPP
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "template",
                template: {
                    name: "turno_confirmado", 
                    language: { code: "en" }, // CAMBIADO A "en" porque así figura en tu captura de Meta
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: nombreReal },
                                { type: "text", text: servicio },  
                                { type: "text", text: fecha },     
                                { type: "text", text: hora }       
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN_PERMANENTE}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({ status: "success", data: response.data });

    } catch (error) {
        console.error("Error en la Cloud Function:", error.response ? error.response.data : error.message);
        return res.status(500).json({ 
            error: "Error interno en el envío", 
            detalles: error.response ? error.response.data : error.message 
        });
    }
});