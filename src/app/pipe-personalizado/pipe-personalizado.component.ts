

import { PipeTransform, Injectable, Pipe }     from '@angular/core';

@Pipe({
    name: 'replace'
})
export class ReplacePipe implements PipeTransform {
    transform(value: number,
        currencySign: string = '',
        decimalLength: number = 0,
        chunkDelimiter: string = ',',
        decimalDelimiter: string = '.',
        chunkLength: number = 3): string {

        const result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
        const num = value.toFixed(Math.max(0, decimalLength));

        return currencySign+(decimalDelimiter ?
          num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
    }
}


