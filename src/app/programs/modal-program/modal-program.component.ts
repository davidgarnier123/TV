import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import { Inject } from '@angular/core';
import { TimeFormatService } from 'src/services/timeFormat.service';

@Component({
  selector: 'app-modal-program',
  templateUrl: './modal-program.component.html',
  styleUrls: ['./modal-program.component.less']
})
export class ModalProgramComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _timeFormatService: TimeFormatService) {

  }

  ngOnInit() {

  }

  formatDate = () => {
    
  }

}
