const {defineString} = require("firebase-functions/params");
const {log} = require("firebase-functions/logger");
const {google} = require("googleapis");

const GOOGLE_SHEET_CLIENT_KEY = defineString("GOOGLE_SHEET_CLIENT_KEY");
const GOOGLE_SHEET_PRIVATE_KEY = defineString("GOOGLE_SHEET_PRIVATE_KEY");

// authenticate the service account
const googleAuth = new google.auth.JWT(
    GOOGLE_SHEET_CLIENT_KEY.value(),
    null,
    GOOGLE_SHEET_PRIVATE_KEY.value().replace(/\\n/g, "\n"),
    "https://www.googleapis.com/auth/spreadsheets",
);

const readSheet = async (spreadsheetId, range) => {
  try {
    const sheetInstance = await google.sheets({version: "v4", auth: googleAuth});
    const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
      auth: googleAuth,
      spreadsheetId,
      range,
    });
    const valuesFromSheet = infoObjectFromSheet.data.values;
    return valuesFromSheet;
  } catch (err) {
    log("readSheet func() error", err);
  }
};

const updateSheet = async (spreadsheetId, range, data) => {
  try {
    const sheetInstance = await google.sheets({version: "v4", auth: googleAuth});
    await sheetInstance.spreadsheets.values.update({
      auth: googleAuth,
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: data,
      },
    });
  } catch (err) {
    log("updateSheet func() error", err);
  }
};

const appendSheet = async (spreadsheetId, range, data) => {
  try {
    const sheetInstance = await google.sheets({version: "v4", auth: googleAuth});
    await sheetInstance.spreadsheets.values.append({
      auth: googleAuth,
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        majorDimension: "ROWS",
        values: data,
      },
    });
  } catch (err) {
    log("appendSheet func() error", err);
  }
};

module.exports = {readSheet, updateSheet, appendSheet};
