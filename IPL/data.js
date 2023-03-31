const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
let xlsx = require("xlsx");
const { strictEqual } = require("assert");


let iplPath = path.join(__dirname, "IPL_data");
dirCreator(iplPath);

const baseUrl = "https://www.espncricinfo.com";

const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/match-schedule-fixtures-and-results";

request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log("Error: ", error);
    } else {
        matches(html);
    }
}

function matches(html) {
    let $ = cheerio.load(html);
    let linksArr = $(".ds-border-r .ds-no-tap-higlight");
    // console.log(linksArr.length);
    for (let i = 0; i < linksArr.length; i += 6) {

        let link = baseUrl + $(linksArr[i]).attr('href');
        scorecardfn(link);

    }
}

function scorecardfn(url) {
    request(url, cb);

    function cb(error, response, html) {
        if (error) {
            console.log("Error: ", error);
        } else {
            scorecard(html);
        }
    }
}

function scorecard(html) {
    let $ = cheerio.load(html);
    let description = $("div[class='ds-text-tight-m ds-font-regular ds-text-typo-mid3']");
    let resultElem = $("p[class='ds-text-tight-m ds-font-regular ds-truncate ds-text-typo'] span");
    let StringArr = description.text().split(",");
    let venue = StringArr[1].trim();
    let date = (StringArr[2] + StringArr[3]).trim();
    let result = resultElem.text();
    let innings = $(".ds-rounded-lg div[class='ds-w-full ds-bg-fill-content-prime ds-overflow-hidden ds-rounded-xl ds-border ds-border-line ds-mb-4']");
    // console.log(innings.length);
    for (i = 0; i < innings.length; i++) {
        let teamName = $(innings[i]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();
        let allRows = $(innings[i]).find("tbody tr");
        let count = 0;
        // console.log(teamName);
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            if (allCols.length == 8) {
                let name = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let strikeRate = $(allCols[7]).text().trim();

                processPlayer(teamName, name, runs, balls, fours, sixes, strikeRate, opponentName, venue, date, result);

                

            }
        }
    }
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
} 

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
    return data;
}


function  processPlayer(teamName, name, runs, balls, fours, sixes, strikeRate, opponentName, venue, date, result){
    let teamPath = path.join(iplPath, teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, name + '.xlsx');
    let content = excelReader(filePath, name);
    let playerObject = {
        teamName, 
        name, 
        runs, 
        balls, 
        fours, 
        sixes, 
        strikeRate, 
        opponentName, 
        venue, 
        date, 
        result
    }
    content.push(playerObject);
    excelWriter(filePath, content, name)
}