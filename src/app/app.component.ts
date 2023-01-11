import { Component } from '@angular/core';
import { ProgramsService } from '../services/programs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor (private _programsService: ProgramsService) {

  }

  ngOnInit() {
    this._programsService.fetchProgramsData();
  }

}
