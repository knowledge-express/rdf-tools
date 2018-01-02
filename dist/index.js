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
const helpers_1 = require("./helpers");
const Package = require('../package');
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
            const ts = helpers_1.tsify(graph) + `\n\nexport default {\n${Object.keys(graph).join(',\n')}\n}`;
            console.log(ts);
        }))();
    }
    global["Knowledge"] = module.exports;
}
__export(require("./helpers"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQSxxQ0FBcUM7QUFFckMsdUNBQXlEO0FBQ3pELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUd0QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUIsT0FBTztTQUNKLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ3hCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sQ0FBQyxHQUFTLEVBQUU7WUFDVixNQUFNLFFBQVEsR0FBRyxNQUFNLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELE1BQU0sS0FBSyxHQUFHLE1BQU0sa0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QyxNQUFNLEVBQUUsR0FBSSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcseUJBQXlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUEsQ0FBQyxFQUFFLENBQUM7SUFDUCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDdkMsQ0FBQztBQUVELCtCQUEwQiJ9