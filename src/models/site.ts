import { Device } from "./device";

export class Site {
    id: string;
    name: string;
    devices: Device[];

    constructor(id: string, name: string, devices: Device[]) {
        this.id = id;
        this.name = name;
        this.devices = devices;
    }
};