/**
 * Created by tabradford on 6/14/2016.
 */

///////////////Change these variables to satisfy your requirements/////////////
//The below will determine how many Question and Answers there are.
//This picture should link up with the text.. the user will match picture with its text
//for example the "A little baby" will always only except the little baby picture
///////////////////////////////////////////////////////////////////////////////
var imageDir = 'images/';
var userChangeThis = [
    {
        text: 'Irado',
        img: imageDir + 'irado.jpg'
    },
    {
        text: 'Triste',
        img: imageDir + 'triste.jpg'
    },
    {
        text: 'Neutro',
        img: imageDir + 'neutro.jpg'
    },
    {
        text: 'Alegre',
        img: imageDir + 'alegre.jpg'
    }];
///////////////////////////////////////////////////////////////////////////////
/*
 * START: of public all variable
 * ================================================================
 */
var totalItemCount = userChangeThis.length;
var matchItems = answerObject(uniquRand(totalItemCount));
var element = function (id) {
    return document.getElementById(id);
};
/*
 * END: of public all variable
 * ================================================================
 */

/*
 * helper functions
 * =================================================================
 */

/**
 * add the drag and drop html to the DOM
 */
function adDnD(num_stud) {
    var newOrderA = uniquRand(num_stud);
    var newOrderQ = uniquRand(num_stud);

    for (var i = 0; i < num_stud; i++) {
        element('Qbox').innerHTML += '<div id="box' + newOrderQ[i] + '" class="new-box space" ondrop="drop(event)" ondragover="allowDrop(event)">' +
            '<span>' + matchItems["box" + newOrderQ[i]].inputText + '</span></div>';

    }

    for (var c = 0; c < num_stud; c++) {
        element('items').innerHTML += '<div class="square" id="dropIt" ondrop="drop(event)" ondragover="allowDrop(event)">' +
            '<img class="img" id="' + matchItems["box" + newOrderA[c]].id + '" src="' + matchItems["box" + newOrderA[c]].img + '" draggable="true" ondragend="DragEnd(event)" ondragstart="DragStart(event)">' +
            '</div>';
    }
}

/**
 * this takes in a number and returns
 * an array of unique random numbers
 * starting from o to the amount given.
 * @param {number} amount this is the range and the amount of random numbers
 * @returns {Array} unique random numbers between 0 and amount
 */
function uniquRand(amount) {
    var uRandA = [];
    var random = 0;
    var temp = 0;

    for (var i = 0; i < amount; i++) {
        uRandA.push(i);
    }

    for (var c = 0; c < uRandA.length; c++) {
        random = Math.floor(Math.random() * amount);

        temp = uRandA[c];
        uRandA[c] = uRandA[random];
        uRandA[random] = temp;
    }
    return uRandA;
}

/**
 * this will return an object in the following
 * format {box+i: drag+random}
 * @param {Array} QA_array an array of numbers
 * @returns {{}} returns and object
 */
function answerObject(QA_array) {
    var QA_object = {};
    for (var i = 0; i < QA_array.length; i++) {
        QA_object['box' + i] = {};
        QA_object['box' + i].id = 'drag' + QA_array[i];
        QA_object['box' + i].inputText = userChangeThis[i].text;
        QA_object['box' + i].img = userChangeThis[i].img;
    }
    return QA_object;
}

/*
 * END: helper functions
 * =================================================================
 */

/*
 * Start: Drag and drop functions
 * =================================================================
 */

/**
 * Drag over needs to be stopped in order for the drop event to work
 * @param ev the event object
 * @returns {boolean}
 */
function allowDrop(ev) {
    if (ev.preventDefault) {
        ev.preventDefault();
    }
    return false;
}

/**
 * fires on the start of a drag
 * @param e the event object
 */
function DragStart(e) {
    e.target.style.opacity = '0.4';
    e.target.style.border = '2px dashed #999';
    e.dataTransfer.setData("text", e.target.id);
}
/**
 * fires on the end of a drag
 * @param e the event object
 */
function DragEnd(e) {
    e.target.style.opacity = '';
    e.target.style.border = '';
}
/**
 * will fire each time the drop happens given that dragOver is disabled
 * @param ev the event object
 */
function drop(ev) {
    var doppedElementID = ev.dataTransfer.getData("text");

    //only let items that are supposed to be dropped here go through
    if ((matchItems.hasOwnProperty(ev.target.id) && matchItems[ev.target.id].id === doppedElementID) || 'dropIt' == ev.target.id) {
        ev.target.appendChild(element(doppedElementID));
    }
}

/*
 * END: Drag and drop functions
 * =================================================================
 */

/**
 * add all functions that load on start here.
 * Note - Make sure all functions are in the proper order.
 */
window.onload = function () {
    adDnD(totalItemCount);
};