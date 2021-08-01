import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'customdatetime' })
export class CustomDatetime implements PipeTransform {
    
    transform(date: Date | string, format: string = 'yyyy/MM/DD hh:mm:ss A'): string {
        // console.log(date);
        // date = new Date(date);  // if orginal type was a string
        // date = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        // console.log(date);
        // return new DatePipe('en-US').transform(date, format);
        var stillUtc = moment.utc(date).toDate();
        console.log(stillUtc);
        var temp = moment(stillUtc).local().format(format);
        console.log(temp);
        return temp;
    }
    
}