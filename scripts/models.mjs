const { TypeDataModel } = foundry.abstract;
const { NumberField, StringField, BooleanField, SchemaField } = foundry.data.fields;
const num = (initial=0, extra={}) => new NumberField({required:true, nullable:false, initial, ...extra});
const str = (initial='') => new StringField({required:true, nullable:false, initial});
const bool = () => new BooleanField({initial:false});
const schema = fields => new SchemaField(fields);
export class CharacterModel extends TypeDataModel {
 static defineSchema() { return {
 abilities:schema(Object.fromEntries(['str','dex','con','int','wis','cha'].map(key=>[key,num(10,{integer:true,min:3,max:18})]))),
 hp:schema({value:num(1),max:num(1,{min:1})}), ac:num(9), attackBonus:num(), save:num(15,{integer:true,min:2,max:20}), movement:num(12,{min:0}),
 level:num(1,{integer:true,min:1}), xp:num(0,{min:0}), nextLevelXP:num(0,{min:0}), alignment:str(), languages:str(), biography:str(),
 coins:schema({cp:num(0,{min:0}),sp:num(0,{min:0}),gp:num(0,{min:0})}),
 spellSlots:schema(Object.fromEntries([1,2,3,4,5,6].map(level=>[String(level),schema({value:num(0,{integer:true,min:0}),max:num(0,{integer:true,min:0})})])))
 }; }
}
export class NPCModel extends CharacterModel {
 static defineSchema() { return {...super.defineSchema(), hitDice:str('1'), morale:num(7,{min:2,max:12}), treasure:str(), special:str()}; }
}
export class BaseItemModel extends TypeDataModel { static defineSchema() {return {description:str(),source:str()};} }
export class EquipmentModel extends BaseItemModel { static defineSchema() {return {...super.defineSchema(),quantity:num(1,{integer:true,min:0}),weight:num(0,{min:0}),cost:num(0,{min:0}),equipped:bool()};} }
export class WeaponModel extends EquipmentModel { static defineSchema() {return {...super.defineSchema(),damage:str('1d6'),attackBonus:num(),attackType:str('melee'),range:str(),notes:str()};} }
export class ArmorModel extends EquipmentModel { static defineSchema() {return {...super.defineSchema(),ac:num(9),shield:bool()};} }
export class SpellModel extends BaseItemModel { static defineSchema() {return {...super.defineSchema(),level:num(1,{integer:true,min:1,max:6}),tradition:str(),range:str(),duration:str(),prepared:num(0,{integer:true,min:0}),expended:num(0,{integer:true,min:0})};} }
export class FeatureModel extends BaseItemModel { static defineSchema() {return {...super.defineSchema(),formula:str(),uses:schema({value:num(0,{min:0}),max:num(0,{min:0})})};} }
export class ClassModel extends BaseItemModel { static defineSchema() {return {...super.defineSchema(),level:num(1,{integer:true,min:1}),hitDice:str('1d6'),primeAttribute:str(),progressionNotes:str()};} }
