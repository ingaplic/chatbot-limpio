const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const messages = [
    {
      role: 'system',
      content: `Eres un asistente virtual especializado en Certificados de Ahorro Energético (CAE) para la empresa Ingeniería Aplicada Estudios y Proyectos, S.L. 
Respondes con precisión, utilizando un lenguaje claro y profesional, enfocado a colaboradores técnicos y comerciales.
Si no puedes dar una respuesta exacta, indica educadamente que deben contactar con soporte técnico.
Tu estilo es directo, sin rodeos, pero siempre educado y servicial.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // Usa gpt-4-turbo si tienes acceso
      messages: messages,
      temperature: 0.3, // más precisión
      top_p: 0.8
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
