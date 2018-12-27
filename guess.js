/*
Example data
{
    'f': {
        f: 4,
        d: 0
    },
    'd': {
        f: 0,
        d: 3
    },
    'ff' {
        f: 1,
        d: 0
    }...
}
*/

var last_seq = [];
var data = [];
var last_prediction = '';
var prediction = '';
var last_letter = '';
var correct = 0;
var total = 0;

const run = function(letter) {
    if ( ['d', 'D', 'f', 'F'].includes(letter) ) {
        letter = letter.toLowerCase();
        prediction = predict(letter);
        update(letter);
        last_letter = letter;
    }
}

const predict = function(letter) {
    last_prediction = prediction;

    f_score = 0;
    d_score = 0;

    test_seq = last_seq.join('');
    while ( test_seq !== '' ) {
        if (!data[test_seq]) {
            data[test_seq] = {
                f: 0,
                d: 0
            };
        }
        data[test_seq][letter]++;
        item = data[test_seq];

        test_seq = test_seq.substring(1);
    }

    test_seq = last_seq.join('') + letter;
    if (test_seq.length > 10) test_seq.substring(1);
    while ( test_seq !== '' ) {
        item = data[test_seq];
        if (item) {
            weight = Math.abs(item.d-item.f)/(item.d+item.f)/(test_seq.length);
            f_score += item.f * weight;
            d_score += item.d * weight;    
        }

        test_seq = test_seq.substring(1);
    }
    guess = f_score > d_score ? 'f' : 'd';

    last_seq.push(letter);
    if (last_seq.length > 10) last_seq.shift();

    return guess;
}

const update = function(letter) {
    if (last_prediction !== '') {
        correct += last_prediction === letter ? 1 : 0;
        total++;
        pct = Math.round(correct / total * 100);
        console.log(last_prediction === letter ? 'Correct' : 'Wrong');
        console.log(`Correct guesses: ${pct}%`);
        console.log('-------------------------------------');

        ul = document.getElementById('history');
        li = document.createElement('li');
        li.appendChild(document.createTextNode(`Guess: ${last_prediction} / Entered: ${letter}`));
        li.setAttribute('class', last_prediction === letter ? 'correct' : 'incorrect');
        ul.appendChild(li);
        if (ul.getElementsByTagName("li").length > 20) {
            ul.removeChild(ul.children[0]);
        }
    
        rate = document.getElementById('rate');
        rate.innerText=`${pct}%`;    
    }

    if (prediction !== '') {
        console.log(`Next input will be: ${prediction}`);
    }
}

document.addEventListener('keypress', (event) => {
    run(event.key);
});