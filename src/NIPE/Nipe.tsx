import React from "react";
import NIPEParser from "./main";

type NipeState = {
    stimulations: string[],
    logs: string[]
  }

export default class Nipe extends React.Component<{}, NipeState> {


    constructor(props: {}) {
        super(props);
        this.state = {
          stimulations: [
            "V 10:47:40",
            "S 10:50:25"
            ],
            logs: [
                "Date: 28/08/2020 10:01:03",
                "Time		Time(s)	NIPE	NIPEmoy	HR	Quality	Energy	Events",
                "10:01:04	1	0	0	0	0	0.912	",
                "10:01:05	2	0	0	0	0	0.925	",
                "10:01:06	3	0	0	0	0	0.932	",
                "10:01:07	4	0	0	0	0	0.947	",
            ]
        };


    }

    get stimulationsString() {
        return this.state.stimulations.join(`\n`);
    }
    
    get logsString() {
        return this.state.logs.join(`\n`);
    }


  handleChangeStimulations = (event: { target: { value: string; }; }) => {
    this.setState({stimulations: event.target.value.split(`\n`)});
  }

  handleChangeLogs = (event: { target: { value: string; }; }) => {
    this.setState({logs: event.target.value.split(`\n`)});
  }

  excecution = () => {
    NIPEParser.parse(this.state.stimulations, this.state.logs);
  }

    render() {
      return <div>
          <span>
            <p>Stimulations</p>
            <textarea name="Stimulation" id="logs" cols={30} rows={10} 
                value={this.stimulationsString}
                onChange={this.handleChangeStimulations}
            ></textarea>
          </span>
          <span>
            <p>Logs</p>
            <textarea name="logs" id="logs" cols={100} rows={10} 
            value={this.logsString}
            onChange={this.handleChangeLogs}
            ></textarea>
          </span>
          <div>
            <button onClick={this.excecution}> Executer le traitement </button>
          </div>
        </div>
        
      ;
    }
}