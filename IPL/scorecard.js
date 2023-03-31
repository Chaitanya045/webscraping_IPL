const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");

let dirPath = "C:\Users\2152464\OneDrive - Cognizant\Pictures\Saved Pictures";

const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";

request(url, cb);

function cb(error, response, html){
    if(error){
        console.log("Error: ", error);
    }else{
        scorecard(html);
    }
}

function scorecard(html){
    let $ = cheerio.load(html);
    let description = $("div[class='ds-text-tight-m ds-font-regular ds-text-typo-mid3']");
    let resultElem = $("p[class='ds-text-tight-m ds-font-regular ds-truncate ds-text-typo'] span");
    let StringArr = description.text().split(",");
    let venue = StringArr[1].trim();
    let date = (StringArr[2]+StringArr[3]).trim();
    let result = resultElem.text();
    let innings = $(".ds-rounded-lg div[class='ds-w-full ds-bg-fill-content-prime ds-overflow-hidden ds-rounded-xl ds-border ds-border-line ds-mb-4']");
    console.log(innings.length);
    for(i=0; i<innings.length; i++){
        let teamName = $(innings[i]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();
        let opponentIndex = i==0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find("span[class='ds-text-title-xs ds-font-bold ds-capitalize']").text();
        let allRows = $(innings[i]).find("tbody tr");
        let count = 0;
        for(let j=0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find("td");   
            if(allCols.length==8){
                let name = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let strikeRate = $(allCols[7]).text().trim();

                console.log(`
                name : ${name}   | runs : ${runs}
                balls : ${balls} | fours : ${fours}
                sixes : ${sixes} | strikeRate : ${strikeRate}
                ---------------------------------------------
                `);
                count++;

            }
            console.log(count);
        }
    }



}