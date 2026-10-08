import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {playlistTracks} from '../src/content/playlist.ts';
import {sections} from '../src/lib/navigation.ts';
const old=JSON.parse(readFileSync(new URL('./fixtures/playlist-originals.json',import.meta.url),'utf8'));
const hashes=JSON.parse(readFileSync(new URL('./fixtures/release-content-hashes.json',import.meta.url),'utf8'));
test('playlist adds exactly one first track and preserves all existing content/order',()=>{
 assert.equal(playlistTracks.length,16);
 assert.deepEqual(playlistTracks[0],{id:'legends-never-die',title:'Legends Never Die',artist:'Against The Current'});
 assert.deepEqual(playlistTracks.slice(1),old.map(({id,title,artist,desc})=>({id,title,artist,desc})));
 assert.equal(new Set(playlistTracks.map(t=>t.id)).size,16);
});
test('content matches the baseline including explicitly authorized edits',()=>{
 for(const [file,hash] of Object.entries(hashes)) assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
});
test('playlist does not add a route or a seventh section',()=>{
 assert.equal(sections.length,6);
 assert.ok(!sections.some(section=>section.slug==='playlist'));
 assert.ok(!existsSync('src/app/playlist'));
});
