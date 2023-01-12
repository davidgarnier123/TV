import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimeFormatService {
  


  constructor() {
  }

  public timestampToDate = (timestamp: number) => {
    // we need to substract because api doest work with winter hours
    return moment.unix(timestamp).subtract(1, "hour").format('HH:mm');
  }
}
