export enum StimulationType {
    Visuel,
    Sonor,
}

export default class StimulationParser {

    stimulations: string[] = [];

    static parseStimulationTimes(lines : string[]): Stimulation[] {
        const res = [];

        for (const line of lines) {
            const [typeString, dateTime] = line.split(" ");


            let type : StimulationType;

            if(typeString === "V"){
                type = StimulationType.Visuel;
            }else if (typeString === "S"){
                type = StimulationType.Sonor;
            }else {
                throw new Error("La ligne n'est pas formatté correctement on attend `S 10:40:35`");
            }

            const date = new Date(Date.parse(`1970-01-01T${dateTime}`));

            res.push(new Stimulation(type, date));

        }

        return res;

    }

    static parseNIPEFiles(lines : string[]): NIPEFile {
        const res : NIPELog[] = [];

        const date = lines.shift();
        const header = lines.shift();

        for (const line of lines) {
            const [
                dateString,
                times,
                nipe,
                nipemoy,
                hr,
                quality,
                energy,
            ] = line.split(`\t`);

            const date = new Date(Date.parse(`1970-01-01T${dateString}`));

            res.push(new NIPELog(date, +times, +nipe, +nipemoy, +hr, +quality, +energy));

        }

        return new NIPEFile(date!, header!, res);

    }

}

export class NIPEFile {

    date: string;
    header: string[];
    logs: NIPELog[]

    constructor(date: string, header: string, logs: NIPELog[]){
        this.date = date;
        this.header = header.replace("\t\t", "\t").split("\t");
        this.logs = logs;
    }

}

export class NIPELog {

    date: Date;
    times: number;
    nipe: number;
    nipemoy: number;
    hr: number;
    quality: number;
    energy: number;
    events: number | null;

    stimulation: string = "";

    constructor(
        date: Date, 
        times: number, 
        nipe: number, 
        nipemoy: number, 
        hr: number, 
        quality: number, 
        energy: number, 
        //events: number,
    ){
        this.date = date;
        this.times = times;
        this.nipe = nipe;
        this.nipemoy = nipemoy;
        this.hr = hr;
        this.quality = quality;
        this.energy = energy;
        this.events = null;
    }

    toLine(): [string, number, number, number, number, number, number] {
        return [`${dateFormat(this.date)}`, this.times, this.nipe, this.nipemoy, this.hr, this.quality, this.energy];
    }

    toOneMinutOneMinuteLine(): [string, number, number, number, number, string] {
        return [`${dateFormat(this.date)}`, this.times, this.nipe, this.hr, this.quality, this.stimulation];
    }

    quinzeTrenteFcLine(): any {
        return [`${dateFormat(this.date)}`, this.hr, this.stimulation];
    }

    quinzeTrenteNipeLine(): any {
        return [`${dateFormat(this.date)}`, this.nipe, this.stimulation];
    }
}

function dateFormat(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    let hoursStr = `${hours}`;
    if (hoursStr.length === 1) hoursStr = "0" + hoursStr;

    let minutesStr = `${minutes}`;
    if (minutesStr.length === 1) minutesStr = "0" + minutesStr;

    let secondsStr = `${seconds}`;
    if (secondsStr.length === 1) secondsStr = "0" + secondsStr;

    return `${hoursStr}:${minutesStr}:${secondsStr}`
}


export class Stimulation {;

    type: StimulationType;
    date: Date;

    constructor(type: StimulationType, date: Date) {
        this.type = type;
        this.date = date;
    }

}
