import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, numOfChars: string, display: string): string {
       let limit = numOfChars ? parseInt(numOfChars, 10) : 10;
       let trail = display ? display : '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}