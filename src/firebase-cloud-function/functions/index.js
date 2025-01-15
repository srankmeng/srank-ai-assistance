const axios = require("axios");
const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const gemini = require("./utils/gemini");

const LINE_MESSAGING_API = defineString("LINE_MESSAGING_API");
const LINE_DATA_MESSAGING_API = defineString("LINE_DATA_MESSAGING_API");
const LINE_ACCESS_TOKEN = defineString("LINE_ACCESS_TOKEN");

exports.lineWebHook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;
    for (const event of events) {
      const inputRawText = event.message.text;
      const inputText = inputRawText.split(":")[1];

      switch (event.type) {
        case "message":
          if (inputRawText.includes("bot")) {
            // simple text
            if (event.message.type === "text" && !event.message.quotedMessageId) {
              const msg = await gemini.textOnly(inputText);
              await reply(event.replyToken, [{type: "text", text: msg}]);
              break;
            }

            // quoted the image
            if (event.message.type === "text" && event.message.quotedMessageId) {
              const imageBinary = await getImageBinary(event.message.quotedMessageId);
              const msg = await gemini.multimodal(imageBinary);
              await reply(event.replyToken, [{type: "text", text: msg}]);
              break;
            }
          }
          if (inputRawText.includes("up")) {
            // quoted the image
            if (event.message.type === "text" && event.message.quotedMessageId) {
              // const imageBinary = await getImageBinary(event.message.quotedMessageId);
              // const msg = await gemini.multimodal(imageBinary);
              await reply(event.replyToken, [{type: "text", text: "uuuouo"}]);
              break;
            }
          }
          await reply(event.replyToken, [{type: "text", text: "ข้อความไม่ตรงเงื่อนไข ขออภัยมณี สุดสาคร สินสมุทร"}]);
          break;
      }
    }
  }
  res.send(req.method);
});

const reply = async (replyToken, payload) => {
  const res = await axios({
    method: "post",
    url: `${LINE_MESSAGING_API.value()}/message/reply`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_ACCESS_TOKEN.value()}`,
    },
    data: {
      replyToken: replyToken,
      messages: payload,
    },
  });
  return res;
};

const getImageBinary = async (messageId) => {
  const originalImage = await axios({
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_ACCESS_TOKEN.value()}`,
    },
    url: `${LINE_DATA_MESSAGING_API.value()}/message/${messageId}/content`,
    responseType: "arraybuffer",
  });
  return originalImage.data;
};

// // If call llm local
// const llmRequest = async (message) => {
//   const res = await axios({
//     method: "post",
//     url: LLM_URL.value(),
//     data: {
//       message,
//     },
//   });

//   return res;
// };
