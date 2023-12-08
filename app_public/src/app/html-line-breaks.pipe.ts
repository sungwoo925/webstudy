import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlLineBreaks'
})
export class HtmlLineBreaksPipe implements PipeTransform {

  transform(text: string, ...args: unknown[]): unknown {
    return text.replace(/\n/g,'</br>');
  }

}
