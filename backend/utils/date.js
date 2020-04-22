function getFormattedDate(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let day = now.getDate();

    let formattedDate = twoDigits(day) + "/" + twoDigits(month) + "/" + twoDigits(year);
    return formattedDate;
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    return d.toString();
}


module.exports = getFormattedDate;