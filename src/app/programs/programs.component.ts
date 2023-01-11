import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ProgramsService } from '../../services/programs.service';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent implements OnInit {

  public channels: any = [];

  public selectedTime = 'now';

  public times = [
    {
      type: 'now',
      text: 'En ce moment'
    },
    {
      type: 'tonight',
      text: 'Ce soir'
    },
    {
      type: 'tomorrow',
      text: 'Demain'
    }
  ];


  constructor(private _programsService: ProgramsService) { }

  ngOnInit(): void {
    this._programsService.subject.subscribe( (data: any) => {
      console.log(data)
      this.channels = data.data;
      this.findProgramsNow();
    })
  }

  public findProgramsNow = () => {
    let nowTs = moment().unix();

    this.channels.forEach( (chan: any) => {
      chan.displayPrograms = [];
      let currentProgram = chan.programs.find( (a: any) => a.start < nowTs && a.end > nowTs);
      let currentProgramIndex = chan.programs.indexOf(currentProgram);
      let nextProgram = chan.programs[currentProgramIndex + 1];

      chan.displayPrograms.push(currentProgram);
      chan.displayPrograms.push(nextProgram);
    });
  }

  public findProgramTonight = () => {
    // get current date at 20h50m
    let tonightTs = moment().set('hour', 21).set('minute', 50).unix();
    // tomorrow
    if (this.selectedTime === 'tomorrow') {
      tonightTs = moment().set('hour', 21).set('minute', 50).add(1, 'day').unix();
    }

    this.channels.forEach( (chan: any) => {
      chan.displayPrograms = [];
      let firstProgram = chan.programs.find( (a: any) => a.start > tonightTs && moment(a.start).add(40, 'minute').unix() < a.end);
      let currentProgramIndex = chan.programs.indexOf(firstProgram);
      let nextProgram = chan.programs[currentProgramIndex + 1];

      chan.displayPrograms.push(firstProgram);
      chan.displayPrograms.push(nextProgram);
    });
  }

  public timestampToDate = (timestamp: number) => {
    return moment.unix(timestamp).format('HH:mm');
  }

  public changeTime = (typeTime: string) => {
    this.selectedTime = typeTime;
    if (this.selectedTime === 'now') {
      this.findProgramsNow();
    } else {
      this.findProgramTonight();
    }
  }
  
  public selectOther = () => {
    console.log('open modal');
  }

  public getInfo = (program: any) => {
    console.log(program);
  }


}
