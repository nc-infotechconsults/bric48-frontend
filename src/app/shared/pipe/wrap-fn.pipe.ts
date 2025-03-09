import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'wrapFn'
})
export class FunctionWrapperPipe implements PipeTransform {
    transform<T>(value: T, func: (...x: any[]) => any, ...args: any[]): ReturnType<typeof func> {
        return func(value, ...args);
    }
}