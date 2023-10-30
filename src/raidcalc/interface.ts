import { Pokemon, Field, StatID } from "../calc";
import { AbilityName, MoveName, TypeName } from "../calc/data/interface";

export type MoveSetItem = {
    name: MoveName,
    method: string,
    type: TypeName,
}

export type MoveCategory =   "net-good-stats" |         // stat changes (e.g. Screech, Swords Dance)
                             "whole-field-effect" |     // weather, terrain, gravity, etc.
                             "damage+ailment" |         // (e.g. Fire Blast, Blizzard)
                             "damage" |                 // (e.g. Tackle)
                             "unique" |                 // lots of things that don't neatly fit into other categories
                             "damage+lower" |           // damage + stat changes to target (e.g. Play Rough)
                             "ailment" |                // status condition (e.g. Thunder Wave) 
                             "damage+raise" |           // damage + stat changes to user (e.g. Close Combat)
                             "heal" |                   // restore HP (e.g. Recover, Heal Pulse)
                             "ohko" |                   // not going to implement for Tera Raids
                             "field-effect" |           // half-field effects (e.g. Reflect, Tailwind)
                             "damage+heal" |            // damage + restore HP (e.g. Drain Punch)
                             "swagger" |                // ailment and stat change for target (e.g. Swagger, Flatter)
                             "force-switch";            // not going to implement for Tera Raids

export type MoveTarget = "all-opponents" |              // Target
                         "entire-field" |               
                         "selected-pokemon" |           // Target
                         "user" |                       // Self
                         "random-opponent" |            // Target
                         "all-other-pokemon" |          // Target (Allies aren't affected in raids)
                         "all-pokemon" |                
                         "selected-pokemon-me-first" |  
                         "all-allies" |                 
                         "users-field" |    
                         "specific-move" |
                         "opponents-field" |
                         "user-and-allies" |            // Some healing moves, Heal Cheer
                         "ally" |
                         "user-or-ally" |
                         "fainting-pokemon";

export type AilmentName =   "confusion" |               // many of these are not implemented by smogon/calcs
                            "torment" |                 
                            "poison" |
                            "freeze" |
                            "burn" |
                            "paralysis" |
                            "sleep" |
                            "unknown" |
                            "heal-block" |
                            "trap" |
                            "nightmare" |
                            "disable" |
                            "silence" |
                            "yawn" |
                            "leech-seed" |
                            "no-type-immunity" |
                            "perish-song" |
                            "ingrain" |
                            "tar-shot" |
                            "embargo" |
                            "infatuation" |
                            "toxic" |
                            "encore" |
                            "taunt";

export type MoveData = {
    name:           MoveName
    category?:      MoveCategory,
    target?:        MoveTarget,
    type?:          TypeName,
    power?:         number,
    accuracy?:      number,
    priority?:      number,
    drain?:         number,
    healing?:       number,
    selfDamage?:    number,
    ailment?:       AilmentName,
    statChanges?:   {stat: StatID, change: number}[],
    flinchChance?:  number,
    statChance?:    number,
    ailmentChance?: number,
    minHits?:       number,
    maxHits?:       number,
}

export type ShieldData  = {
    hpTrigger: number;
    timeTrigger: number;
    shieldCancelDamage: number;
    shieldDamageRate: number;
    shieldDamageRateTera: number;
    shieldDamageRateTeraChange: number;
}

export interface Raider extends Pokemon {
    id: number;
    role: string;
    shiny?: boolean;
    field: Field;
    moveData: MoveData[];
    extraMoves?: MoveName[];// for special boss actions
    extraMoveData?: MoveData[];
    isEndure?: boolean;     // store that a Pokemon can't faint until its next move
    isTaunt?: number;       // store number of turns that a Pokemon can't use status moves
    isSleep?: number;       // store number of turns that a Pokemon is asleep
    isYawn?: number;        // turn countdown until yawn takes effect
    isCharging?: boolean;   // indicates that a Pokemon is charging a move (e.g. Solar Beam)
    isRecharging?: boolean; // indicates that a Pokemon is recharging from a move (e.g. Hyper Beam)
    yawnSource?: number;    // id of the pokemon that inflicted the user with Yawn
    lastMove?: MoveData;    // stored for Instruct and Copycat
    lastTarget?: number;    // stored for Instruct and Copycat
    moveRepeated?: number;  // stored for boost from Metronome, Fury Cutter, etc
    teraCharge?: number;    // stored for Tera activation check
    shieldActivateHP?: number;
    shieldBroken?: boolean;
    abilityNullified?: number;  // indicates when the boss has nullified the ability of the Raider
    nullifyAbilityOn?: boolean; // indicates that the ability was active before nullification
    originalAbility?: AbilityName | "(No Ability)"; // stores ability when nullified
    syrupBombDrops?: number;
    syrupBombSource?: number;
}

export interface RaidState {
    raiders: Raider[]; // raiders[0] is the boss, while raiders 1-4 are the players
}

export type RaidMoveOptions = {
    crit?: boolean;
    secondaryEffects?: boolean;
    hits?: number;
    roll?: "max" | "min" | "avg";
    activateTera?: boolean;
    stealTeraCharge?: boolean;
}

export type RaidMoveInfo = {
    userID: number;
    targetID: number;
    moveData: MoveData;
    options?: RaidMoveOptions;
}

export type RaidTurnInfo = {
    id: number;
    group: number;
    moveInfo: RaidMoveInfo;
    bossMoveInfo: RaidMoveInfo;
}

export type TurnGroupInfo = {
    id: number,
    turns: RaidTurnInfo[],
    repeats?: number,
}

export type SubstituteBuildInfo = {
    raider: Raider,
    substituteMoves: MoveName[],
    substituteTargets: number[],
}