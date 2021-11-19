
let intervalId;
let timeNow = '00:00:00:0';
const btnStart = document.querySelector('.stopwatch .stopwatch__button_start');
const btnSplit = document.querySelector('.stopwatch .stopwatch__button_split');
const btnReset = document.querySelector('.stopwatch .stopwatch__button_reset');
const dialNums = document.querySelector('.stopwatch .dial').children;
const splitList = document.querySelector('.stopwatch__split-list');
let lastSplitTime = '';

btnStart.addEventListener('click', startStopwatch);

function startStopwatch() {
    btnStart.removeEventListener('click', startStopwatch);
    btnStart.addEventListener('click', pauseStopwatch);
    btnStart.textContent = 'Pause';
    btnStart.classList.add('stopwatch__button_pause');
    btnSplit.style.opacity = '1';
    btnSplit.style.cursor = 'pointer';
    btnReset.style.opacity = '0.6';
    btnReset.style.opacity = 'not-allowed'
    btnSplit.addEventListener('click', splitStopwatch);
    intervalId = setInterval(tick, 100);
}

function pauseStopwatch() {
    clearInterval(intervalId);
    btnStart.addEventListener('click', startStopwatch);
    btnStart.removeEventListener('click', pauseStopwatch);
    btnStart.textContent = 'Start';
    btnStart.classList.remove('stopwatch__button_pause');
    btnSplit.style.opacity = '0.6'
    btnSplit.style.cursor = 'not-allowed';
    btnSplit.removeEventListener('click', splitStopwatch);
    btnReset.style.opacity = '1';
    btnReset.style.cursor = 'pointer'
    btnReset.addEventListener('click', resetStopwatch);
}

function resetStopwatch() {
    dialNums[0].textContent = '';
    dialNums[1].textContent = '00:';
    dialNums[2].textContent = '00.';
    dialNums[3].textContent = '0';
    btnStart.addEventListener('click', startStopwatch);
    btnStart.removeEventListener('click', pauseStopwatch);
    btnStart.textContent = 'Start';
    btnStart.classList.remove('stopwatch__button_pause');
    btnSplit.style.opacity = btnReset.style.opacity = '0.6'
    btnSplit.style.cursor = btnReset.style.cursor = 'not-allowed';
    btnReset.removeEventListener('click', resetStopwatch);
    timeNow = '00:00:00:0';
    clearSplitList();
}

function splitStopwatch() {
    splitList.classList.remove('hide');
    const tableBody = splitList.children[1];
    let lapIndex = tableBody.children.length + 1;
    let splitTime = timeNow.substring(0, timeNow.length-2);

    let row = tableBody.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.textContent = `#${lapIndex}`;
    if(lapIndex == 1){
        cell2.textContent = splitTime;
    }
    else {
        let [hours1 , min1 , sec1] = splitTime.split(':').map(elem => +elem); 
        let [hours2 , min2 , sec2] = lastSplitTime.split(':').map(elem => +elem); 
        if(sec1 < sec2){
            if(min1 < min2){
                hours1 -= hours2 - 1;
                min1 = min1 + 60 - min2;
                sec1 = sec1 + 60 - sec2;
            }
            else {
                min1 = min1 - min2 - 1;
                sec1 = sec1 + 60 - sec2;
            }
        } else {
            sec1 -= sec2;
            if(min1 < min2){
                hours1 -= hours2 - 1;
                min1 = min1 + 60 - min2;
            }
            else {
                min1 -= min2;
            }
        }
        hours1 = hours1.toString().padStart(2,'0');
        min1 = min1.toString().padStart(2,'0');
        sec1 =  sec1.toString().padStart(2,'0');
        console.log('');
        cell2.textContent = `${hours1}:${min1}:${sec1}`;
    }
    cell3.textContent = splitTime;
    lastSplitTime = splitTime;
}

function tick() {
    let hours = +timeNow.split(':')[0];
    let min = +timeNow.split(':')[1];
    let sec = +timeNow.split(':')[2];
    let miliSec = +timeNow.split(':')[3];

    if (miliSec === 9) {
        if (sec === 59) {
            if (min === 59) {
                hours++;
                min = sec = miliSec = 0;
            }
            else {
                min++;
                sec = miliSec = 0;
            }
        } else {
           sec++;
            miliSec = 0;
        }
    } else {
        miliSec++;
    }

    hours = hours.toString().padStart(2, '0');
    min = min.toString().padStart(2, '0');
    sec = sec.toString().padStart(2, '0');
    miliSec = miliSec.toString();

    if (hours !== '00') {
        dialNums[0].textContent = hours + ':';
        dialNums[1].style.marginLeft = '0px';
    }
    else { 
        dialNums[0].textContent = '';
        if(window.matchMedia("(max-width: 767px)").matches){
            dialNums[1].style.marginLeft = '0px';
        }
        else {
            dialNums[1].style.marginLeft = '60px';
        }
       
    };
    dialNums[1].textContent = min + ':';
    dialNums[2].textContent = sec + '.';
    dialNums[3].textContent = miliSec;

    timeNow = `${hours}:${min}:${sec}:${miliSec}`;
}

function clearSplitList() {
    splitList.classList.add('hide');
    const tableBody = splitList.children[1];
    tableBody.innerHTML = '';
}