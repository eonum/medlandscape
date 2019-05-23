/**
* utils.mjs
* functions to be used all over the app
**/

/**
* rounding a number to 2 decimals and add " ' " for big numbers
* @param {number} number to be formatted
* @return {string} str the formatted string
**/
export function numberFormat(number){
    let nmbr = Math.round(number*100)/100;
    let str = nmbr.toString();
    console.log(str);
    let index;
    index = str.indexOf(".");
    if (index = str.indexOf(".") === -1){
        index = str.length;
    }
    while (index > 3){
        index -= 3;
        str = str.substring(0, index) + "'" + str.substring(index, str.length);
    }
    return str;
}
