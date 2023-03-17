import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { ProgramsService } from '../../services/programs.service';
import { TimeFormatService } from '../../services/timeFormat.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalProgramComponent } from './modal-program/modal-program.component';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden <=> visible', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class ProgramsComponent implements OnInit {
  public dialogConfig = new MatDialogConfig();
  public modalDialog: MatDialogRef<ModalProgramComponent, any> | undefined;

  public channels: any = [];
  public programs: any = [];

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

  public currentState = 'hidden';

  constructor(public _timeFormatService: TimeFormatService ,private _programsService: ProgramsService, public matDialog: MatDialog) { }

  ngOnInit(): void {
    this._programsService.subject.subscribe( (data: any) => {
      this.channels = data.channels;
      this.programs = data.programs;
      for (const chaine of this.channels) {
        chaine.programs = this.programs
        .filter( (prog: any) => prog.channel === chaine.name);
      }
      this.findProgramsNow();
    })
  }

  changeCurrentIndex() {
    this.currentState = 'hidden';
  }

  animationFinished(event: AnimationEvent) {
    if (event.fromState === 'void' && event.toState === 'hidden') {
      this.currentState = 'visible';
    } else if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.currentState = 'visible';
      if (this.selectedTime === 'now') {
        this.findProgramsNow();
      } else {
        this.findProgramTonight();
      }
    }
  }

  public findProgramsNow = () => {
    let nowTs = moment().add(1, 'hour').unix();

    this.channels.forEach( (chan: any) => {
      chan.displayPrograms = [];
      let currentProgram = chan.programs.find( (a: any) => a.start < nowTs && a.end > nowTs);
      let currentProgramIndex = chan.programs.indexOf(currentProgram);
      let nextProgram = chan.programs[currentProgramIndex + 1];

      if (currentProgram) {
        chan.displayPrograms.push(currentProgram);
      }
      if (nextProgram) {
        chan.displayPrograms.push(nextProgram);
      }
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

      if (firstProgram) {
        chan.displayPrograms.push(firstProgram);
      }
      if (nextProgram) {
        chan.displayPrograms.push(nextProgram);
      }
    });
  }

  public changeTime = (typeTime: string) => {
    this.currentState = 'hidden';
    this.selectedTime = typeTime;
  }
  
  public selectOther = () => {
    console.log('open modal');
  }

  public getInfo = (program: any) => {
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "auto";
    this.dialogConfig.width = "650px";
    this.dialogConfig.panelClass = "modalInfo";
    this.dialogConfig.data = {programInfo: program}
    this.modalDialog = this.matDialog.open(ModalProgramComponent, this.dialogConfig);
  }


}
