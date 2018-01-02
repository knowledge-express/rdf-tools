"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const globby = require("globby");
const N3 = require("n3");
const semtools = require('semantic-toolkit');
function getFiles(patterns) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = yield globby(patterns, { expandDirectories: true });
        return paths.map(name => fs.readFileSync(name).toString());
    });
}
exports.getFiles = getFiles;
function getOntology(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield getFiles(pattern);
        return files.reduce((memo, data) => {
            return memo + '\n' + data;
        }, '');
    });
}
exports.getOntology = getOntology;
function getPrefixes(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        return (new Promise((resolve, reject) => {
            var prefixes;
            N3.Parser().parse(ontology, (error, triple, p) => {
                if (error)
                    return reject(error);
                prefixes = prefixes ? prefixes : p;
                if (triple === null)
                    return resolve(prefixes);
            });
        })).then(prefixes => {
            if ('' in prefixes) {
                prefixes['$'] = prefixes[''];
                delete prefixes[''];
            }
            return prefixes;
        });
    });
}
exports.getPrefixes = getPrefixes;
function invertObject(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        memo[value] = key;
        return memo;
    }, {});
}
exports.invertObject = invertObject;
function getGraph(ontology) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = N3.Parser();
        const triples = parser.parse(ontology, null);
        const prefixes = yield getPrefixes(ontology);
        const prefixMap = invertObject(prefixes);
        const graph = triples.reduce((memo, triple) => {
            const { subject, predicate, object } = triple;
            return [...memo, subject, predicate, object];
        }, []).reduce((memo, maybeIri) => {
            if (!semtools.isIri(maybeIri))
                return memo;
            const prefix = semtools.getNamespace(maybeIri);
            const localName = semtools.getLocalName(maybeIri);
            const prefixLocalName = prefixMap[prefix];
            if (!(prefixLocalName in memo))
                memo[prefixLocalName] = {};
            memo[prefixLocalName][localName] = maybeIri;
            return memo;
        }, {});
        return {
            prefixes,
            graph
        };
    });
}
exports.getGraph = getGraph;
function tsify(obj) {
    return Object.keys(obj).reduce((memo, key) => {
        const value = obj[key];
        var str;
        if (typeof value === 'string')
            str = `\texport const ${key} = ${JSON.stringify(value)};\n`;
        else
            str = `\n\nexport module ${key} { \n${tsify(value)}\n}`;
        return memo + str;
    }, ``);
}
exports.tsify = tsify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSx5QkFBeUI7QUFDekIsaUNBQWlDO0FBQ2pDLHlCQUF5QjtBQUN6QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUU3QyxrQkFBK0IsUUFBdUI7O1FBRXBELE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsRUFBTyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFFdEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUFBO0FBTEQsNEJBS0M7QUFFRCxxQkFBa0MsT0FBTzs7UUFDdkMsTUFBTSxLQUFLLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzVCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNULENBQUM7Q0FBQTtBQUxELGtDQUtDO0FBRUQscUJBQWtDLFFBQVE7O1FBRXhDLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUE4QixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuRSxJQUFJLFFBQVEsQ0FBQztZQUNiLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0MsRUFBRSxDQUFDLENBQUMsS0FB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