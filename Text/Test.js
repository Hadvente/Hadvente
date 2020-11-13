/*jshint esversion: 6 */ 

var TextGame = {
    Layout: '2_COLUMNS',
    //2_Columns is the default layout
    //It comes with 4 predefined cells:
    //Title, Menus, Dialog, and Actions
    //If you do not have these 4 cell files, your game will not load
    //Beyond this, there are about 10 separate cell columns on the left side below menu
    //Other Layouts I might want to add would be 3_Columns and VN

    title: 'Escape The House',
    author: 'Caleb Holloway',

    //These are the 3 cells I've defined and used in this test game
    IMAGE_CELL: {
        CELL: 'Top_Left'
    },
    INVENTORY_VIEWER: {
        CELL: 'Middle_Left' //If you want to hide a cell, set CELL: to 'NONE', otherwise you will get an error
    },
    MAP_GRID:{
        CELL: 'Bottom_Left',
        starting_map: 'abandoned_home',
        abandoned_home: {
            grid_size: [4, 3],
            only_grid: true,
            start: [2, 1],
            grid:[
                [ '',                     'Bedroom||BedroomA',    'Kitchen' ],
                [ 'Bedroom||BedroomB',    'Piano',                'Dining'  ],
                [ 'Art',                  'Living',               'Bath'    ],
                [ '',                     'Foyer',                ''        ]
            ],
        }
    },

    //these 4 should all become mandatory and uneditable, a static part of the 2_Columns layout.
    //If someone wants to change them, they should make a new layout, possibly a duplicated clone of 2_Columns.
    MENUS  :{CELL:'Menu'},
    TITLE  :{CELL:'Title'},
    DIALOG :{CELL:'Dialog'},
    ACTIONS:{CELL: 'Actions', grid_size: [3, 3]},

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
                return !!_GAME_DATA.INV.screwdriver;
            },
            has_tape(_GAME_DATA, _GAME_STATE, _HAE){
                return !!_GAME_DATA.INV.tape;
            },
            has_knife(_GAME_DATA, _GAME_STATE, _HAE){
                return !!_GAME_DATA.INV.knife;
            },
            has_brick(_GAME_DATA, _GAME_STATE, _HAE){
                return !!_GAME_DATA.INV.brick;
            }
        },
        set: {
            init_system(_GAME_DATA, _GAME_STATE){
                _GAME_DATA.INV = {};
            },
            pickup_screwdriver(_GAME_DATA, _GAME_STATE, _HAE){
                _GAME_DATA.INV.screwdriver = 'Screwdriver';
            },
            pickup_tape(_GAME_DATA, _GAME_STATE, _HAE){
                _GAME_DATA.INV.tape = 'Roll of Tape';
            },
            pickup_knife(_GAME_DATA, _GAME_STATE, _HAE){
                _GAME_DATA.INV.knife = 'Chef\'s Knife';
            },
            pickup_brick(_GAME_DATA, _GAME_STATE, _HAE){
                _GAME_DATA.INV.brick = 'Brick';
            },
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
<[FN init_system]>\
<[ACTION CONTINUE]>
`,

FirstScene:`
`,
BedroomA:`
<[IMG_CELL bedroomA]>\
The room is messy and destroyed, just like all the others. You can even see the wallpaper peeling off all around you.
On the wall to the left of the door is an uncovered bed. When you peek around the bed, you see a small space heater resting on the floor.
At the other end of the bedroom, you can see an unopened wardrobe you could search for items to help you escape.
<[GOTO Look In Wardrobe||get_nothing]>
`,
Kitchen:`
Wow, it's a kitchen?
<[IF FN has_knife]>
You wonder what you can do with your knife...
<[ELSE]>
There is a knife sitting on the table.
<[GOTO Pickup Knife||get_knife]>
<[ENDIF]>
`,
BedroomB:`
This bedroom has lots of blue decorations and furniture in it, all covered in dust.\
<[IF FN has_brick]>
You wonder what you can do with your brick...
<[ELSE]>
There is a brick sitting on the bedroom floor in one corner.
<[GOTO Pickup Brick||get_brick]>
<[ENDIF]>
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
You see a setup for painting in here.
<[IF FN has_tape]>
You wonder what you can do with your tape...
<[ELSE]>
There is a roll of tape sitting on the floor by the canvas.
<[GOTO Pickup Tape||get_tape]>
<[ENDIF]>
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
<[FN pickup_screwdriver]>\
You pick up the screwdriver and look at it. Maybe you can open something with it...
`,
get_tape: `
<[DISABLE_CELLS]>\
<[ACTION CONTINUE]>\
<[FN pickup_tape]>\
You pick up the tape and look at it...
`,
get_knife: `
<[DISABLE_CELLS]>\
<[ACTION CONTINUE]>\
<[FN pickup_knife]>\
You pick up the knife and look at it...
`,
get_brick: `
<[DISABLE_CELLS]>\
<[ACTION CONTINUE]>\
<[FN pickup_brick]>\
You pick up the brick and look at it...
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
    title: 'Snowball Fight',
    author: 'Caleb Holloway',
    Layout: 'Visual_Novel',
    MENUS:    {CELL: 'Menus'},
    TITLE:    {CELL: 'Title'},
    VN_BG:    {CELL: 'BG'},
    VN_CHAR:  {CELL: 'Char'},
    VN_DIALOG:{CELL: 'Dialog'},
};
VN.VN_BG.Backgrounds = {
    'snow': 'park_winter.jpg'
};
VN.VN_CHAR.Characters = {
    'Kyle':{Name: 'Kyle', Images:{'default': 'Kyle_smile.jpg', 'surprised': 'Kyle_surprised.jpg'}},
    'Sarah':{Name: 'Sarah', Images:{'default': 'Sarah_smile.jpg', 'surprised': 'Sarah_surprised.jpg'}}
};
VN.scenes = {
    START:`
<[BG snow]>\
You look as the snow falls around you.
    `,
    SNOW:`
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

HAE = TextGame;
//HAE = VN;
