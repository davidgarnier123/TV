import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ProgramsService } from '../../services/programs.service';
import { TimeFormatService } from '../../services/timeFormat.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalProgramComponent } from './modal-program/modal-program.component';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent implements OnInit {
  public dialogConfig = new MatDialogConfig();
  public modalDialog: MatDialogRef<ModalProgramComponent, any> | undefined;

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


  constructor(public _timeFormatService: TimeFormatService ,private _programsService: ProgramsService, public matDialog: MatDialog) { }

  ngOnInit(): void {
    this._programsService.subject.subscribe( (data: any) => {
      this.channels = data.data;
      this.findProgramsNow();
    })
  }

  public findProgramsNow = () => {
    let nowTs = moment().add(1, 'hour').unix();

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
    // get current date at 21h0m
    let tonightTs = moment().set('hour', 22).set('minute', 0).unix();
    // tomorrow
    if (this.selectedTime === 'tomorrow') {
      tonightTs = moment().set('hour', 22).set('minute', 0).add(1, 'day').unix();
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
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "auto";
    this.dialogConfig.width = "650px";
    this.dialogConfig.data = {programInfo: program}
    this.modalDialog = this.matDialog.open(ModalProgramComponent, this.dialogConfig);
  }


}
