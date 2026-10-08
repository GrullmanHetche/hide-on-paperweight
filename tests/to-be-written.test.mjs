import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { readFileSync } from 'node:fs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { workingEntries } from './fixtures/to-be-written.mjs';
const require=createRequire(import.meta.url);
const directory=await mkdtemp(join(tmpdir(),'paperweight-working-'));
after(()=>rm(directory,{recursive:true,force:true}));
const modules={};
for (const [name,file] of [['data','src/content/to-be-written.ts'],['lines','src/components/to-be-written/working-lines.tsx']]) {
  let source=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  source=source.replace('import Link from "next/link";','import React from "react"; const Link = ({children,...props}) => React.createElement("a",props,children);');
  for (const dependency of ['react','react/jsx-runtime']) source=source.replaceAll(`"${dependency}"`,JSON.stringify(pathToFileURL(require.resolve(dependency)).href));
  const target=join(directory,name+'.mjs');await writeFile(target,source);modules[name]=pathToFileURL(target).href;
}
const {toBeWrittenEntries}=await import(modules.data);
const {WorkingLines}=await import(modules.lines);
const references=[{id:'present-shape',numeral:'Ⅱ',title:'지금 모양'}];
const render=entries=>renderToStaticMarkup(React.createElement(WorkingLines,{entries,pressedReferences:references}));
test('zero real entries leave the sheet blank without sample content or empty copy',()=>{
 assert.equal(toBeWrittenEntries.length,0);assert.equal(render(toBeWrittenEntries),'');
});
test('a single minimal record has no invented date, direction or note',()=>{
 const html=render([{id:'only',kind:'given',title:'A'}]);
 assert.ok(html.includes('given.'));assert.equal((html.match(/<li /g)||[]).length,1);
 assert.ok(!html.includes('working-time')&&!html.includes('working-direction')&&!html.includes('working-note'));
});
test('mixed records preserve order, kept/written records, fuzzy dates and original spacing',()=>{
 const html=render(workingEntries);
 assert.equal((html.match(/<li /g)||[]).length,5);
 assert.ok(html.includes('kept.')&&html.includes('written.')&&html.includes('unwritten.'));
 assert.ok(html.includes('언젠가')&&html.includes('2026.10.24')&&html.includes('A  B\n\nC'));
 assert.ok(html.indexOf('data-status="kept"')<html.indexOf('data-status="unwritten"'));
 assert.ok(html.includes('S에서 Y에게'));
});
test('only explicit existing PRESSED relations on written records are linked',()=>{
 const html=render(workingEntries);
 assert.equal((html.match(/href=/g)||[]).length,1);
 assert.ok(html.includes('/pressed#pressed-work-present-shape'));
 assert.ok(html.includes('PRESSED — 지금 모양의 기록으로 이동'));
 assert.ok(!render([{id:'future',kind:'unwritten',title:'A',relatedPressedWorkId:'present-shape'}]).includes('href='));
});
test('long or unusual original titles remain intact and are escaped',()=>{
 const title='  <A>\n'+'Z'.repeat(1000);
 const html=render([{id:'long',kind:'unwritten',title}]);
 assert.ok(html.includes('  &lt;A&gt;\n'+'Z'.repeat(1000)));
 assert.ok(!html.includes('checkbox'));
});
