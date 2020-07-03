/**
* utils.mjs
* utility functions to be used all over the app
**/

/**
* rounding a number to 2 decimals and add " ' " for big numbers
* @param {number} number to be formatted
* @return {string} the formatted string
**/
export function numberFormat(number){
    if(typeof number !== "number")
        return number;
    let nmbr = Math.round(number * 100) / 100;
    let str = nmbr.toString();
    let index;
    index = str.indexOf(".");
    if (index === -1){
        index = str.length;
    }
    while (index > 3){
        index -= 3;
        str = str.substring(0, index) + "'" + str.substring(index, str.length);
    }
    return str;
}

/**
* calculate the pearson correlation between two given data arrays
* @param {Array} x first data array
* @param {Array} y second data array
* @return {number} the pearson correlation
**/
export function pearsonCorrelation(x, y) {
    let n = x.length;
    let sum_X = 0, sum_Y = 0, sum_XY = 0;
    let squareSum_X = 0, squareSum_Y = 0;

    for (let i = 0; i < n; i++) {
        // sum of elements of array X.
        sum_X = sum_X + x[i];

        // sum of elements of array Y.
        sum_Y = sum_Y + y[i];

        // sum of X[i] * Y[i].
        sum_XY = sum_XY + x[i] * y[i];

        // sum of square of array elements.
        squareSum_X = squareSum_X + x[i] * x[i];
        squareSum_Y = squareSum_Y + y[i] * y[i];
    }

    // use formula for calculating correlation coefficient r.
    let r = (n * sum_XY - sum_X * sum_Y)/
                (Math.sqrt((n * squareSum_X -
                sum_X * sum_X) * (n * squareSum_Y -
                sum_Y * sum_Y)));

    r = Math.round(r * 1000) / 1000;

    // happens when the filtered hospital list returns no hospitals (ex. CMI brutto, filter "psychiatrische klinik"),
    // then the args are invalid and r is NaN.
    if (isNaN(r)) {
        r = "-";
    }

    return r;
}

/**
 * Calculates and returns a hex color
 * @return {String} The hex color as a string.
 */
export function calculateCircleColor(item, year){
    let color;
    if(item.attributes["Typ"] == null) {
	return "black";
    }
    switch (item.attributes["Typ"][year]) {
        // unispital
        case ("K111"):
            color = "#a72a2a";
            break;
        // allgemeinspital zentrumsversorgung
        case ("K112"):
            color = "#a79f2a";
            break;
        // allgemeinspital grundversorgung
        case ("K121"):
            color = "#2da72a";
            break;
        case ("K122"):
            color = "#2da72a";
            break;
        case ("K123"):
            color = "#2da72a";
            break;
        // psychiatrische klinik
        case ("K211"):
            color = "#2a8ea7";
            break;
        case ("K212"):
            color = "#2a8ea7";
            break;
        // rehaklinik
        case ("K221"):
            color = "#2d2aa7";
            break;
        // spezialklinik
        default :
            color = "#762aa7";
            break;
    }
    return color;
}
