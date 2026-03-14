const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

const TOKEN = "EAAU0cYmeClEBQ7I7fM0Kk6tCIoe6FOu7TNPK7i0syT6Vfi0eQvzlmioSXh96ZBOvMgVBgxZBkZACERXMkiexzvE4SE0waWFzqkpaOtApowKwMEcZAe2DkqWrTExriudTaVSNE5bamhiQeLjPyzmhTeFhWZAHuhJGmPro79BiSZCBgXZCda4FKtvwZABhZBSHayvsoClSsVeL4T8lQNYgT8Ejdijf8lrv9f2PuaCEKyDWBwTUNaMgZBtwi3xkZB8n29LXjLYXnY8KpDI5ZAvSPDyw6JMx3lVfCvUjTVc41gZDZD";

const PHONE_NUMBER_ID = "1049101464950359";

exports.enviarConfirmacionTurno = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const { nombre, telefono, servicio, fecha, hora } = req.body;

    const mensaje =
`Hola ${nombre}

Tu turno en *Espacio Mimar T* fue confirmado.

Servicio: ${servicio}
Fecha: ${fecha}
Hora: ${hora}

Dirección: Andresito

Si necesitas modificar el turno avisanos.`;

    try {

      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: telefono,
          type: "text",
          text: {
            body: mensaje
          }
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      res.status(200).send("Mensaje enviado");

    } catch (error) {

      console.log(error.response?.data || error.message);
      res.status(500).send("Error enviando mensaje");

    }

  });
});