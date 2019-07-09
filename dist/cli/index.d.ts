import * as yargs from 'yargs';
export declare function compose(builder: any, ...otherBuilders: any[]): any;
export declare const buildMain: (args: yargs.Argv<{}>) => yargs.Argv<{
    D: boolean;
} & {
    debug: boolean;
}>;
export declare const build: any;
