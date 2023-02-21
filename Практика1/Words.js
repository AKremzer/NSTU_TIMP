function splitString(inputString) {
    let result = [], strLength = inputString.length, singleWord = "";
    for (let i = 0; i < strLength; i++) {
        if((inputString[i] != ' ') && (inputString[i].toLowerCase() == inputString[i].toUpperCase())) continue;
        if(inputString[i] == ' ') {
            if(singleWord == "") continue;
            else {
                result.push(singleWord);
                singleWord = "";
            }
        }
        else singleWord += inputString[i];
    }
    if(singleWord != "") result.push(singleWord);
    console.log(result);
    return result;
}

function orderString() {
    splitString(document.getElementById("stringInput").value);
}
