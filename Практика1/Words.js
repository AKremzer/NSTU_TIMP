function splitString(inputString) {
    let result = [], strLength = inputString.length, singleWord = "";
    for (let i = 0; i < strLength; i++) {
        if ((inputString[i] != ' ') && (inputString[i].toLowerCase() == inputString[i].toUpperCase())) continue;
        if ((inputString[i] == ' ') && (singleWord != "")) {
            result.push(singleWord);
            singleWord = "";
        }
        else singleWord += inputString[i];
    }
    if (singleWord != "") result.push(singleWord);
    return result;
}

function findFirst(splitWords) {
    let wordsCount = splitWords.length;
    if(wordsCount == 0) return null;
    let minWord = splitWords[0];
    for (let i = 0; i < wordsCount; i++) {
        if(splitWords[i] == minWord) continue;
        let wordLength = splitWords[i].length < minWord.length ? splitWords[i].length : minWord.length;
        for(let j = 0; j < wordLength; j++) {
            if(splitWords[i][j].toLowerCase() < minWord[j].toLowerCase()) {
                minWord = splitWords[i];
                break;
            }
            else if(splitWords[i][j].toLowerCase() != minWord[j].toLowerCase()) break;
        }
        if ((splitWords[i].length < minWord.length) && (splitWords[i].toLowerCase() == minWord.substring(0, splitWords[i].length).toLowerCase())) 
            minWord = splitWords[i];
    }
    return minWord;        
}

function orderString() {
    let splitWords = splitString(document.getElementById("stringInput").value);
    console.log(findFirst(splitWords));
}
