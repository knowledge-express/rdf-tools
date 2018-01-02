#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const formatter = require("typescript-formatter");
const helpers_1 = require("./helpers");
const Package = require('../package');
const formatterOptions = {
    replace: false,
    verify: false,
    tsconfig: false,
    tsconfigFile: null,
    tslint: false,
    tslintFile: null,
    editorconfig: false,
    vscode: false,
    vscodeFile: null,
    tsfmt: false,
    tsfmtFile: null
};
if (require.main === module) {
    program
        .version(Package.version)
        .usage('[options] <pattern>');
    program.parse(process.argv);
    if (program.args.length === 0) {
        console.error('You must enter a glob pattern.');
        program.help();
        process.exit(1);
    }
    else {
        (() => __awaiter(this, void 0, void 0, function* () {
            const ontology = yield helpers_1.getOntology(program.args);
            const graph = yield helpers_1.getGraph(ontology);
            const ts = (yield formatter.processString('', helpers_1.tsify(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`, formatterOptions)).dest;
            console.log(ts);
        }))();
    }
    global["Knowledge"] = module.exports;
}
__export(require("./helpers"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQSxxQ0FBcUM7QUFDckMsa0RBQWtEO0FBRWxELHVDQUF5RDtBQUN6RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFdEMsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixPQUFPLEVBQUUsS0FBSztJQUNkLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUSxFQUFFLEtBQUs7SUFDZixZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLEVBQUUsS0FBSztJQUNiLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFlBQVksRUFBRSxLQUFLO0lBQ25CLE1BQU0sRUFBRSxLQUFLO0lBQ2IsVUFBVSxFQUFFLElBQUk7SUFDaEIsS0FBSyxFQUFFLEtBQUs7SUFDWixTQUFTLEVBQUUsSUFBSTtDQUNoQixDQUFDO0FBR0YsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE9BQU87U0FDSixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUN4QixLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUVoQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLENBQUMsR0FBUyxFQUFFO1lBQ1YsTUFBTSxRQUFRLEdBQUcsTUFBTSxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxNQUFNLEtBQUssR0FBRyxNQUFNLGtCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsTUFBTSxFQUFFLEdBQUksQ0FBQyxNQUFNLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyx5QkFBeUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3BKLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFBLENBQUMsRUFBRSxDQUFDO0lBQ1AsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCwrQkFBMEIifQ==