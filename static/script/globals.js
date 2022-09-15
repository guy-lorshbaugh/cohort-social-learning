const colors = [
    'Aqua', 'Aquamarine', 'Blue', 'Violet', 'Brown', 'BurlyWood',
    'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Crimson',
    'DarkCyan', 'DarkGoldenRod', 'DarkGreen', 'DarkKhaki',
    'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed',
    'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkTurquoise', 'DarkViolet',
    'DeepPink', 'DeepSkyBlue', 'DodgerBlue', 'ForestGreen',
    'Fuchsia', 'Gainsboro', 'Gold', 'GoldenRod', 'Green','GreenYellow',
    'HotPink', 'IndianRed', 'Indigo', 'LawnGreen', 'LightCoral',
    'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 
    'Lime', 'LimeGreen', 'Magenta', 'Maroon','MediumAquaMarine', 'MediumBlue', 
    'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 
    'MediumSpringGreen', 'MediumTurquoise', 'Violet', 'LightSteelBlue',
    'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid',
    'PaleGreen','PaleTurquoise', 'PaleVioletRed', 
    'Peru', 'Pink', 'Plum', 'Purple', 'RebeccaPurple',
    'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 
    'SeaGreen', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 
    'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise',
    'Violet', 'Wheat', 'YellowGreen'
]

function getBodyFunc() {
    return document.body.getAttribute("function");
}

function getID(item) {
    return item.match(/\d/g).join("");
}

function randomColor() {
    let  colorIndex = Math.floor(Math.random() * colors.length);
    console.log(colors[colorIndex]);
    return colors[colorIndex];
}
