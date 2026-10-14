import * as models from './models.mjs';
import { abilityModifier, ascendingAC, carriedWeight } from './rules.mjs';
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2, ItemSheetV2 } = foundry.applications.sheets;
async function roll(formula, actor, flavor) {
 try { const result = new Roll(formula, actor?.getRollData() ?? {}); await result.evaluate(); await result.toMessage({speaker:ChatMessage.getSpeaker({actor}),flavor}); return result; }
 catch(error) { ui.notifications.error(`Unable to roll: ${error.message}`); }
}
export class WBCActor extends Actor {
 getRollData() { return {...super.getRollData(),mod:Object.fromEntries(Object.entries(this.system.abilities).map(([key,value])=>[key,abilityModifier(value)]))}; }
}
export class WBCActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
 static DEFAULT_OPTIONS = {classes:['wbc','actor-sheet'],position:{width:780,height:820},form:{submitOnChange:true,closeOnSubmit:false},actions:{
  createItem:async function(event,target) { if(!this.isEditable)return; const type=target.dataset.type; await this.actor.createEmbeddedDocuments('Item',[{name:`New ${type}`,type}]); },
  editItem:function(event,target) { this.actor.items.get(target.closest('[data-item-id]').dataset.itemId)?.sheet.render({force:true}); },
  deleteItem:async function(event,target) { if(!this.isEditable)return; const id=target.closest('[data-item-id]').dataset.itemId; const ok=await foundry.applications.api.DialogV2.confirm({window:{title:'Delete item'},content:'<p>Delete this item from the actor?</p>'}); if(ok)await this.actor.deleteEmbeddedDocuments('Item',[id]); },
  save:async function() { if(!this.isEditable)return; await roll('1d20',this.actor,`Saving throw: target ${this.actor.system.save}+ (apply situational bonuses)`); },
  useItem:async function(event,target) {
   if(!this.isEditable)return;
   const item=this.actor.items.get(target.closest('[data-item-id]').dataset.itemId); if(!item)return;
   if(item.type==='weapon') await roll(`1d20 + @attackBonus + @mod.${item.system.attackType==='ranged'?'dex':'str'} + ${item.system.attackBonus}`,this.actor,`${item.name}: attack (ascending AC)`);
   else if(item.type==='spell') {if(item.system.expended>=item.system.prepared)return ui.notifications.warn('No prepared copies remaining.');await item.update({'system.expended':item.system.expended+1});ui.notifications.info(`${item.name}: prepared copy expended.`);}
   else if(item.type==='feature' && item.system.formula) await roll(item.system.formula,this.actor,item.name);
  },
  damage:async function(event,target) {if(!this.isEditable)return;const item=this.actor.items.get(target.closest('[data-item-id]').dataset.itemId);if(item?.type==='weapon')await roll(item.system.damage,this.actor,`${item.name}: damage (minimum 1)`);}
 }};
 static PARTS = {sheet:{template:'systems/wbc/templates/actor.hbs',scrollable:['']}};
 async _prepareContext(options) {
  const context=await super._prepareContext(options); const system=this.actor.system;
  return {...context,actor:this.actor,system,editable:this.isEditable,isNPC:this.actor.type==='npc',aac:ascendingAC(system.ac),weight:carriedWeight(this.actor.items.contents),
   abilities:Object.entries(system.abilities).map(([key,value])=>({key,label:{str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'}[key],value,modifier:abilityModifier(value)})),
   groups:['weapon','armor','equipment','spell','feature','class','ancestry'].map(type=>({type,label:type.charAt(0).toUpperCase()+type.slice(1),items:this.actor.items.filter(item=>item.type===type)}))};
 }
}
export class WBCItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
 static DEFAULT_OPTIONS = {classes:['wbc','item-sheet'],position:{width:540,height:680},form:{submitOnChange:true,closeOnSubmit:false}};
 static PARTS = {sheet:{template:'systems/wbc/templates/item.hbs',scrollable:['']}};
 async _prepareContext(options) {
  const context=await super._prepareContext(options);
  const fields=Object.entries(this.item.system.toObject()).filter(([key,value])=>key!=='description'&& typeof value!=='object').map(([key,value])=>({key,label:key.replace(/([A-Z])/g,' $1'),value,isBoolean:typeof value==='boolean',isNumber:typeof value==='number'}));
  return {...context,item:this.item,system:this.item.system,fields,hasUses:this.item.type==='feature'};
 }
}
Hooks.once('init',()=>{
 CONFIG.Actor.documentClass=WBCActor;
 Object.assign(CONFIG.Actor.dataModels,{character:models.CharacterModel,npc:models.NPCModel});
 Object.assign(CONFIG.Item.dataModels,{weapon:models.WeaponModel,armor:models.ArmorModel,equipment:models.EquipmentModel,spell:models.SpellModel,feature:models.FeatureModel,class:models.ClassModel,ancestry:models.BaseItemModel});
 const registry=foundry.applications.apps.DocumentSheetConfig;
 registry.registerSheet(Actor,'wbc',WBCActorSheet,{types:['character','npc'],makeDefault:true,label:'White Box Cyclopedia'});
 registry.registerSheet(Item,'wbc',WBCItemSheet,{makeDefault:true,label:'White Box Cyclopedia'});
 CONFIG.Combat.initiative={formula:'1d6',decimals:0};
 game.wbc={roll,abilityModifier,ascendingAC};
});
