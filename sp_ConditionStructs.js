/*:
* @plugindesc standardPlayer conditional structs addon
* @author standardplayer
* @target MZ
* @base sp_Core
* @orderAfter sp_Core
*
* @param conditions
* @type struct<Condition>[]
* @text Conditions
*
*/

/*~struct~Condition:
 * @param name
 * @type text
 * @text Name
 * @desc can be used in debugging to determine what condition is passing or failing
 * 
 * @param ==variableSection
 * @text =====Variables=====
 * @default
 * 
 * @param gameVariableLeft
 * @type variable
 * @text Variable A
 * @parent ==variableSection
 * 
 * @param gameVarComparator
 * @text Comparator
 * @type select
 * @option equals
 * @option >
 * @option <
 * @option >=
 * @option <=
 * @default equals
 * @parent ==variableSection
 * 
 * @param gameVariableRight
 * @type variable
 * @text Variable B
 * @parent ==variableSection
 * 
 * @param gameVariableExplicit
 * @type number
 * @text Value
 * @parent ==variableSection
 * 
 * @param ==switchSection
 * @text =====Game Switches=====
 * @default
 * 
 * @param switch
 * @type switch
 * @text Switch
 * @parent ==switchSection
 * 
 * @param switchValue
 * @type boolean
 * @text Is
 * @parent ==switchSection
 * @default true
 *
 * 
 * @param ==itemSection
 * @text =====Items=====
 * @default
 * 
 * @param item
 * @type item
 * @text Item
 * @parent ==itemSection
 * 
 * @param itemComparator
 * @text Operation
 * @type select
 * @option in posession
 * @option amount
 * @parent ==itemSection
 * 
 * @param itemAmount
 * @type number
 * @min 0
 * @text Amount
 * @desc only applicable if 'amount' operation is selected
 * @parent ==itemSection
 * 
 * 
 * @param ==actorSection
 * @text =====Actor=====
 * @default
 * 
 * 
 * @param actor
 * @type actor
 * @text Actor
 * @parent ==actorSection
 * 
 * @param inParty
 * @type boolean
 * @text Is In Party
 * @parent ==actorSection
 * 
 * @param hasClass
 * @type class
 * @text Has Class
 * @parent ==actorSection
 * 
 * @param hasWeapon
 * @type weapon
 * @text Has Weapon
 * @parent ==actorSection
 * 
 * @param hasArmor
 * @type armor
 * @text Has Armor
 * @parent ==actorSection
 * 
 * @param hasSkill
 * @type skill
 * @text Has Skill
 * @parent ==actorSection
 * 
 * @param hasState
 * @type state
 * @text Has State
 * @parent ==actorSection
 * 
 * @param ==playerSection
 * @text =====Player=====
 * @default
 * 
 * @param playerX
 * @text Player X
 * @type number
 * @default -1
 * @parent ==playerSection
 * 
 * @param playerY
 * @text Player Y
 * @type number
 * @default -1
 * @parent ==playerSection
 * 
 * @param playerCanMove
 * @text Can Move
 * @type boolean
 * @desc Evaluates event.canMove function
 * @parent ==playerSection
 * 
 * @param ==eventSection
 * @text =====Event=====
 * @default
 * 
 * @param event
 * @type number
 * @text EventId
 * @min 0
 * @parent ==eventSection
 * 
 * @param eventX
 * @text Event X
 * @type number
 * @parent ==eventSection
 * 
 * @param eventY
 * @text Event Y
 * @type number
 * @parent ==eventSection
 * 
 * @param eventCanMove
 * @text Can Move
 * @type boolean
 * @desc Evaluates event.canMove function
 * @parent ==eventSection
 * 
 * @param selfSwitch
 * @text Self Switch
 * @type select
 * @option none
 * @option A
 * @option B
 * @option C
 * @option D
 * @parent ==eventSection
 * 
 * @param ==goldSection
 * @text =====Gold=====
 * @default
 * 
 * @param goldComparator
 * @text Gold is 
 * @type select
 * @option equals
 * @option >
 * @option <
 * @option >=
 * @option <=
 * @option mod
 * @parent ==goldSection
 * 
 * 
 * @param goldValue
 * @type number
 * @default 0
 * @text Value
 * @parent ==goldSection
 * 
 * @param weapon
 * @type weapon
 * @text Weapon in Posession:
 * @default 0
 * 
 * 
 * @param armor
 * @type armor
 * @text Armor in Posession:
 * @default 0
 * 
 * @param ==enemySection
 * @text =====Enemy=====
 * @default
 * 
 * @param enemy
 * @type enemy
 * @text Enemy
 * @parent ==enemySection
 * 
 * @param enemyHasAppeared
 * @type boolean
 * @text Has Appeared
 * @parent ==enemySection
 *
 * @param enemyState
 * @type state
 * @text Has State
 * @parent ==enemySection
 * 
 * @param vehicle
 * @type vehicle
 * @text Driving Vehicle: 
 * 
 */


'use strict'
var Imported = Imported || {};
Imported.sp_ConditionStruct = 'sp_ConditionStruct';

var standardPlayer = standardPlayer || { params: {} };
standardPlayer.sp_ConditionStruct = standardPlayer.sp_ConditionStruct || {};

standardPlayer.sp_ConditionStruct.Parameters = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('sp_ConditionStructs'));

standardPlayer.sp_ConditionStruct.constructCondition = function (condition) {
    let container = [];
    let firstValue = condition.gameVariableLeft
    let secondValue = condition.gameVariableRight ?
        condition.gameVariableRight :
        condition.gameVariableExplicit


    if (typeof firstValue !== 'undefined' && firstValue !== 0 &&
        typeof secondValue !== 'undefined' && typeof condition.gameVarComparator !== 'undefined')
        container.push(() => { return this.checkGameVariableCondition(condition) })

    if (condition.switch)
        container.push(() => { return this.checkSwitch(condition) })

    if (condition.item && condition.itemComparator)
        container.push(() => { return this.checkItem(condition) })

    if (condition.goldComparator && typeof condition.goldValue !== 'undefined')
        container.push(() => { return this.checkGold(condition) })

    if (condition.actor)
        container.push(() => { return this.checkActor(condition) })

    if (condition.playerX >= 0 || condition.playerY >= 0)
        container.push(() => { return this.checkPlayer(condition) })

    if (condition.event && (condition.eventX || condition.eventY || condition.eventCanMove === 0))
        container.push(() => { return this.checkPlayer(condition) })

    return this.getConditionCallback(container)
}

standardPlayer.sp_ConditionStruct.getConditionCallback = function(container){
    return ()=>{
        for(let i = 0; i < container.length; i++){
            if(container[i]() !== true){       
                console.log('failed conditionn')
                return false
            }
        }
        return true
    }
    
}


standardPlayer.sp_ConditionStruct.checkGameVariableCondition = function (condition) {
    let result = false;
    let firstValue = condition.gameVariableLeft
    let secondValue = condition.gameVariableRight ?
        condition.gameVariableRight :
        condition.gameVariableExplicit

    firstValue = $gameVariables.value(firstValue)
    secondValue = typeof condition.gameVariableExplicit === 'undefined' ?
        $gameVariables.value(secondValue) :
        condition.gameVariableExplicit;
    switch (condition.gameVarComparator) {
        case 'equals': 
            result = firstValue == secondValue;
            break;
        case '<=': result = firstValue <= secondValue; break
        case '>=': result = firstValue >= secondValue; break
        case '<': result = firstValue < secondValue; break
        case '>': result = firstValue > secondValue; break
        default: console.log('running default'); result = false; break
    }

    return result
}


standardPlayer.sp_ConditionStruct.checkSwitch = function (condition) {
    return $gameSwitches.value(condition.switch) == condition.switchValue
}


standardPlayer.sp_ConditionStruct.checkItem = function (condition) {
    if (condition.itemComparator == 'amount') {
        return $gameParty.numItems(condition.item) >= condition.itemAmount
    } else {
        return $gameParty.hasItem(condition.item, true)
    }


}

standardPlayer.sp_ConditionStruct.checkGold = function (condition) {
    let firstValue = $gameParty.gold()
    let secondValue = condition.goldValue;
    switch (condition.goldComparator) {
        case 'equals': return firstValue === secondValue;
        case '<=': return firstValue <= secondValue
        case '>=': return firstValue >= secondValue
        case '<': return firstValue < secondValue
        case '>': return firstValue > secondValue
        default: return false
    }

}


standardPlayer.sp_ConditionStruct.checkActor = function (condition) {
    let actor = $gameActors.actor(condition.actor)
    let partyPostion = $gameParty._actors.indexOf(condition.actor)

    //Check in Party
    if (condition.inParty === false && partyPostion > 0) {
        return false
    } else if (condition.inParty && partyPostion < 0) {
        return false
    }

    //Check class
    if (condition.class && actor._classId != condition.class)
        return false

    //Check Weapon
    if (condition.weapon && !actor.hasWeapon(condition.weapon))
        return false

    if (condition.armor && !actor.hasArmor(condition.armor))
        return false

    if (condition.skill && !actor.hasSkill(condition.skill))
        return false

    if (condition.state && !actor._states.contains(condition.skill))
        return false

    return true
}

standardPlayer.sp_ConditionStruct.checkPlayer = function (condition) {
    if (condition.playerX >= 0 && $gamePlayer.x != condition.playerX)
        return false

    if (condition.playerY >= 0 && $gamePlayer.y != condition.playerY)
        return false

    if (condition.playerCanMove !== 0 && $gamePlayer.canMove() != condition.playerCanMove)
        return false

    return true
}

standardPlayer.sp_ConditionStruct.checkEvent = function (condition) {
    let ev = $gameMap.event(condition.event)

    if (condition.eventX >= 0 && $ev.x != condition.eventX)
        return false

    if (condition.eventY >= 0 && $ev.y != condition.eventY)
        return false

    if (condition.playerCanMove !== 0 && $gamePlayer.canMove() != condition.playerCanMove)
        return false

    return true
}

standardPlayer.sp_ConditionStruct.getCondition = function(conditionName){
    let list = this.Parameters.conditions;
    let length = list.length;

    for(let i = 0; i < length; i++){
        if(list[i].name.toLowerCase() === conditionName.toLowerCase())
            return this.constructCondition(list[i])
    }

    return ()=>{console.log('no condition found during standardPlayer.sp_conditionStruct.getConditionn')}
}



