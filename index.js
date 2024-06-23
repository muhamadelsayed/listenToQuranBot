const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const {
  rawaias,
  voicesHafs,
  voicesWarsh,
  surahNamesArrOne,
  surahNamesArrTwo,
  surahNamesObj
} = require("./data/data.js");

let chosenRawaia = "";
const inlineKeyboardButtonsR = rawaias.map(item => {
  return [{ text: item, callback_data: item.toLowerCase() }];
});

let chosenVoice = "";

let chosenSurah = "";

let namesArrHafs = [];
Object.values(voicesHafs).forEach(e => {
  namesArrHafs.push(e.reciterName)
});

let namesArrWarsh = [];
Object.values(voicesWarsh).forEach(e => {
  namesArrWarsh.push(e.reciterName)
});

const inlineKeyboardHafs = namesArrHafs.map(item => {
  return [{ text: item, callback_data: item.toLowerCase() }];
});

const inlineKeyboardWarsh = namesArrWarsh.map(item => {
  return [{ text: item, callback_data: item.toLowerCase() }];
});

const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

const createInlineKeyboard = (array, chunkSize) => {
  return chunkArray(array, chunkSize).map(chunk => {
    return chunk.map(item => ({ text: item, callback_data: item.toLowerCase() }));
  });
};

const inlineKeyboardSurahOne = createInlineKeyboard(surahNamesArrOne, 3);
const inlineKeyboardSurahTwo = createInlineKeyboard(surahNamesArrTwo, 3);

console.log("bot is working successfully");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "السلام عليكم ورحمة الله وبركاته \n مرحبا بك في بوت استماع القرآن الكريم \n \n \n \n Developer : Muhammed Amr Sleem \n https://mostaql.com/u/abdelrahman_am/portfolio ");
  rawaiasF(chatId);
});

// handling all boxes

bot.on("callback_query", (callbackQuery) => {
  const msgText = callbackQuery.data.trim(); // this is the callback data
  const chatId = callbackQuery.message.chat.id;
  if (msgText === rawaias[0]) {
    chosenRawaia = rawaias[0];
    bot.sendMessage(chatId, "تم اختيار رواية حفص عن عاصم للعوده اضغط : /rawaias");
    voiceName(chatId);
  } else if (msgText === rawaias[1]) {
    chosenRawaia = rawaias[1];
    bot.sendMessage(chatId, "تم اختيار رواية ورش عن نافع للعوده اضغط : /rawaias");
    voiceName(chatId);
  } else {
    namesArrHafs.forEach(e => {
      if (msgText === e) {
        if (chosenRawaia) {
          chosenVoice = e;
          sendSurahNames(chatId);
        } else {
          rawaiasF(chatId);
        }
      }
    });
    namesArrWarsh.forEach(e => {
      if (msgText === e) {
        if (chosenRawaia) {
          chosenVoice = e;
          sendSurahNames(chatId);
        } else {
          rawaiasF(chatId);
        }
      }
    });

    surahNamesArrOne.forEach(e => {
      if (msgText === e) {
        if (chosenRawaia) {
          if (chosenVoice) {
            chosenSurah = msgText;
            sendSurahLink(chatId, chosenSurah);
          } else {
            voiceName(chatId);
          }
        } else {
          rawaiasF(chatId);
        }
      }
    });

    surahNamesArrTwo.forEach(e => {
      if (msgText === e) {
        if (chosenRawaia) {
          if (chosenVoice) {
            chosenSurah = msgText;
            sendSurahLink(chatId, chosenSurah);
          } else {
            voiceName(chatId);
          }
        } else {
          rawaiasF(chatId);
        }
      }
    });
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  let msgText = msg.text.trim();
  console.log(msgText);
  if (msgText === "/rawaias") {
    rawaiasF(chatId);
  } 
    else if (surahNamesArrOne.includes(msgText) || surahNamesArrTwo.includes(msgText)) {
    chosenSurah = msgText;
    console.log(true);
    if (chosenRawaia) {
      if (chosenVoice) {
        sendSurahLink(chatId, chosenSurah);
      } else {
        bot.sendMessage(chatId, "يجب اختيار القارئ");
        voiceName(chatId);
      }
    } else {
      bot.sendMessage(chatId, "يجب اولا اختيار الروايه");
      rawaiasF(chatId);
    }
  }
   else if (msgText !== "/start" && msgText !== "/rawaias") {
    bot.sendMessage(chatId, "أرسل /start لبدء استخدام البوت وسماع سور القرآن الكريم  . \n اذا اردت المساعده قم بقراءة وصف البوت");
  }
});

function rawaiasF(chatId) {
  bot.sendMessage(chatId, "قم باختيار الرواية المراد سماعها :", {
    reply_markup: {
      inline_keyboard: inlineKeyboardButtonsR
    }
  });
}

function voiceName(chatId) {
  if (chosenRawaia === rawaias[0]) {
    bot.sendMessage(chatId, "قم باختيار الشيخ المراد الاستماع اليه :", {
      reply_markup: {
        inline_keyboard: inlineKeyboardHafs
      }
    });
  } else {
    bot.sendMessage(chatId, "قم باختيار الشيخ المراد الاستماع اليه :", {
      reply_markup: {
        inline_keyboard: inlineKeyboardWarsh
      }
    });
  }
}

function sendSurahNames(chatId) {
  bot.sendMessage(chatId, "قم باختيار السورة \n او قم بكتابة اسم السوره مع ملاحظة ان يكون الاسم مطابقا لاسمها في المصحف", {
    reply_markup: {
      inline_keyboard: inlineKeyboardSurahOne
    }
  });
  bot.sendMessage(chatId, "---------------------------------------------------------------------------------------", {
    reply_markup: {
      inline_keyboard: inlineKeyboardSurahTwo
    }
  });
}

function sendSurahLink(chatId, surahName) {
  if (surahNamesArrOne.includes(surahName)) {
    let num = surahNamesArrOne.indexOf(surahName) + 1;
    bot.sendMessage(chatId, `قم بالدخول على الرابط للاستماع للسورة المطلوبة \n ${getTheLink(num)}`);
  } else if (surahNamesArrTwo.includes(surahName)) {
    let num = surahNamesArrTwo.indexOf(surahName) + 1 + 36;
    bot.sendMessage(chatId, `قم بالدخول على الرابط للاستماع للسورة المطلوبة \n ${getTheLink(num)}`);
  }
}

function getTheLink(num) {
  let strNum = num.toString();
  while (strNum.length < 3) {
    strNum = '0' + strNum;
  }
  let objVal = {};
  if (chosenRawaia === rawaias[0]) {
    objVal = voicesHafs;
  } else if (chosenRawaia === rawaias[1]) {
    objVal = voicesWarsh;
  }
  let link = "";
  Object.values(objVal).forEach(e => {
    if (e.reciterName === chosenVoice) {
      link = e.data[strNum];
    }
  });
  return link;
}
