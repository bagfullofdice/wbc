import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
class Field {constructor(options={}){this.options=options;}}
class BaseSheet {}
const registrations=[];
let init;
globalThis.foundry={abstract:{TypeDataModel:class {}},data:{fields:Object.fromEntries(['NumberField','StringField','BooleanField','SchemaField'].map(name=>[name,Field]))},applications:{api:{HandlebarsApplicationMixin:base=>class extends base {}},sheets:{ActorSheetV2:BaseSheet,ItemSheetV2:BaseSheet},apps:{DocumentSheetConfig:{registerSheet:(...args)=>registrations.push(args)}}}};
globalThis.Actor=class {};
globalThis.Item=class {};
globalThis.CONFIG={Actor:{dataModels:{}},Item:{dataModels:{}},Combat:{}};
globalThis.Hooks={once:(name,callback)=>{if(name==='init')init=callback;}};
globalThis.game={};
await import('../scripts/wbc.mjs');
init();
const manifest=JSON.parse(fs.readFileSync(new URL('../system.json',import.meta.url)));
test('every declared actor/item type has a registered schema',()=>{
 for(const type of ['Actor','Item'])for(const name of Object.keys(manifest.documentTypes[type])){
 const model=CONFIG[type].dataModels[name];assert.ok(model,`${type}.${name}`);assert.ok(Object.keys(model.defineSchema()).length);
 }
});
test('registered sheets resolve to real template files',()=>{
 assert.equal(registrations.length,2);
 for(const registration of registrations){const Sheet=registration[2];for(const part of Object.values(Sheet.PARTS)){assert.ok(fs.existsSync(new URL('../'+part.template.replace('systems/wbc/',''),import.meta.url)));}}
});
test('spell and NPC schemas retain distinct tracking fields',()=>{
 const spell=CONFIG.Item.dataModels.spell.defineSchema();assert.ok(spell.prepared);assert.ok(spell.expended);assert.equal(spell.level.options.max,6);
 const npc=CONFIG.Actor.dataModels.npc.defineSchema();assert.ok(npc.hitDice);assert.ok(npc.morale);assert.ok(npc.hp);
});
