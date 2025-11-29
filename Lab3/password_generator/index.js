const minLength = 0;
const maxlength = 0;
const includeLowercase = true;
const includeUppercase = true;
const includeNumbers = true;
const includeSymbols = true;
function handleGenerate(){
    const minLength = parseInt(document.getElementById("minLength").value);
    const maxLength = parseInt(document.getElementById("maxLength").value);

    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    const password = generatePassword(minLength, maxLength, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    document.getElementById("result").textContent = password;
}

function generatePassword(minLength, maxlength, includeLowercase, includeUppercase, includeNumbers, includeSymbols){
    const lowercaseChars = "abcdefghijklmnopqrstuvxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
    const numberChars = "0123456789"*3;
    const symbolChars = "!@#$%^&*()-=[]{};':<>?/.,";
    
    let allowedChars = "";
    let password = "";

    allowedChars += includeLowercase ? lowercaseChars : "";
    allowedChars += includeUppercase ? uppercaseChars : "";
    allowedChars += includeNumbers ? numberChars : "";
    allowedChars += includeSymbols ? symbolChars : "";

    if(minLength <= 0){
        return `Błąd! Minimalna długość hasła musi być równa co najmniej 1!`;
    }
    if(maxlength < minLength){
        return `Błąd! Maksymalna długość hasła nie może być mniejsza od minimalnej długości hasła!`
    }
    if(allowedChars.length === 0){
        return `Błąd! Wybierz co najmniej jeden zestaw znaków`;
    }

    const passwordLength = Math.floor(Math.random()*maxlength) + minLength;

    for(let i=0; i<passwordLength; i++){
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }
    return  `Wygenerowane hasło: ${password}`;
}
