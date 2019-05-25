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

/**
* calculate pearson correlation between two given data arrays
* @param {Array} x first data array
* @param {Array} y second data array
* @return {number} r the pearson correlation
**/
export function pearsonCorrelation(x, y){
    let n = x.length;
    let sum_X = 0, sum_Y = 0, sum_XY = 0;
    let squareSum_X = 0, squareSum_Y = 0;

    for (let i = 0; i < n; i++)
    {
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

    r = Math.round(r*1000)/1000;

    return r;
}
