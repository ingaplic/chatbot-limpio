const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai'); // ✅ SDK correcto para openai ^4.x
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Configuración con nuevo constructor
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const prompt = `
Eres un asistente virtual de soporte para colaboradores de Ingeniería Aplicada.
Ayudas con dudas sobre CAE, medidas como TRA050 (vehículo eléctrico) y RES060 (bomba de calor).
Si no puedes responder, pide que contacten con soporte técnico.

Duda del colaborador: ${userMessage}
`;

  try {
    // ✅ Llamada con el nuevo método del SDK v4.x
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });
 } catch (error) {
  console.error('Error al llamar a la API de OpenAI:', error.response?.data || error.message || error);
  res.status(500).json({ response: 'Error al generar respuesta.' });
}

});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
