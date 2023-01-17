export class Outage {
    id: string;
    begin: Date;
    end: Date;
    name: string = "";

    constructor(id: string, begin: Date, end: Date) {
        this.id = id;
        this.begin = begin;
        this.end = end;
    }

    setName(name: string) {
        this.name = name;
    }
};