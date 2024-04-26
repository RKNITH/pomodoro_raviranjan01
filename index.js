const timerDisplay = document.querySelector('.timer');
const title = document.querySelector('.title');
const startBtn = document.querySelector('.startBtn');
const pauseBtn = document.querySelector('.pauseBtn');
const resumeBtn = document.querySelector('.resumeBtn');
const resetBtn = document.querySelector('.resetBtn');
const pomoCountDisplay = document.querySelector('.pomoCountDisplay');



const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
let timerId = null;
let oneRoundComplete = false;
let total_count = 0;
let paused = false;



const saveLocalCounts = () => {
    let count = JSON.parse(localStorage.getItem('pomoCounts'));
    count !== null ? count++ : count = 1;
    count++;
    localStorage.setItem('pomoCounts', JSON.stringify(count));
}

const showPomoCount = () => {
    const counts = JSON.parse(localStorage.getItem('pomoCounts'))
    if (counts > 0) {
        pomoCountDisplay.style.display = 'flex';

    }
    pomoCountDisplay.firstElementChild.textContent = counts;

}
showPomoCount();




const updateTitle = (msg) => {
    title.textContent = msg;
}

const countDown = (time) => {
    return () => {
        const min = Math.floor(time / 60).toString().padStart(2, '0');
        const sec = (time % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${min} : ${sec}`;
        time--;

        if (time < 0) {
            stopTimer();
            if (!oneRoundComplete) {
                timerId = startTimer(BREAK_TIME);
                oneRoundComplete = true;
                updateTitle("It's Break Time")
            }
            else {
                updateTitle("Cpmpleted 1 Round of Pomodoro Technique!")
                setTimeout(() => updateTitle("Start Timer Again"), 2000);
                total_count++;
                saveLocalCounts();
                showPomoCount();


            }
        }

    }
}


const startTimer = (startTime) => {
    if (timerId !== null) {
        stopTimer();
    }
    return setInterval(countDown(startTime), 1000)
}

const stopTimer = () => {
    clearInterval(timerId)
    timerId = null;
}


const getTimeInSec = (time) => {
    const [min, sec] = time.split(':');
    return parseInt(min * 60) + parseInt(sec);


}

startBtn.addEventListener('click', () => {
    timerId = startTimer(WORK_TIME);
    updateTitle("It's Work Time")
})

resetBtn.addEventListener('click', () => {
    stopTimer();
    timerDisplay.textContent = '25:00';
    updateTitle("Start Timer Again")
})

pauseBtn.addEventListener('click', () => {
    stopTimer();
    paused = true;
    updateTitle('Timer Paused')
})

resumeBtn.addEventListener('click', () => {
    if (paused === true) {
        const currentTime = getTimeInSec(timerDisplay.textContent);
        timerId = startTimer(currentTime);
        paused = false;
        (!oneRoundComplete) ? updateTitle("It's Work Time") : updateTitle("It's Break Time")

    }


})