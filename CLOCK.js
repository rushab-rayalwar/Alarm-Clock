let time = {};                                          // declaring global variables  
let alarms = [];
let mainTimeDisplay = document.querySelector("#main-time-display>span");
let addAlarmButton = document.querySelector("#add-alarm-button");
let addAlarmScreen = document.querySelector("#add-alarm-screen");
let meridianCurrentTime = document.querySelector("#meridian-current-time");
let alarmListContainer = document.querySelector("#alarms-container");
let noAlarmsElement = document.querySelector("#no-alarms");
let alarmSound = document.querySelector("audio");
let alarmChecked = false;
let alarmHasHit = false;
let currentMinut = 61;

let hoursInput = document.querySelector('#hours-input');  // elements from "Add Alarm" screen
let minutesInput = document.querySelector('#minutes-input');
let meridianInput = document.querySelector('#meridian');
let addButton = document.querySelector("#add-button");
let closeButton = document.querySelector("#close-mark");

let stopAlarmButton = document.querySelector("#stop-alarm-button"); // elements on 'alarm-hit; screen
let alarmHitScreen = document.querySelector("#alarm-screen");
let alarmHitString = document.querySelector(".alarm-time");


function formatTime (timeObj){                       // formats time in the 'HOURS:MINUTES:SECONDS MERIDIAN' format
    if(timeObj.hours > 12){
        timeObj.hours = timeObj.hours - 12;
        timeObj.meridian = 'PM';
    } else { timeObj.meridian = 'AM';}

    if(timeObj.hours < 10) {
        timeObj.hours = '0' + timeObj.hours;
    } if (timeObj.minutes < 10) {
        timeObj.minutes = '0' + timeObj.minutes;
    } if (timeObj.seconds < 10) {
        timeObj.seconds = '0' + timeObj.seconds;
    }

    return `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`;
}

function alarmHit(timeString) {                                   // is called when an alarm is hit
    alarmHitString.textContent = timeString;
    alarmHitScreen.style.display = 'flex';
    setTimeout(function(){
        alarmHitScreen.style.opacity = '1';
    },0);
    alarmSound.play();

    let indexOfAlarmToBeDeletedFromTheList = alarms.find( (alarmObject,indexOfObject) => { // after the alarm is hit, the alarm is removed from the list of alarms
        if (alarmObject.string === timeString){
            return indexOfObject;
        }
    });
    alarms.splice(indexOfAlarmToBeDeletedFromTheList,1);
    updateAlarmListContainer();
}

function updateTime () {                            // updates currrent time on screen
    mainTimeDisplay.textContent = '';

    let currentTime = new Date();
    time.hours = currentTime.getHours();
    time.minutes = currentTime.getMinutes().toString();
    time.seconds = currentTime.getSeconds().toString();
    time.meridian = time.hours >= 12 ? 'PM':'AM';
    time.timeString = formatTime(time);
    time.string = `${time.hours.toString().padStart(2,'0')}:${time.minutes.toString().padStart(2,'0')} ${time.meridian}`;

    mainTimeDisplay.textContent = time.timeString;
    meridianCurrentTime.textContent = time.meridian;

    if (time.seconds == '00' && alarmChecked == false){                    // the alarmCkecked and currentSecond logic make sure that the alarm is checked only onced after the minuntes in the clock change!!
        alarmChecked = true;
        checkIfAlarmShouldBeHit(time);
    }
    else if (time.seconds != '00' && alarmChecked == true){
        alarmChecked = false;
    }
    requestAnimationFrame(updateTime);
}

function checkIfAlarmShouldBeHit(time){                            // checks every minute if alarm should be hit
    alarms.forEach(function(alarmObject){
        if(alarmObject.string == time.string && alarmHasHit == false){
            console.log(time.string, "time string", alarmObject.string, "alarm object");
            alarmHit(time.string);
            alarmHasHit = true;
        }
    });
}

function addEventListernerToAddAlarmButton() {     // adds alarm to the list of alarms
    addAlarmButton.addEventListener('click', function(){
        displayAddAlarmScreen();
    });
}

function displayAddAlarmScreen() {               // displays the dialog box to add new alarm
    addAlarmScreen.style.display = 'flex';
    setTimeout(function(){
        addAlarmScreen.style.opacity = '1';
    });
}

function updateAlarmListContainer() {
    alarmListContainer.innerHTML = '';
    for(let alarm of alarms){
        let newAlarmElementHTML = document.createElement("div");
        newAlarmElementHTML.className = 'alarm';

        let alarmStringDiv = document.createElement("div");
        alarmStringDiv.className = 'alarm-string';
        alarmStringDiv.textContent = `${alarm.string}`;

        let cancelAlarmButton = document.createElement("div");
        cancelAlarmButton.className = 'cancel-alarm';
        cancelAlarmButton.innerHTML = '<i class="fa-solid fa-xmark cancel-alarm-icon"></i>';
        cancelAlarmButton.addEventListener("click", function(){
            let timeStringOfTheAlarmToBeCancelled = this.parentNode.querySelector(".alarm-string").innerText;
            let indexAlarmObjectToBeRemovedFromTheAlarmListArray = alarms.findIndex(function(alarmElement, index){
                if(timeStringOfTheAlarmToBeCancelled == alarmElement.string){
                    if(index =! 0){
                        return index;
                    } else if(index == 0){
                        return 0;
                    }
                }
            });
            console.log("index deleted", indexAlarmObjectToBeRemovedFromTheAlarmListArray);
            alarms.splice(indexAlarmObjectToBeRemovedFromTheAlarmListArray, 1);
            console.log(alarms);
            updateAlarmListContainer();
        });
        newAlarmElementHTML.appendChild(alarmStringDiv);

        newAlarmElementHTML.appendChild(cancelAlarmButton);

        alarmListContainer.appendChild(newAlarmElementHTML);
    }
    if(alarmListContainer.innerText === ''){
        alarmListContainer.innerHTML = '<div id="no-alarms">No Alarms!</div>';
    }
}

function addNewAlarm(){                            // adds the alarm to the alarms list on main screen according to the inputs on 'add alarm scree' 
    noAlarmsElement.style.display = 'none';
    let newAlarm = {};

    let meridianInputUpperCase = meridianInput.value.trim().toUpperCase();          // check if the meridian input is valid
    let verifyMeridianInput = (()=>{
        if(meridianInputUpperCase === 'AM' || meridianInputUpperCase === 'PM'){
            return true;
        } else {
            return false;
        }
    })();
    if(hoursInput.value > 12 || minutesInput.value >59 || !verifyMeridianInput || isNaN(Number(hoursInput.value)) || isNaN(Number(minutesInput.value))) {    // checks if all the inupt fields are valid
        return false;
    } else {
        newAlarm.hours = hoursInput.value.padStart(2, '0');
        newAlarm.minutes = minutesInput.value.padStart(2, '0');
        newAlarm.meridian = meridianInput.value.toUpperCase();
        newAlarm.string = `${newAlarm.hours}:${newAlarm.minutes} ${newAlarm.meridian}`;
        
    //     let newAlarmElementHTML = `<div class="alarm">
    //     <div id="alarm-string">${newAlarm.string}</div>
    //     <div id="cancel-alarm">
    //         <i class="fa-solid fa-xmark" id="cancel-alarm-icon"></i>
    //     </div>
    // </div>`;

        // let newAlarmElementHTML = document.createElement("div");
        // newAlarmElementHTML.className = 'alarm';
        // let alarmStringDiv = document.createElement("div");
        // alarmStringDiv.textContent = `${newAlarm.string}`;
        // newAlarmElementHTML.appendChild(alarmStringDiv);
        // let cancelAlarmButton = document.createElement("div");
        // cancelAlarmButton.id = 'cancel-alarm';
        // cancelAlarmButton.innerHTML = '<i class="fa-solid fa-xmark" id="cancel-alarm-icon"></i>';
        // newAlarmElementHTML.appendChild(cancelAlarmButton);

        alarms.push(newAlarm);

        updateAlarmListContainer();

        hoursInput.value = '';
        minutesInput.value = '';
        meridianInput.value = 'AM';

        return true;
    }
}

function addEventListenersToAddAlarmScreen() {       // adds listeners to the 'close' and 'add' buttons on the 'add alarm screen'
    addButton.addEventListener('click', function(){
        
        let isAlarmAdded = addNewAlarm();
        if(isAlarmAdded){                             // if the entered inuputs are valid, the alarm will be added and the screen will be back to the main screen, else the input fields will be reset.
        addAlarmScreen.style.opacity = '0';
        setTimeout(function(){
            addAlarmScreen.style.display = 'none';
        }, 1000);
        console.log(alarms);
        } else {
            alert("Please enter the time in correct format. Eg: 10:00 AM");
            hoursInput.value = '';
            minutesInput.value = '';
            meridianInput.value = 'AM';
        }
    });
    closeButton.addEventListener('click', function(){
        addAlarmScreen.style.opacity = '0';
        setTimeout(function(){
            addAlarmScreen.style.display = 'none';
        }, 1000);
    });
}

function addEventListenerToStopAlarmButton() {
    alarmHitString.textContent = '';
    stopAlarmButton.addEventListener('click', function(){
        if(!alarmSound.paused){
            alarmSound.pause();
        }
        alarmHitScreen.style.opacity = '0';
        setTimeout(function(){
            alarmHitScreen.style.display = 'none';
        }, 1000);
        alarmHasHit = false;
    });
}


function main() {                                  // main function
    requestAnimationFrame(updateTime);
    addEventListernerToAddAlarmButton();
    addEventListenersToAddAlarmScreen();
    addEventListenerToStopAlarmButton();
}
main();