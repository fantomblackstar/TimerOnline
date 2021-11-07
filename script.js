const editBtn = document.querySelector('.timer__button-edit').onclick = showModal;
const modalWrap = document.querySelector('.modal-wrap');
const modalWindow = document.querySelector('.modal-window');


let timerAlarm = {
    1: 'alarm5',
}


function showModal() {
    const timerId = this.dataset.timerid;

    let timerObjInfo = timerInfo(false, timerId);
    console.log(timerObjInfo);
    modalInfo(true, timerId, timerObjInfo);
    toggleModal()
}

document.querySelector('.modal-window .btn-submit').onclick = function () {
    const timerId = this.dataset.timerid;
    let modalObjInfo = modalInfo(false, timerId);
    timerInfo(true, timerId, modalObjInfo);
    toggleModal();
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


function timerInfo(setTimerInfo, timerId, obj) {
    let name = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__name`);
    let dialNums = document.querySelector(`.timer[data-timerid='${timerId}'] .timer__dial`).children;
    let hrs = dialNums[0];
    let min = dialNums[1];
    let sec = dialNums[2];
    let alarm = timerAlarm[timerId];
    if (setTimerInfo === true) {
        let { name: n, hrs: h, min: m, sec: s } = obj;
        name.textContent = n;
        hrs.textContent = h.padStart(2, '0') + ':';
        min.textContent = m.padStart(2, '0') + ':';
        sec.textContent = s.padStart(2, '0') + '.';
        return;
    } else {
        name = name.textContent;
        hrs = hrs.textContent.replace(/\D/g, '');
        min = min.textContent.replace(/\D/g, '');
        sec = sec.textContent.replace(/\D/g, '');
        return { name, hrs, min, sec }
    }

}


function modalInfo(setModalInfo, timerId, obj) {
    const modalBtnSubmit = document.querySelector(`.modal-window .btn-submit`);
    modalBtnSubmit.dataset.timerid = timerId;
    const modalName = document.querySelector(`.modal-window .modal-window__input[name="input-name"]`)
    const modalHrs = document.querySelector(`.modal-window .input-hrs`);
    const modalMin = document.querySelector(`.modal-window .input-min`);
    const modalSec = document.querySelector(`.modal-window .input-sec`);
    const modalSelectChildren = document.querySelector(`.modal-window .select`).childNodes;
    let modalAlarm;
    if (setModalInfo === true) {
        let { name, hrs, min, sec } = obj;
        modalName.value = name;
        modalHrs.value = hrs;
        modalMin.value = min;
        modalSec.value = sec;

        modalSelectChildren.forEach(elem => {
            if (elem.value === timerAlarm[timerId]) modalAlarm = elem;
            elem.selected = false;
        })
        console.log(modalAlarm, timerAlarm);
        modalAlarm.selected = true;
        return;
    } else {
        modalSelectChildren.forEach(elem => {
            if (elem.selected === true) modalAlarm = elem;
        })
        timerAlarm[timerId] = modalAlarm.value;
        let name = modalName.value;
        let sec = modalSec.value % 60 + '';
        let min = (+modalMin.value + Math.floor(+modalSec.value / 60)) % 60 + '';
        let hrs = +modalHrs.value + Math.floor(+modalMin.value / 60) + Math.floor(+modalSec.value / 3600) + '';

        return { name, hrs, min, sec }
    }
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

// delete alarm



// create new timer

document.querySelector('.add-timer').onclick = () => {
    let timerId = document.querySelectorAll('.timer').length + 1;
    if(timerId === 4) {
        let errorText = document.querySelector('.error-text');
        errorText.textContent = `*You can't create more than 3 timers`
        errorText.style.display = 'block';
        setTimeout(() => {
            errorText.style.display = 'none';
        }, 3*1000)
        return;
    }

    let newTimer = document.querySelector('.timer').cloneNode(true);
    let btnEdit = newTimer.children[0].children[1];
    let timerName = newTimer.children[0].children[0];
    timerName.textContent = `Timer ${timerId}`;
    newTimer.dataset.timerid = btnEdit.dataset.timerid = timerId;
    newTimer.children[1].children[0].textContent = '00:';
    newTimer.children[1].children[1].textContent = '01:';
    newTimer.children[1].children[2].textContent = '00:';
    timerAlarm[timerId] = 'alarm1';

    btnEdit.addEventListener('click', showModal);
    document.querySelector('.main').append(newTimer);
}