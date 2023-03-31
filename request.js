const request = require('request');
const cheerio = require("cheerio");
const chalk = require("chalk");
request('https://www.worldometers.info/coronavirus/', cb);

function cb(error, response, html) {
    if(error){
        console.error('error:', error);
    }else{
        handleHtml(html);
    }
  }

  function handleHtml(html){
    let selTool = cheerio.load(html);
    let arr = selTool(".maincounter-number span");
    // for(let i=0; i<arr.length; i++){
    //     let data = selTool(arr[i]).text();
    //     console.log("data : ",data);
    // }
    console.log(chalk.gray("Total Cases : " + selTool(arr[0]).text()));
    console.log(chalk.red("Deaths : " + selTool(arr[1]).text()));
    console.log(chalk.green("Recovered : " + selTool(arr[2]).text()));
}