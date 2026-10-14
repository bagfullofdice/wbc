import {test} from 'node:test';
import assert from 'node:assert/strict';
import {abilityModifier,ascendingAC,carriedWeight} from '../scripts/rules.mjs';
test('standard ability modifier boundaries',()=>{for(const [score,result] of [[3,-1],[6,-1],[7,0],[14,0],[15,1],[18,1]])assert.equal(abilityModifier(score),result);});
test('descending AC conversion',()=>{assert.equal(ascendingAC(9),10);assert.equal(ascendingAC(-2),21);});
test('weight includes quantities and excludes nonphysical items',()=>assert.equal(carriedWeight([{type:'equipment',system:{quantity:3,weight:2}},{type:'spell',system:{}}]),6));
