import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Render only test fixtures; never add sample works to the production data.
const require = createRequire(import.meta.url);
const directory = await mkdtemp(join(tmpdir(), 'paperweight-manuscript-'));
after(() => rm(directory, { recursive: true, force: true }));
const modules = {};
for (const [name, filename] of [['data','src/content/manuscript.ts'],['text','src/components/manuscript/literary-text.tsx'],['squared','src/components/manuscript/squared-manuscript.tsx'],['reader','src/components/manuscript/work-reader.tsx']]) {
  let source = ts.transpileModule(readFileSync(resolve(filename), 'utf8'), {compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  for (const dependency of ['react','react/jsx-runtime','next/image']) {
    source = source.replaceAll(`"${dependency}"`, JSON.stringify(pathToFileURL(require.resolve(dependency)).href));
  }
  source = source.replaceAll('"@/content/manuscript"',JSON.stringify(modules.data));
  source = source.replaceAll('"./literary-text"',JSON.stringify(modules.text));
  source = source.replaceAll('"./squared-manuscript"',JSON.stringify(modules.squared));
  const target = join(directory, name+'.mjs'); await writeFile(target,source); modules[name]=pathToFileURL(target).href;
}
const { LiteraryText } = await import(modules.text);
const { WorkReader } = await import(modules.reader);
const { manuscriptWorks } = await import(modules.data);
const content = '\tA  B\n\n   C\n';
const revision = {id:'r1',sections:[{id:'s1',content}]};
const work = {id:'fixture',form:'poetry',currentRevision:'r1',revisions:[revision]};
const render = props => renderToStaticMarkup(React.createElement(WorkReader,{work,...props,onClose:()=>{}}));
test('first selected manuscript preserves the supplied text without invented metadata',()=>{
 assert.equal(manuscriptWorks.length,2);
 const selected=manuscriptWorks[0];
 assert.equal(manuscriptWorks[1].revisions[0].sections[0].content,readFileSync('tests/fixtures/manuscript-second.txt','utf8'));
 assert.equal(selected.title,undefined);
 assert.equal(selected.createdAt,undefined);
 assert.equal(selected.revisions[0].sections[0].content,readFileSync('tests/fixtures/manuscript-first.txt','utf8'));
});
test('poetry keeps tabs, consecutive spaces, blank lines and final newline',()=>{
  const html = render(); assert.ok(html.includes(content)); assert.ok(html.includes('literary-poetry'));
  assert.ok(!html.includes('원고 판본')); assert.ok(!html.includes('원고의 장')); assert.ok(!html.includes('UNTITLED'));
});
test('proof marks preserve original content and escape markup',()=>{
  const html=renderToStaticMarkup(React.createElement(LiteraryText,{content:'A <B> C',sectionId:'s1',annotations:[{id:'mark',type:'strike',target:{sectionId:'s1',start:2,end:5}}]}));
  assert.equal(html.replace(/<[^>]+>/g,'').replaceAll('&lt;','<').replaceAll('&gt;','>'),'A <B> C');
  assert.ok(html.includes('literary-mark-strike'));
});
test('actual revision and chapter counts govern navigation, preserving selected text',()=>{
  const changed={...work,currentRevision:'r2',revisions:[revision,{id:'r2',label:'rev. II',sections:[{id:'s1',title:'section A',content:'A\n'},{id:'s2',title:'section B',content:'B\n'}]}]};
  const html=render({work:changed}); assert.ok(html.includes('원고 판본')); assert.ok(html.includes('원고의 장')); assert.ok(html.includes('rev. II')); assert.ok(html.includes('A\n'));
});
test('invalid and overlapping annotation ranges cannot remove original characters',()=>{
  const html=renderToStaticMarkup(React.createElement(LiteraryText,{content,sectionId:'s1',annotations:[{id:'bad',type:'strike',target:{sectionId:'s1',start:-1,end:20}},{id:'valid',type:'underline',target:{sectionId:'s1',start:1,end:4}},{id:'overlap',type:'strike',target:{sectionId:'s1',start:2,end:5}}]}));
  assert.equal(html.replace(/<[^>]+>/g,''),content);
});
test('squared readers keep both original texts accessible and honor every explicit newline',()=>{
 for(const selected of manuscriptWorks) {
  const original=selected.revisions[0].sections[0].content;
  const html=render({work:selected});
  assert.ok(html.includes('sr-only squared-original'));
  assert.ok(html.includes(original));
  assert.equal((html.match(/class="squared-line"/g)||[]).length,original.split('\n').length);
  assert.ok(html.includes('aria-hidden="true"'));
  assert.ok(!html.includes('원고 판본'));
 }
});
