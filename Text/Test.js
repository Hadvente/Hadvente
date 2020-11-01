/*jshint esversion: 6 */ 

HAE = {
    Layout: '2_Columns',
    //2_Columns is the default layout
    //It comes with 4 predefined cells:
    //Title, Menus, Dialog, and Actions
    //If you do not have these 4 cell files, your game will not load
    //Beyond this, there are about 10 separate cell columns on the left side below menu
    //Other Layouts I might want to add would be 3_Columns and VN

    title: 'The Test Game',
    author: 'Caleb Holloway',
    cells:{
        //HAS_RIGHT_COLUMN : 'HAS_RIGHT_COLUMN', //this tells the GUI to draw a third column to the right of the text, in case you want lots of cells

        MENUS    : 'Menu',
        TITLE    : 'Title',
        DIALOG   : 'Dialog',
        ACTIONS  : 'Actions',
        UNUSED_1 : 'Top_Left',
        UNUSED_2 : 'Middle_Left',
        MAP_GRID : 'Bottom_Left'
    },
    actions:{
        grid_size: [3, 3],
    },
    maps:{
        starting_map: 'abandoned_home',
        abandoned_home: {
            grid_size: [4, 3],
            only_grid: true,
            start: [2, 1],
            grid:[
                [ '',                     'BedroomA',             'Kitchen' ],
                [ 'BedroomB',             'Piano',                'Dining'  ],
                [ 'Art',                  'Living',               'Bath'    ],
                [ '',                     'Foyer',                ''        ]
            ],
            locations: {
                BedroomA:   { Name: 'Bedroom', scenes: [{scene:'BedroomA',   requirements: true, weight: 100}] },
                Kitchen:    { Name: 'Kitchen', scenes: [{scene:'Kitchen',    requirements: true, weight: 100}] },
                BedroomB:   { Name: 'Bedroom', scenes: [{scene:'BedroomB',   requirements: true, weight: 100}] },
                Piano:      { Name: 'Piano',   scenes: [{scene:'Piano',      requirements: true, weight: 100}] },
                Dining:     { Name: 'Dining',  scenes: [{scene:'Dining',     requirements: true, weight: 100}] },
                Art:        { Name: 'Art',     scenes: [{scene:'Art',        requirements: true, weight: 100}] },
                Bath:       { Name: 'Bath',    scenes: [{scene:'Bath',       requirements: true, weight: 100}] },
                Foyer:      { Name: 'Foyer',   scenes: [{scene:'Foyer',      requirements: true, weight: 100}] },
                Living:     { Name: 'Living',  scenes: [{scene:'Living',     requirements: true, weight: 100}] },
            },
        }
    },
    //NOTE: You cannot put spaces in your key names, that will break the system.
    //NOTE 2: All functions inside "functions" will be moved into FN at load time
    //CLARIFICATION: THIS MEANS "FN" IS AN ILLEGAL KEY
    functions:{
        logic:{
            Random_50(_GAME_DATA, _GAME_STATE, _HAE){
                return Math.random() < 0.5;
            },
            Random_10(_GAME_DATA, _GAME_STATE, _HAE){
                return Math.random() < 0.1;
            },
            has_screwdriver(_GAME_DATA, _GAME_STATE, _HAE){
                return !!_GAME_DATA.screwdriver;
            }
        },
        set: {
            pickup_screwdriver(_GAME_DATA, _GAME_STATE, _HAE){
                _GAME_DATA.screwdriver = true;
            }
        }
    },
scenes:{

START: `
<[DISABLE_CELLS]>
You wake up, unsure where you are. You look around and see a dark and destroyed living room. \
Didn't you go to sleep in your own home? Where are you?

Note: Use the map on the left to navigate.

&larr;
&lArr;<[COMMENT this is pretty nice left arrow]>>
&rarr;
&rArr;<[COMMENT this is pretty nice right arrow]>>
\u2699 
\u26ED
\u26EF
\u009D


--START RNG--
\
<[IF FN Random_10]>This has a 10% chance of happening.
<[ELSEIF FN Random_50]>This has a 45% chance of happening.
<[ELSEIF FN Random_50]>This has a 22.5% chance of happening.
<[ELSE]>This happens if nothing else happens (22.5%)
<[ENDIF]>\
--RNG ended--
<[ACTION CONTINUE]>
`,

BedroomA:`
The room is also messy and destroyed, just like all the others.
You see a pink bed in one corner, with a large wardrobe in the other.
<[GOTO Look In Wardrobe||get_nothing]>
`,
Kitchen:`
Wow, it's a kitchen?
`,
BedroomB:`
The room is blue dah ba dee dah ba die.
`,
Piano:`
The piano doesn't even have strings?
<[ACTION GOTO Play Piano||piano_playing_1||Pls play]>
`,
Dining:`
The dining table was broke in half god as my witness.\
<[IF FN has_screwdriver]>
You wonder what you can do with your screwdriver...
<[ELSE]>
There is a screwdriver sitting on the table.
<[GOTO Pickup Screwdriver||get_screwdriver]>
<[ENDIF]>
`,
Art:`
Art
<[GOTO art||ART]>
`,
ART:`
ART
<[GOTO Art||art]>
`,
art:`
art
<[GOTO ART||Art]>
`,
Bath:`
It's a bathroom.
`,
Foyer:`
The door! If only you could open it.

<[IF FN has_screwdriver]>
Wait a second! the door handle has screw holes!
<[GOTO Unscrew Lock||THE_END]>
<[ENDIF]>
`,
Living:`
Back in the living room! Still dark. Still destroyed.
`,
piano_playing_1:`
<[DISABLE_CELLS]>\
<[ACTION CONTINUE]>\
Wow, You played the piano! :)
`,
get_nothing:`
<[DISABLE_CELLS]>
There is nothing but dust in here.
<[ACTION CONTINUE]>
`,
get_screwdriver: `
<[DISABLE_CELLS]>\
<[ACTION CONTINUE]>\
<[// FN pickup_screwdriver]>\
<[SET screwdriver = true]>\
You pick up the screwdriver and look at it. Maybe you can open something with it...
`,
THE_END: `
<[DISABLE_CELLS]>
You take your screwdriver and unscrew the door handle and lock.
You did it! You can open the door!
FREEDOM!!!
THE END
`

}
}; //do not delete this line

//I have no idea if I will implement this visual novel system, but it could be fun.

var VN = {
    Layout: 'VN',
    VN_BG:{LOCATION: 'VN_BG'},
    VN_DIALOG:{LOCATION: 'VN_DIALOG'}
};
VN.VN_BG.Backgrounds = {
    'snow': 'Backgrounds/snowy_field.jpg'
};
VN.VN_BG.Characters = {
    'Kyle':{Name: 'Kyle', Images:{'default': 'Characters/Kyle_smile.jpg', 'surprised': 'Characters/Kyle_surprised.jpg'}},
    'Sarah':{Name: 'Sarah', Images:{'default': 'Characters/Sarah_smile.jpg', 'surprised': 'Characters/Sarah_surprised.jpg'}}
};
VN.scenes = {
    START:`
        <[BG snow]>
        
        Note: In the visual novel format, anything outside of a command is just a comment.
        
        <[CHAR Kyle]>

        <[D Kyle  || Snow!]>

        <[CHAR > Kyle]>
        <[CHAR < Sarah]>

        <[D Sarah || Wow, it sure is cold out here.
            Kyle  || Or is it?
            Kyle  || Hmm...
            Sarah || What? That makes no sense.
        ]>

        <[CHAR > Kyle surprised]>
        <[CHAR < Sarah surprised]>

        <[D Everyone || AAAHHH!!!]>

        <[HIDE Sarah]>

        <[D Kyle || Oh no, Sarah's DEAD!]>

        <[FADE]>
    `,
    DioScene:`
        <[LABEL Start]>
        <[D Dio || Wha- ]>
        <[JUMP Start]>
    `
};
