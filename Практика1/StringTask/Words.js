// разделение строки на отдельные слова по пробелу (остальные символы игнорируются)
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

// подстрока строки от begin до end
String.prototype.getSubstring = function (begin, end) {
    let result = "";
    for (let i = begin; i < end; i++)
        result+= this[i];
    return result;
}

// нахождение первого по алфавиту слова в строке
function findFirst(splitWords) {
    let wordsCount = splitWords.length;
    if(wordsCount == 0) return null;
    let minWord = splitWords[0];
    for (let i = 0; i < wordsCount; i++) {
        if(splitWords[i] == minWord) continue;
        let wordLength = splitWords[i].length < minWord.length ? splitWords[i].length : minWord.length;
        // побуквенное сравнение двух слов
        for(let j = 0; j < wordLength; j++) {
            if(splitWords[i][j] < minWord[j]) {
                minWord = splitWords[i];
                break;
            }
            else if(splitWords[i][j] != minWord[j]) break;
        }
        // если текущее слово является подстрокой минимального по алфавиту, оно становится минимальным
        if ((splitWords[i].length < minWord.length) && (splitWords[i] == minWord.getSubstring(0, splitWords[i].length))) 
            minWord = splitWords[i];
    }
    return minWord;        
}

// размещение слов в строке в алфавитном порядке
function orderString() {
    let splitWords = splitString(document.getElementById("stringInput").value), wordsCount = splitWords.length;
    let result = "";
    for (let i = 0; i <  wordsCount; i++) {
        let minWord = findFirst(splitWords), index = splitWords.indexOf(minWord);
        result += minWord + " ";
        splitWords.splice(index, 1);
    }
    document.getElementById("yourString").innerHTML = "Ваша строка: " + document.getElementById("stringInput").value;
    document.getElementById("resultString").innerHTML = "Результат: " + result;
    console.log(result);
}
