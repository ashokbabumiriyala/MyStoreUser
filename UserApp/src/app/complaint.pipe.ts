import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'complaint'
})
export class ComplaintPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
