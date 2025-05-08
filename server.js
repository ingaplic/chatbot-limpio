const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // ← importante

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const prompt = `
Eres un asistente virtual de soporte para colaboradores de Ingeniería Aplicada.
Ayudas con dudas sobre CAE, medidas como TRA050 (vehículo eléctrico) y RES060 (bomba de calor).
Si no puedes responder, pide que contacten con soporte técnico.

Duda del colaborador: ${userMessage}
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ response: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: 'Error al generar respuesta.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
