let fs = require("fs");
let xlsx = require("xlsx");


function excelWriter(filePath, data, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}


function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(excelData);
    return;
}