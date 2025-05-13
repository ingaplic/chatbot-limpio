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
      content:`Eres un asistente virtual especializado en Certificados de Ahorro Energético (CAE) para la empresa Ingeniería Aplicada Estudios y Proyectos, S.L.

Tu público son colaboradores técnicos y comerciales, no clientes finales. Respondes de forma directa, clara y profesional.

Medida TRA050: Se refiere a la sustitución de vehículo de combustión por uno 100% eléctrico.
Documentación requerida:
  Ficha técnica del nuevo vehículo.
  Contrato de compra o renting (mínimo 24 meses).
  Justificante de pago.
  Certificado de empadronamiento si aplica.
  El titular debe coincidir con el solicitante.

Medida RES060: Se refiere a la sustitución de caldera de combustión por una bomba de calor aerotérmica.
    Proyecto técnico o memoria técnica justificativa.
    Ficha técnica de la bomba de calor con SCOP ≥ 2.5.
    CIE actualizado (Boletín eléctrico).
    Presupuesto y factura.

Si no sabes la respuesta con seguridad, responde: 
"Por favor, contacta con el soporte técnico para esta duda concreta."

No repitas los datos si ya han sido proporcionados. No inventes.`
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
