const editBtn = document.querySelector('.timer__button-edit').onclick = showModal;
const modalWrap = document.querySelector('.modal-wrap');
const modalWindow = document.querySelector('.modal-window');

let timerObj = {
    1: {
        name: 'Timer 1',
        alarm: 'alarm5',
        time: '00:01:00',
        timeNow: '00:01:00:0',
    },
}

function showModal() {
    const timerId = this.dataset.timerid;
    setModalInfo(timerId);
    toggleModal()
}

document.querySelector('.modal-window .btn-submit').onclick = function () {
    const timerId = this.dataset.timerid;
    let infoSucces = getModalInfo(timerId);
    if (infoSucces) {
        setTimerInfo(timerId);
        toggleModal();
    }
}

document.querySelector('.modal-window__button-close').onclick = () => toggleModal();
document.querySelector('.modal-wrap').onclick = () => toggleModal();

function toggleModal() {
    modalWrap.classList.toggle('hide');
    modalWindow.classList.toggle('hide');
    if (typeof alarmSound !== 'undefined') {
        btnPlayAlarm.style.backgroundImage = "url('img/soundon.png')";
        alarmSound.pause();
        btnPlayAlarm.dataset.playing = 'false';
    }
}

function setTimerInfo(timerId) {
    let name = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__name`);
    let dialNums = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__dial`).children;
  
    let hrs = dialNums[0];
    let min = dialNums[1];
    let sec = dialNums[2];
    let miliSec = dialNums[3];
    name.textContent = timerObj[timerId].name;
    hrs.textContent = timerObj[timerId].time.split(':')[0] + ':';
    min.textContent = timerObj[timerId].time.split(':')[1] + ':';
    sec.textContent = timerObj[timerId].time.split(':')[2] + '.';
    miliSec.textContent = '0';

}

const modalBtnSubmit = document.querySelector(`.modal-window .btn-submit`);
const modalBtnDelete = document.querySelector(`.modal-window .btn-delete`);
const modalName = document.querySelector(`.modal-window .modal-window__input[name="input-name"]`)
const modalHrs = document.querySelector(`.modal-window .input-hrs`);
const modalMin = document.querySelector(`.modal-window .input-min`);
const modalSec = document.querySelector(`.modal-window .input-sec`);
const modalSelectChildren = document.querySelector(`.modal-window .select`).childNodes;
const modalErrorText = document.querySelector('.modal-window__error-text');

function setModalInfo(timerId) {
    modalBtnDelete.dataset.timerid = modalBtnSubmit.dataset.timerid = timerId;
    let modalAlarm;

    modalName.value = timerObj[timerId].name;
    modalHrs.value = timerObj[timerId].time.split(':')[0];
    modalMin.value = timerObj[timerId].time.split(':')[1];
    modalSec.value = timerObj[timerId].time.split(':')[2];

    modalSelectChildren.forEach(elem => {
        if (elem.value === timerObj[timerId].alarm) modalAlarm = elem;
        elem.selected = false;
    })
    modalAlarm.selected = true;
    
    let pauseBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_pause`);
    if (pauseBtn) {
        pauseTimer.call(pauseBtn);
    }
}


function getModalInfo(timerId) {
    modalBtnDelete.dataset.timerid = modalBtnSubmit.dataset.timerid = timerId;
    modalSelectChildren.forEach(elem => {
        if (elem.selected === true) modalAlarm = elem;
    })
    timerObj[timerId].alarm = modalAlarm.value;

    let sec = (modalSec.value % 60 + '').padStart(2, '0');
    let min = ((+modalMin.value + Math.floor(+modalSec.value / 60)) % 60 + '').padStart(2, '0');
    let hrs = (+modalHrs.value + Math.floor(+modalMin.value / 60) + Math.floor(+modalSec.value / 3600) + '').padStart(2, '0');

    if (hrs == '00' && min == '00' && +sec < 3) {
        modalErrorText.innerHTML = `*Timer time must be at least 30 sec`;
        modalErrorText.classList.remove('hide');
        setTimeout(() => modalErrorText.classList.add('hide'), 2000);
        return false;
    }
    if (modalName.value.length < 6) {
        modalErrorText.innerHTML = `*Timer name must have at least <br/>6 characters`;
        modalErrorText.classList.remove('hide');
        setTimeout(() => modalErrorText.classList.add('hide'), 2000);
        return false;
    }
    timerObj[timerId].time = `${hrs}:${min}:${sec}`;
    timerObj[timerId].timeNow = `${hrs}:${min}:${sec}:0`;
    timerObj[timerId].name = modalName.value;

    return true;
}

let alarmSound;
const btnPlayAlarm = document.querySelector('.select__img_play');

btnPlayAlarm.onclick = () => {

    let songName = 'song1';

    const modalSelectChildren = document.querySelector('.modal-window .select').childNodes;
    modalSelectChildren.forEach(elem => {
        if (elem.selected) songName = elem.value;
    })

    if (btnPlayAlarm.dataset.playing == 'false') {
        btnPlayAlarm.style.backgroundImage = "url('img/soundoff.png')";
        alarmSound = new Audio(`alarm/${songName}.mp3`);
        alarmSound.play();
        btnPlayAlarm.dataset.playing = 'true';
    }
    else {
        btnPlayAlarm.style.backgroundImage = "url('img/soundon.png')";
        alarmSound.pause();
        btnPlayAlarm.dataset.playing = 'false';
    }
}

document.querySelector('.modal-window .btn-delete').onclick = function () {
    const timerId = +this.dataset.timerid;
    if (timerId === 1) {

        modalErrorText.textContent = `*You can't delete main Timer`;
        modalErrorText.classList.remove('hide');
        setTimeout(() => {
            modalErrorText.classList.add('hide');
        }, 3 * 1000)
        return;
    }

    document.querySelector(`.timer[data-timerid="${timerId}"]`).remove();
    delete timerObj[timerId].alarm;
    toggleModal();
}

document.querySelector('.add-timer').onclick = () => {
    let timerId = document.querySelectorAll('.timer').length + 1;
    if (timerId === 4) {
        let errorText = document.querySelector('.error-text');
        errorText.classList.remove('hide');
        setTimeout(() => {
            errorText.classList.add('hide');
        }, 3 * 1000)
        return;
    }
    if(document.querySelector(`.timer[data-timerid='1'] .timer__button_start`).style.opacity === '0.5'){
        let resetBtn = document.querySelector(`.timer[data-timerid='1'] .timer__button_reset`);
        stopAlarmTimeOut.call(resetBtn);
    }

    let newTimer = document.querySelector('.timer').cloneNode(true);
    let btnEdit = newTimer.children[0].children[1];
    let timerName = newTimer.children[0].children[0];
    timerName.textContent = `Timer ${timerId}`;
    newTimer.dataset.timerid = btnEdit.dataset.timerid = timerId;
    newTimer.children[1].children[0].textContent = '00:';
    newTimer.children[1].children[1].textContent = '01:';
    newTimer.children[1].children[2].textContent = '00.';
    newTimer.children[1].children[3].textContent = '0';

    timerObj[timerId] = {
        name: `Timer ${timerId}`,
        alarm: 'alarm1',
        time: '00:01:00',
        timeNow: '00:01:00:0',
    }
    const btnStartTimer = newTimer.children[2].children[0];
    const btnResetTimer = newTimer.children[2].children[1];
   
    if (btnStartTimer.textContent === 'Pause') {
        btnStartTimer.textContent = 'Start';
        btnStartTimer.classList.remove('timer__button_pause');
    }

    btnStartTimer.addEventListener('click', startTimer);
    btnResetTimer.addEventListener('click', resetTimer);
    btnEdit.addEventListener('click', showModal);
    document.querySelector('.main').append(newTimer);
}

document.querySelector('.timer__button_start').onclick = startTimer;

function startTimer() {
    if (this.textContent == 'Pause') return;
    this.classList.add('timer__button_pause');
    this.textContent = 'Pause';
    this.removeEventListener('click', startTimer);
    this.addEventListener('click', pauseTimer);

    const timerId = +this.parentElement.parentElement.dataset.timerid;
    let intervalId = setInterval(tick, 100, timerId);
    timerObj[timerId].intervalId = intervalId;
}

function pauseTimer() {
    this.classList.remove('timer__button_pause');
    this.textContent = 'Start';
    this.removeEventListener('click', pauseTimer);
    this.addEventListener('click', startTimer);

    const timerId = +this.parentElement.parentElement.dataset.timerid;
    clearInterval(timerObj[timerId].intervalId);
}

function tick(timerId) {
    let timerDial = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__dial`).children;
    let timeNowArr = timerObj[timerId].timeNow.split(':');

    let hours = +timeNowArr[0];
    let min = +timeNowArr[1];
    let sec = +timeNowArr[2];
    let miliSec = +timeNowArr[3];
    if (hours == 0 && min == 0 && sec == 0 && miliSec == 0) {
        timerTimeOut(timerId);
        return;
    }

    if (miliSec == 0) {
        if (sec == 0) {
            if (min == 0) {
                hours--;
                min = 59;
                sec = 59;
                miliSec = 9;
            } else {
                min--;
                sec = 59;
                miliSec = 9;
            }
        } else {
            sec--;
            miliSec = 9;
        }
    }
    else {
        miliSec--;
    }

    timerDial[0].textContent = hours = hours.toString().padStart(2, '0') + ':';
    timerDial[1].textContent = min = min.toString().padStart(2, '0') + ':';
    timerDial[2].textContent = sec.toString().padStart(2, '0') + '.';
    timerDial[3].textContent = miliSec;
    timerObj[timerId].timeNow = hours + min + sec.toString().padStart(2, '0') + ':' + miliSec;
}

document.querySelector('.timer__button_reset').onclick = resetTimer;

function resetTimer() {
    const timerId = +this.parentElement.parentElement.dataset.timerid;
    if (typeof timerObj[timerId].intervalId !== 'undefined') {
        timerObj[timerId].timeNow = timerObj[timerId].time + ':0';
        setTimerInfo(timerId);
        let pauseBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_pause`);
        if (pauseBtn) {
            pauseTimer.call(pauseBtn);
        }
        else {
            clearInterval(timerObj[timerId].clearInterval);
        }
    }
}

function timerTimeOut(timerId) {
    clearInterval(timerObj[timerId].intervalId)
    let timerDial = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__dial`);
    timerDial.style.color = '#c70e00';
    let startBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_start`);
    startBtn.removeEventListener('click', pauseTimer);
    startBtn.style.opacity = '.5';
    startBtn.style.cursor = 'not-allowed';

    if(typeof alarmSound === 'undefined' || alarmSound.paused){
        alarmSound = new Audio(`alarm/${timerObj[timerId].alarm}.mp3`);
        alarmSound.play();
    }

    let resetBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_reset`);
    resetBtn.addEventListener('click', stopAlarmTimeOut);
    resetBtn.removeEventListener('click', resetTimer);
}


function stopAlarmTimeOut(){
    const timerId = +this.parentElement.parentElement.dataset.timerid;
    alarmSound.pause();
    let resetBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_reset`);
    resetBtn.addEventListener('click', resetTimer);
    resetBtn.removeEventListener('click', stopAlarmTimeOut);
    let timerDial = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__dial`);
    timerDial.style.color = 'white';

    let startBtn = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__button_start`);
    startBtn.addEventListener('click', startTimer);
    startBtn.style.opacity = '1';
    startBtn.textContent = 'Start'
    startBtn.style.cursor = 'pointer';
    startBtn.classList.remove('timer__button_pause');
    timerObj[timerId].timeNow = timerObj[timerId].time + ':0';
    setTimerInfo(timerId);
}