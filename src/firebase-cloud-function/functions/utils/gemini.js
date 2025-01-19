const {defineString} = require("firebase-functions/params");
const {GoogleGenerativeAI} = require("@google/generative-ai");

const GEMINI_API_KEY = defineString("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-8b"});

const textOnly = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const multimodal = async (prompt, imageBinary) => {
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

module.exports = {textOnly, multimodal};
