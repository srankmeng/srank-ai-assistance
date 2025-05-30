/* eslint-disable no-case-declarations */
const axios = require("axios");
const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const gemini = require("./utils/gemini");
const googleSheet = require("./utils/googleSheet");

const LINE_MESSAGING_API = defineString("LINE_MESSAGING_API");
const LINE_DATA_MESSAGING_API = defineString("LINE_DATA_MESSAGING_API");
const LINE_ACCESS_TOKEN = defineString("LINE_ACCESS_TOKEN");
const GOOGLE_SHEET_ID = defineString("GOOGLE_SHEET_ID");
const GOOGLE_SHEET_PAGE_NAME = defineString("GOOGLE_SHEET_PAGE_NAME");
const RANGE_COLUMN = "A:E";

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
              const prompt = "ช่วยบรรยายภาพนี้ให้หน่อย";
              const imageBinary = await getImageBinary(event.message.quotedMessageId);
              const msg = await gemini.multimodal(prompt, imageBinary);
              await reply(event.replyToken, [{type: "text", text: msg}]);
              break;
            }
          }
          if (inputRawText.includes("up")) {
            if (event.message.type === "text" && event.message.quotedMessageId) {
              const prompt = `ภาพนี้คือรูปใบเสร็จ คนโอนเงินคือ จาตุรงค์ โอนให้ร้านต่าง ๆ ช่วย convert รูปใบเสร็จและส่งมาในรูปแบบ JSON 1 item
                ประกอบด้วย field ต่อไปนี้:
                - datetime (date format dd/mm/yyyy HH:ss),
                - recipient (ผู้รับ),
                - amount (ตัวเลขอย่างเดียว ไม่เอา currency และ thoundsand comma),
                - note (บันทีกช่วยจำ ว่าใช้จ่ายอะไร เช่น ค่าอาหาร, ค่ารถ, บิลบัตรเครดิต เป็นต้น โดยถ้าไม่ระบุให้ส่งมาเป็น empty string)
                - day (date format d)
                EXAMPLE: {"datetime": "01/01/2023 05:28", "recipient": "คุณเอก บริษัทของเรา", "amount": "1000", "note": "ค่าข้าว", day: "1"}`;
              const imageBinary = await getImageBinary(event.message.quotedMessageId);
              const jsonText = await gemini.multimodalJson(prompt, imageBinary);
              const {datetime, recipient, amount, note, day} = JSON.parse(jsonText)[0];
              const appendSheetData = [
                [datetime, recipient, amount, note, day],
              ];

              await googleSheet.appendSheet(GOOGLE_SHEET_ID.value(), `${GOOGLE_SHEET_PAGE_NAME.value()}!${RANGE_COLUMN}`, appendSheetData);
              await reply(event.replyToken, [{type: "text", text: jsonText}]);
              break;
            }
          }
          await reply(event.replyToken, [{type: "text", text: "ข้อความไม่ตรงเงื่อนไข ขออภัยจ้า ลองใหม่อีกทีนะ"}]);
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
