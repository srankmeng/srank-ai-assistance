const {defineString} = require("firebase-functions/params");
const {GoogleGenerativeAI, SchemaType} = require("@google/generative-ai");

const GEMINI_API_KEY = defineString("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());
const modelName = "gemini-2.0-flash-exp";

const textOnly = async (prompt) => {
  const model = genAI.getGenerativeModel({model: modelName});
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const multimodal = async (prompt, imageBinary) => {
  const model = genAI.getGenerativeModel({model: modelName});
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType,
      },
    },
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  return text;
};

const multimodalJson = async (prompt, imageBinary) => {
  const schema = {
    description: "List of recipes",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        datetime: {
          type: SchemaType.STRING,
          description: "Datetime format DD/MM/YYYY HH:MM of the receipt",
          nullable: false,
        },
        recipient: {
          type: SchemaType.STRING,
          description: "Recipient name, company of the receipt",
          nullable: false,
        },
        amount: {
          type: SchemaType.NUMBER,
          description: "Amount without currency of the receipt",
          nullable: false,
        },
        note: {
          type: SchemaType.STRING,
          description: "Note of receipt",
          nullable: true,
        },
        day: {
          type: SchemaType.STRING,
          description: "Datetime format D of the receipt",
          nullable: false,
        },
      },
      required: ["datetime", "recipient", "amount", "day"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(imageBinary, "binary").toString("base64"),
        mimeType,
      },
    },
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  return text;
};

module.exports = {textOnly, multimodal, multimodalJson};
