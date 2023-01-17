import { Outage } from "../models/outage";
import { Site } from "../models/site";
import { Device } from "../models/device";
import { AxiosInstance } from "axios";

export class Helper {

    axios: AxiosInstance;

    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }

    getOutages = async (): Promise<Outage[]> => {
        return await this.axios.get('/outages')
        .then(({data}) => data)
        .catch(err => {
            console.log("An error has occured when retrieving outages");
            process.exit(0);
        })
    };

    getSiteInfo = async (siteName: string): Promise<Site> => {
        return await this.axios.get('/site-info/' + siteName)
        .then(({data}) => data)
        .catch(err => {
            console.log("An error has occured when retrieving site information");
            process.exit(0);
        })
    };

    postOutages = async (outages: Outage[], siteName: string) => {
        this.axios.post('/site-outages/' + siteName, outages)
        .then(res => {
            console.log("Site outages posted successfully");
        })
        .catch(err => {
            console.log("An error has occured during your POST");
            process.exit(0);
        })
    }

    filterByDate = (outage: Outage, begin: Date) : boolean => {
        return new Date(outage.begin) >= begin;
    };

    filterById = (outage: Outage, devices: Device[]) : boolean => {
        var idInList = false;
        devices.forEach(device => {
            if(device.id === outage.id) {
            idInList = true;
            }
        });
        return idInList;
    };

    attachDisplayName = (outage: Outage, devices: Device[]) => {
        outage.name = devices.filter(device => device.id === outage.id)[0].name;
    }

}