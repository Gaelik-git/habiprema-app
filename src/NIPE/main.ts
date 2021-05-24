import StimulationParser, { NIPEFile, NIPELog, Stimulation, StimulationType } from "./parsing";
import * as xlsx from "xlsx";
import { WorkBook } from "xlsx";

export default class NIPEParser {

    stimulations : Stimulation[] = [];
    nipeFile: NIPEFile | null = null;

    uneminuteuneminte: NIPELog[] = [];
    quinzetrente: NIPELog[][] = [];

    static parse(stimulations: string[], logs: string[]) {
        const parser = new NIPEParser();
        parser.readStimulations(stimulations);
        parser.readNIPEfile(logs);
        parser.uneMinuteUneMinute();
        parser.quinzeTrenteMap();
        parser.writeAll();
    }

    readStimulations(fileContent: string[]) {
        const stimulation = StimulationParser.parseStimulationTimes(fileContent);
        this.stimulations = stimulation;
    }

    readNIPEfile(fileContent: string[]) {
        const nipeFile = StimulationParser.parseNIPEFiles(fileContent);
        this.nipeFile = nipeFile;
    }

    uneMinuteUneMinute() {

        this.uneminuteuneminte = this.nipeFile!.logs.filter(
            log => {
                const stim = this.stimulations.find(s => Math.abs(s.date.getTime() - log.date.getTime()) <= 60000 );
                if(!stim) return false;
                return true;
            }
        )

        this.stimulations.forEach(stim => {
            const log = this.uneminuteuneminte.find(log => log.date.getTime() === stim.date.getTime())!;
            const stimOfSameType = this.stimulations.filter(s => s.type === stim.type);
            const indexOfStim = stimOfSameType.findIndex( s => s == stim);
            const stimType = StimulationType[stim.type][0];

            log.stimulation = `${stimType}${ indexOfStim + 1}`;
        })
    }

    quinzeTrenteMap() {

        this.quinzetrente = this.stimulations.map(
            stimu => this.nipeFile!.logs.filter(
                log => {
                    const diff = (log.date.getTime() - stimu.date.getTime()) / 1000;
                    return diff >= -15 && diff <= 30
                }
            )
        )
    }

    getSheetOne(): unknown[] {
        return [
            [this.nipeFile!.date],
            this.nipeFile!.header,
            ...this.nipeFile!.logs.map(l => l.toLine())
        ]
    }

    getSheetTwo(): unknown[] {
        return [
            [this.nipeFile!.date],
            ["Time","Time(s)","NIPE","HR","Quality"],
            ...this.uneminuteuneminte.map(l => l.toOneMinutOneMinuteLine())
        ]
    }


    getSheetThree(): unknown[] {

        const lines = this.quinzetrente.map(p => p.map( l => l.quinzeTrenteFcLine()));
        const linesWithSeparator = lines.map(l => [...l, "", "", "", ""]);

        return [
            ["Time", "FC", "Stim"],
            ...linesWithSeparator.flat()
        ]
    }

    getSheetFour(): unknown[] {

        const lines = this.quinzetrente.map(p => p.map( l => l.quinzeTrenteNipeLine()));
        const linesWithSeparator = lines.map(l => [...l, "", "", "", ""]);

        return [
            ["Time", "NIPE", "Stim"],
            ...linesWithSeparator.flat()
        ]
    }

    writeAll() {

        const workBook: WorkBook = {
            Sheets: {
                "NIPE T" : xlsx.utils.json_to_sheet(this.getSheetOne()),
                "moins plus 1mn": xlsx.utils.json_to_sheet(this.getSheetTwo()),
                "FC 15-30": xlsx.utils.json_to_sheet(this.getSheetThree()),
                "NIPE 15-30": xlsx.utils.json_to_sheet(this.getSheetFour())
            },
            SheetNames: ["NIPE T", "moins plus 1mn", "FC 15-30", "NIPE 15-30"]
        };

        xlsx.writeFile(workBook, "nipe.xlsx")
    }
}

