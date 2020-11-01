/*jshint esversion: 6 */ 

CSS = (function(){
var styles = `
/*Begin adding CSS*/
body {
    background-color: #000;
    color: #eee;
    font-size: 64px; /* This is purposefully giant - we don't want anyone to not define their font size*/
}
p {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
}

#GameWindow_3Columns {
    min-width: min(170.3vh, 95.8vw);
    min-height: min(95.8vh, 53.9vw);
    width: min(170.3vh, 95.8vw);
    height: min(95.8vh, 53.9vw);
    margin: 0.5% auto;
    margin-bottom: 0px;
    border: 3px solid gray;
    border-radius: 10px;
    padding: 5px;
    position:absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    font-size: 0.36vw; /* This exists in case the browser can't handle a min inside the font-size */
    font-size: min(0.4vw, 0.71vh); /* This is purposefully small - forcing every cell to pick a font size, using em */
}

#GameWindow_2Columns {
    min-width: min(127.7vh, 95.8vw);
    min-height: min(95.8vh, 71.85vw);
    width: min(127.7vh, 95.8vw);
    height: min(95.8vh, 71.85vw);
    margin: 0.5% auto;
    margin-bottom: 0px;
    border: 3px solid gray;
    border-radius: 10px;
    padding: 5px;
    position:absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    font-size: 0.45vw; /* This exists in case the browser can't handle a min inside the font-size */
    font-size: min(0.5vw, 0.66vh); /* This is purposefully small - forcing every cell to pick a font size, using em */
}

.tiny_font {
    font-size: 2.5em;
}
.small_font {
    font-size: 3em;
}
.medium_font {
    font-size: 3.5em;
}
.large_font {
    font-size: 4.5em;
}
.giant_font {
    font-size: 6em;
}
.standard_font {
    font-size: 28px;
}
/* End of Stylesheet */
`;

var styleSheet       = document.createElement("style");
styleSheet.type      = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
});
