// url etc.com/etc/ no mp3 important note
// ex: numsUrls("https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/")
// output {"001":"link"}
function numsUrls(url){
    const surahList = {};
    for (let i = 1; i <= 114; i++) {
        const surahNumber = i.toString().padStart(3, '0'); // Pads the number to three digits
        const surahUrl = `${url}${surahNumber}.mp3;`
        surahList[surahNumber] = surahUrl;
      }
      return surahList
}
module.exports = {numsUrls}