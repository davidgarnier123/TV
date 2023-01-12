import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  
  public subject = new Subject<any>();
  private allPrograms = [];

  constructor(private http: HttpClient) {
  }

  public fetchProgramsData = () => {
      this.http.get('https://daga123-tv-api.onrender.com/getPrograms').toPromise().then( (data) => {
        this.subject.next(data)
      })
  }
}
