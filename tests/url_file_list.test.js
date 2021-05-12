const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");

test("check that all urls in a file list are crawled when the filelisturl param is passed", async () => {
  jest.setTimeout(30000);

  try{

    await exec("docker-compose run crawler crawl --collection filelisttest --urlFileList fixtures/urlSeedFile.txt");

  }
  catch (error) {
    console.log(error);
  }

  let crawled_pages = fs.readFileSync("crawls/collections/filelisttest/pages/pages.jsonl", "utf8");
  let seed_file = fs.readFileSync("tests/fixtures/urlSeedFile.txt", "utf8").split("\n").sort();

  let seed_file_list = [];
  for (var j = 0; j < seed_file.length; j++) {
    if (seed_file[j] != undefined){
      seed_file_list.push(seed_file[j]);
    }
  }
  
  let foundSeedUrl = true; 

  for (var i = 1; i < seed_file_list.length; i++) {
    if (crawled_pages.indexOf(seed_file_list[i]) == -1){
      foundSeedUrl = false;
    }
  }
  expect(foundSeedUrl).toBe(true);
});