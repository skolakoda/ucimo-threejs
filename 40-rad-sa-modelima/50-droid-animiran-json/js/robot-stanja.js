/* eslint-disable */
const robotStanja = {
  // first, last, fps
  stand   : [   0,  39,  9, {stanje : 'stand',  action : false} ],   // STAND
  run     : [  40,  45, 10, {stanje : 'stand',  action : false} ],   // RUN
  attack  : [  46,  53, 10, {stanje : 'stand',  action : true}  ],   // ATTACK
  pain1   : [  54,  57,  7, {stanje : 'stand',  action : true}  ],   // PAIN_A
  pain2   : [  58,  61,  7, {stanje : 'stand',  action : true}  ],   // PAIN_B
  pain3   : [  62,  65,  7, {stanje : 'stand',  action : true}  ],   // PAIN_C
  jump    : [  66,  71,  7, {stanje : 'stand',  action : true}  ],   // JUMP
  flip    : [  72,  83,  7, {stanje : 'stand',  action : true}  ],   // FLIP
  salute  : [  84,  94,  7, {stanje : 'stand',  action : true}  ],   // SALUTE
  taunt   : [  95, 111, 10, {stanje : 'stand',  action : true}  ],   // FALLBACK
  wave    : [ 112, 122,  7, {stanje : 'stand',  action : true}  ],   // WAVE
  point   : [ 123, 134,  6, {stanje : 'stand',  action : true}  ],   // POINT
  crstand : [ 135, 153, 10, {stanje : 'crstand', action : false}],   // CROUCH_STAND
  crwalk  : [ 154, 159,  7, {stanje : 'crstand', action : false}],   // CROUCH_WALK
  crattack: [ 160, 168, 10, {stanje : 'crstand', action : true} ],   // CROUCH_ATTACK
  crpain  : [ 196, 172,  7, {stanje : 'crstand', action : true} ],   // CROUCH_PAIN
  crdeath : [ 173, 177,  5, {stanje : 'freeze',  action : true} ],   // CROUCH_DEATH
  death1  : [ 178, 183,  7, {stanje : 'freeze',  action : true} ],   // DEATH_FALLBACK
  death2  : [ 184, 189,  7, {stanje : 'freeze',  action : true} ],   // DEATH_FALLFORWARD
  death3  : [ 190, 197,  7, {stanje : 'freeze',  action : true} ],   // DEATH_FALLBACKSLOW
}
/* eslint-enable */
