import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const assets = JSON.parse(readFileSync('src/content/borrowed-assets.json','utf8'));
const original = JSON.parse(readFileSync(new URL('./fixtures/borrowed-originals.json',import.meta.url),'utf8')).filter(work=>!['mirrorsy','snowsy'].includes(work.id));
const directory = await mkdtemp(join(tmpdir(),'paperweight-borrowed-'));
after(() => rm(directory,{recursive:true,force:true}));
let source=ts.transpileModule(readFileSync('src/content/borrowed.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
source=source.replace('import assets from "./borrowed-assets.json";',`const assets = ${JSON.stringify(assets)};`);
await writeFile(join(directory,'data.mjs'),source);
const { borrowedWorks: works, plateNumber }=await import(pathToFileURL(join(directory,'data.mjs')).href);
test('commission order, real captions and original bytes survive migration',()=>{
  assert.deepEqual(works.map(w=>w.id),original.map(w=>w.id));
  for (const [index,work] of works.entries()) {
    const old=original[index];
    for (const field of ['title','subtitle','ratio','series']) assert.equal(work[field],old[field]);
    assert.equal(work.note,work.id==='leon'?'영화 〈레옹〉을 함께 본 뒤 받은 글.':old.note);
    assert.equal(createHash('sha256').update(readFileSync('public'+work.file)).digest('hex'),old.sha256);
    assert.ok(!work.creator && !work.received && !work.linkedTo);
  }
});
test('every plate and every document page resolves, with intrinsic dimensions',()=>{
  assert.equal(works.length,9);
  for(const work of works) {
    assert.ok(work.width>0 && work.height>0 && work.alt);
    assert.ok(existsSync('public'+work.file));
    if(work.kind==='document') {
      assert.ok(work.pages.length>0);
      for (const page of work.pages) {
        assert.ok(existsSync('public'+page.file));
        assert.ok(page.width===1800 && page.height>0 && page.text);
      }
    }
    if(work.kind==='animated') {
      assert.ok(existsSync('public'+work.still));
      assert.ok(work.file.endsWith('.gif'));
    }
  }
  assert.deepEqual(works.filter(w=>w.kind==='document').map(w=>[w.id,w.pages.length]),[['pairexam',6],['leon',1],['shnyhlove',2]]);
});
test('plate numbering remains deterministic past the current collection',()=>{
  assert.deepEqual([0,3,8,10,39].map(plateNumber),['PLATE I.','PLATE IV.','PLATE IX.','PLATE XI.','PLATE XL.']);
});
