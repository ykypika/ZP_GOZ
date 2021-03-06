'use strict';

const tableWrapper = document.querySelector(".tableWrapper"),
    btn1 = document.getElementById("btn1"),
    btn2 = document.getElementById("btn2"),
    btn3 = document.getElementById("btn3"),
    btn4 = document.getElementById("btn4"),
    btn5 = document.getElementById("btn5"),
    night = document.querySelectorAll(".night"),
    days = document.querySelectorAll(".days"),
    dayhours = document.querySelectorAll(".dayhours"),
    nights = document.querySelectorAll(".nights"),
    nighthours = document.querySelectorAll(".nighthours"),
    nighthd =  document.querySelector(".nighthd"),
    nighthourshd = document.querySelector(".nighthourshd"),
    mhg = document.getElementById("mhg"),
    nhg =document.getElementById("nhg"),
    mh = document.getElementById("mh"),
    nh =document.getElementById("nh"),
    browserMessage =  document.querySelector(".browser_message"),
    modalDownload = document.getElementById("modal_download"),
    
    showElement = (element) => {
        element.classList.remove("hide");

        switch(window.getComputedStyle(element).display) {
            case "block": element.classList.add("show");
                break;
            case "flex": element.classList.add("showFlex");
                break;
            case "table-row": element.classList.add("showRow");
                break;
        }
    },

    hideElement = (element) => {
        element.classList.remove("show");
        element.classList.remove("showRow");
        element.classList.remove("showFlex");
        element.classList.add("hide");
    };
let someChanged = false,
    numOfClick = 0,
    timerDownload;

    function setDate() {
        let date = new Date().toLocaleDateString(),
            shortTime = new Date().toLocaleTimeString([], {
                timeStyle: 'short'
            });
        shortTime = shortTime.slice(0, 2) + "-" + shortTime.slice(3);
        date = date + "T" + shortTime;
        return date;
    }
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        showElement(modal);
        document.body.style.overflow = "hidden";
    }
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        hideElement(modal);
        document.body.style.overflow = "";
    }
    function showBrowserMessage(messageText) {
        browserMessage.style.bottom = 40 - document.documentElement.scrollTop + "px";
        browserMessage.innerText = messageText;
        addAnim(browserMessage, "anim1");
        const first = () => { showElement(browserMessage);};
        const second = () => { setTimeout( function(){ hideElement(browserMessage);}, 1000 );};
          first();
          second();
    }
    function showMessageInModal(modalId, message) {
        const modal = document.getElementById(modalId);
        const modalMessage = modal.querySelector(".modal_message");
        hideElement(modal.querySelector(".modal__title"));
        hideElement(modal.querySelector(".modal_data"));
        showElement(modalMessage);
        modalMessage.innerHTML = message;
    }
    function resetModal(modalId) {
        const modal = document.getElementById(modalId);
        const modalMessage = modal.querySelector(".modal_message");
        hideElement(modalMessage);
        showElement(modal.querySelector(".modal__title"));
        showElement(modal.querySelector(".modal_data"));

    }

    const trySave = (size, layout, fonts, svg, x, y, width, height, name) => {
        const message = {
            loading: "???????????????? ?????????? ????????????????....<img src='./img/spinner.svg' alt='spinner'><br> ?????????????? ??? ",
            fail: "??????-???? ?????????? ???? ??????. <br> ???????????????????? ??????????",
            success: "???????????????? ????????????????",
        }
        let i = 0;
        function attempt() {
            try {
                savePdf(size, layout, fonts, svg, x, y, width, height, name);

                showMessageInModal("modal_download", message.success);
                setTimeout(() => {
                    closeModal("modal_download");
                    resetModal("modal_download");
                    clearTimeout(timerDownload);
            }, 3000);
            } catch {
                i++;
                if (i <= 5) {
                    showMessageInModal("modal_download", message.loading + i);
                    timerDownload = setTimeout(attempt, 5000);
                } else {
                    showMessageInModal("modal_download", message.fail);
                    setTimeout(() => {
                        closeModal("modal_download");
                        resetModal("modal_download");
                        clearTimeout(timerDownload);
                }, 3000);
                }
            }
        }
    attempt();
        };
btn1.addEventListener("click", () => {  //Generate
    if (someChanged) {
        calc();
        createTable();
        showElement(zpList);
        numOfClick = 0;
    }
    addAnim(zpList, "anim");
    someChanged = false;
    numOfClick++;
    if (numOfClick > 20) {
        alert("???? ????, ??????????????? o_0");
        btn1.disabled = true;
    }
    btn2.disabled = false;
});
btn2.addEventListener("click", () => { //download
openModal("modal_download");
});
btn3.addEventListener("click", () => { //Share
    writeHistory();
    if (navigator.share) {
        navigator.share({
            title: 'RCalc',
            text: '?????? ???????????? ???????????????????? ??????????',
            url: link
          });
    } else {
        navigator.clipboard.writeText(link);
        showBrowserMessage("???????????? ??????????????????????");
    }
});
modalDownload.addEventListener("click", (e) => { //modal events
    if(e.target && e.target.matches(".modal__close, .modal")) {
        closeModal("modal_download");
        resetModal("modal_download");
        clearTimeout(timerDownload);
    }
    if (e.target && e.target.matches("#btn4")) {
        const date = setDate();
        trySave("A4", "landskape", "fonts", zpList, 0, 0, 419.53, 595.28, `?????????????????? ???????? ${date}.pdf`);
    }
    if (e.target && e.target.matches("#btn5")) {
        const date = setDate();
        trySave([150.23, 164.41], "portrait", "", qRCode, 0, 5, 150.228 , 150.228, `Qrcode ${date}.pdf`);
    }
});

const addAnim = (element, anim) => { //???????????????? ??????????????????
    setTimeout(() => {
        element.classList.add(anim);
    });
    element.classList.remove(anim);
};
const toZero = (e, value1, fixed) => { // ?? value1 ?????? blur, fixed(2) ?????????????????? ????????????????
    if (!e.target.value) {
        e.target.value = value1;
    } else if (fixed) {
        e.target.value = (+e.target.value).toFixed(2);
    }
    someChanged = true;
};
const delVaule = (e) => { // ???????????????? ???????????????? ?????? focus
    e.target.value = "";
};
const enter = (e) => { // blur ?????? ?????????????? ???? Enter
    if (e.key == "Enter") {
        e.target.blur();
    }
};
const btnStatus = () => { //???????????????????? ???????????? ?????? ???????????????????? ???????????? ?????? ?????????????? ????????
    if (md.value > 0 || nd.value > 0) {
        btn1.disabled = false;
    } else {
        btn1.disabled = true;
    }
};
const mdgVal = () => {
    mdg.value = Math.ceil(md.value);
};
const ndgVal = () => {
    ndg.value = Math.ceil(nd.value);
};
const mhgVal = () =>{
     mhg.value = mh.value;
};
const nhgVal = () =>{
    nhg.value = nh.value;
};
function convertHours(convertItem, writePlace, element, hoursInDay) {
    // convertItem ?????? ????????????????????????
    // writePlace ???????? ??????????
    // element ?????????????? ??????????????
    // hoursInDay ???????????????????? ?????????? ?? ?????? ?????? ??????????????????????
    convertItem.forEach((hours, i) => {
        if (hours == element) {
            writePlace[i].value = roundHours(hours.value / hoursInDay);
        }
        });
}
function convertDays(convertItem, writePlace, element, hoursInDay) {
    // convertItem ?????? ????????????????????????
    // writePlace ???????? ??????????
    // element ?????????????? ??????????????
    // hoursInDay ???????????????????? ?????????? ?? ?????? ?????? ??????????????????????
    convertItem.forEach((day, i) => {
        if (day == element) {
            writePlace[i].value = round(day.value * hoursInDay);
        }
        });

}
function roundHours(value) {
    value = (Math.round(value * 10000000000)) / 10000000000;
    return value;
}
function sch14() {
    night.forEach(row => {
        hideElement(row);});
    hideElement(night[0].nextElementSibling);
    hideElement(night[1].nextElementSibling);
    nd.value = 0;
    ndg.value = 0;
    nighthours[0].value = 0;
    nighthours[1].value = 0;
}
function sch16() {
    night.forEach(row => {
        showElement(row);
    });
}
tableWrapper.addEventListener("focusin", (e) => {
    if (e.target && e.target.matches("input.delvalue[type='number']")) {
        delVaule(e);
    }
    if (e.target && e.target.matches("input.dayhours[type='number']")) {
        if(+e.target.value == 0){
            delVaule(e);
        }}
    if (e.target && e.target.matches("input.nighthours[type='number']")) {
        if(+e.target.value == 0){
            delVaule(e);
    }}
    // if (e.target && e.target.matches("input#mh[type='number']")) {
    //     mhgVal();
    // }
    // if (e.target && e.target.matches("input#nh[type='number']")) {
    //     nhgVal();
    // }
});
tableWrapper.addEventListener("keyup", (e) => {
    if (e.target && e.target.matches("input[type='number']")) {
        btnStatus();
        enter(e);
    }
    if (e.target && e.target.matches("input#md[type='number']" )) {
        btnStatus();
        mdgVal();
        convertDays(days, dayhours, e.target, 11.7);
        mhgVal();
    }
    if (e.target && e.target.matches("input#nd[type='number']")) {
        btnStatus();
        ndgVal();
        convertDays(nights, nighthours, e.target, 11);
        nhgVal();
    }
    if (e.target && e.target.matches("input#mh[type='number']" )) {
        convertHours(dayhours, days, e.target, 11.7);
        btnStatus();
        mdgVal();
        mhgVal();
    }
    if (e.target && e.target.matches("input#nh[type='number']" )) {
        convertHours(nighthours, nights, e.target, 11);
        btnStatus();
        ndgVal();
        nhgVal();
    }
});
tableWrapper.addEventListener("focusout", (e) => {

    if (e.target && e.target.matches("input.zero[type='number']")) {
        toZero(e, 0);
    }
    if (e.target && e.target.matches("input#rate[type='number']")) {
        toZero(e, (280).toFixed(2), true);
    }
    if (e.target && e.target.matches("input#cul[type='number']")) {
        toZero(e, 0);
    }
    if (e.target && e.target.matches("input#coe[type='number']")) {
        if (ms.checked) {
            toZero(e, 2);
        } else {
            toZero(e, 1.2);
        }
    }
    if (e.target && e.target.matches("input#prp[type='number']")) {
        toZero(e, (27840).toFixed(2), true);
    }
    if (e.target && e.target.matches("input#md[type='number']")) {
        btnStatus();
        mdgVal();
        const mhgTimer = setTimeout(mhgVal, 100);
    }
    if (e.target && e.target.matches("input#nd[type='number']")) {
        btnStatus();
        ndgVal();
        const nhgTimer = setTimeout(nhgVal, 100);
    }
    if (e.target && e.target.matches("input#mh[type='number']")) {
        btnStatus();
        const mdgTimer = setTimeout(mdgVal, 100),
        mhgTimer = setTimeout(mhgVal, 100);
    }
    if (e.target && e.target.matches("input#nh[type='number']")) {
        btnStatus();
        const ndgTimer = setTimeout(ndgVal, 100),
        nhgTimer = setTimeout(nhgVal, 100);
    }
    if (e.target && e.target.matches("input#mdg[type='number']")) {
        toZero(e, Math.round(md.value));
        if (+mdg.value < +md.value) {
            mdg.value = Math.ceil(+md.value);
        }
    }
    if (e.target && e.target.matches("input#ndg[type='number']")) {
        toZero(e, Math.round(nd.value));
        if (+ndg.value < +nd.value) {
            ndg.value = Math.ceil(+nd.value);
        }
    }
    if (e.target && e.target.matches("input#mhg[type='number']")) {
        if(mhg.value < mh.value) {
            mhg.value = mh.value;
        }
    }
    if (e.target && e.target.matches("input#nhg[type='number']")) {
        if(nhg.value < nh.value) {
            nhg.value = nh.value;
        }
    }
    if (e.target && e.target.matches("input.days[type='number']")) {
        convertDays(days, dayhours, e.target, 11.7);
    }
    if (e.target && e.target.matches("input.nights[type='number']")) {
        convertDays(nights, nighthours, e.target, 11);
    }
    // if (e.target && e.target.matches("input.nighthd[type='number']")) {
    //     nighthourshd.value = round(nighthd.value * 7);
    // }
    if (e.target && e.target.matches("input.dayhours[type='number']")) {
        convertHours(dayhours, days, e.target, 11.7);
        btnStatus();
    }
    if (e.target && e.target.matches("input.nighthours[type='number']")) {
        convertHours(nighthours, nights, e.target, 11);
        btnStatus();
    }
    // if (e.target && e.target.matches("input.nighthourshd[type='number']")) {
    //     nighthd.value = nighthourshd.value / 7;
    // }
});
tableWrapper.addEventListener("change", (e) => {
    if (e.target && e.target.matches("input[name='sch']")) {
        if (e.target.value == 14) {
            sch14();
            btnStatus();
        }
        if (e.target.value == 16) {
            sch16();
        }
        }

    if (e.target && e.target.matches("input[type='checkbox']")) {
        if (ms.checked) {
            coe.value = 2;
        } else {
            coe.value = 1.2;
        }}
    if(e.target && e.target.matches("select,input[type='checkbox']")) {
        someChanged = true;
    }
});
tableWrapper.addEventListener("keydown", (event) => { //???????????? ?????????? ???? ????????
    if (event.target && event.target.matches("input[type='number']")) {
            return !(/^[??-????-??A-Za-z ]$/.test(event.key));
        
    }
});
tableWrapper.addEventListener("click", (e) => {
    const nextInput = e.target.nextElementSibling,
    previousInput = e.target.previousElementSibling;

    if(e.target && e.target.matches('.input-number__minus')){
        if(nextInput.value > 0){
            nextInput.value = +nextInput.value - 1;
            someChanged = true;}
    }
    if(e.target && e.target.matches('.input-number__plus')){
        previousInput.value = +previousInput.value + 1;
        someChanged = true;
    }
    if(e.target && e.target.matches('.input-number__plus') || e.target.matches('.input-number__minus')){

if(nextInput && nextInput.classList.contains("dayhours") || previousInput && previousInput.classList.contains("dayhours")) {
convertHours(dayhours, days, nextInput, 11.7);
convertHours(dayhours, days, previousInput, 11.7);
    }

if (nextInput && nextInput.classList.contains("nighthours") || previousInput && previousInput.classList.contains("nighthours")) {
    convertHours(nighthours, nights, nextInput, 11);
    convertHours(nighthours, nights, previousInput, 11);
    }
    // if (nextInput && nextInput.classList.contains("nighthourshd") || previousInput && previousInput.classList.contains("nighthourshd")) {
    //     nighthd.value = nighthourshd.value / 7;
    // }

    if (nextInput && nextInput.matches("#mh") || previousInput && previousInput.matches("#mh")) {
        btnStatus();
        mdgVal();
        mhg.value = roundHours(+mdg.value * 11.7);
    }
    if (nextInput && nextInput.matches("#nh") || previousInput && previousInput.matches("#nh")) {
        btnStatus();
        ndgVal();
        nhg.value = roundHours(+ndg.value * 11);
    }
    if (nextInput && nextInput.matches("#mhg") || previousInput && previousInput.matches("#mhg")) {
        if(+mhg.value <= +mh.value){
            mhg.value = mh.value;
            mdg.value = md.value;
        }
    }
    if (nextInput && nextInput.matches("#nhg") || previousInput && previousInput.matches("#nhg")) {
        if(+nhg.value <= +nh.value){
            nhg.value = nh.value;
            ndg.value = nd.value;
        }
    }

}
    if(e.target && e.target.matches(".altDays")) {
        hideElement(e.target.parentElement.parentElement.parentElement);
        showElement(e.target.parentElement.parentElement.parentElement.nextElementSibling);
    }
    if(e.target && e.target.matches(".altHours")) {
        hideElement(e.target.parentElement.parentElement.parentElement);
        showElement(e.target.parentElement.parentElement.parentElement.previousElementSibling);
    }
});