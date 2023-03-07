import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  
  public subject = new Subject<any>();
  private allPrograms = [];

  constructor(private http: HttpClient) {
  }

  public fetchProgramsData = () => {
      const request1 = this.http.get('https://tv-api-v2.onrender.com/channels');
      const request2 = this.http.get('https://tv-api-v2.onrender.com/programs');

      forkJoin([request1, request2]).subscribe(results => {
        this.subject.next({channels: results[0], programs: results[1]})
      });
  }
}
