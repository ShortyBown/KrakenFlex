import { Helper } from "./services/helper";
import fs from "fs";
import path from "path";
import axiosBase from 'axios';

const basePath = `https://api.krakenflex.systems/interview-tests-mock-api/v1`;

const apiKey = fs.readFileSync(path.join(__dirname, '..', 'api_key', 'api-key.txt'), 'utf8');

const axios = axiosBase.create({
    baseURL: basePath,
    headers: {
        'x-api-key': `${apiKey}`
    }
});

const helper = new Helper(axios);

var site = process.argv.slice(2)[0];

if(site == null && site == undefined) {
  console.log("Please enter the site name");
  process.exit(0);
}

helper.getSiteInfo(site).then(npt => {
  helper.getOutages().then(outageList => {
    const filteredOutages = outageList.filter(outage => helper.filterByDate(outage, new Date("2022-01-01")))
            .filter(outage => helper.filterById(outage, npt.devices));
    filteredOutages.forEach(outage => {
      helper.attachDisplayName(outage, npt.devices)
    });
    helper.postOutages(filteredOutages, site);
  });
});