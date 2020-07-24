const ventilationButton = document.querySelector('#ventilationButton');
const dialogAboutVentilation = document.querySelector('#dialogAboutVentilation');
const closeDialogAboutVentilation = document.querySelector('#closeDialogAboutVentilation');
const ventProgressBar = document.getElementById('progressBar')
const condDiscountBadge = document.getElementById('condDiscountBadge');
const forVentilationhbs = document.querySelector('#forVentilationhbs');
let counterOfVentilation = 0;
let allQustionOfVentilation = null;

let answerOfUser1 = {
  email: String,
  phone: String,
  answers: [{
    question: String,
    answers: Array,
  }],
};
let neededArr1 = [];

let ventPercentCounter = 8;

if (ventilationButton) {
  ventilationButton.addEventListener('click', async (e) => {
    ventilationButton.style.cssText = 'display: none;';
    dialogAboutVentilation.style.cssText = 'display: flex';
    dialogAboutVentilation.show(); // показываем диалоговое окно вентиляции
    const response = await fetch('/ventilation/question');
    const resp = await response.json();
    allQustionOfVentilation = resp;
    const hbsresponce = await fetch('/hbs/first.hbs');
    const HBShtml = await hbsresponce.text();
    const template = Handlebars.compile(HBShtml);
    const html = template({
      question: resp[counterOfVentilation].question,
      arrAnswers: resp[counterOfVentilation].arrAnswers,
    });
    counterOfVentilation += 1;
    forVentilationhbs.innerHTML = html;
  });
}
if (forVentilationhbs) {
  forVentilationhbs.addEventListener('click', async (e) => {
    if (e.target.id === 'submitToCondition') {
      e.preventDefault();
      let percent = (ventPercentCounter += 11)
      progressBar.style.cssText = `width: ${percent}%`
      progressBar.innerText = `${percent}%`
      if (counterOfVentilation > allQustionOfVentilation.length - 1) {
        const endResponce = await fetch('/hbs/endOfVentQuiz.hbs');
        const endHBShtml = await endResponce.text();
        const template = Handlebars.compile(endHBShtml);
        const html = template();
        // -----------------------------------запись ответов
        const question = document.getElementById('main').children[0];
        const ul = document.getElementById('answers').children;
        const arrOfAnwers = Array.from(ul).map((element) => element.firstElementChild);
        neededArr1 = [];
        for (let i = 0; i < arrOfAnwers.length; i += 1) {
          if (arrOfAnwers[i].checked) {
            neededArr1.push(arrOfAnwers[i].parentElement.innerText);
          }
        }
        answerOfUser1.answers.push({
          question: question.innerText,
          answers: neededArr1,
        });
        // -----------------------------------запись ответов
        answerOfUser1.answers.shift();
        counterOfVentilation = 0;
        forVentilationhbs.innerHTML = html;

        return;
      }
      if (counterOfVentilation <= allQustionOfVentilation.length - 1) {
        const hbsresponce = await fetch('/hbs/first.hbs');
        const HBShtml = await hbsresponce.text();
        const template = Handlebars.compile(HBShtml);
        const html = template({
          question: allQustionOfVentilation[counterOfVentilation].question,
          arrAnswers: allQustionOfVentilation[counterOfVentilation].arrAnswers,
        });
        // -----------------------------------запись ответов
        const question = document.getElementById('main').children[0];
        const ul = document.getElementById('answers').children;
        const arrOfAnwers = Array.from(ul).map((element) => element.firstElementChild);
        neededArr1 = [];
        for (let i = 0; i < arrOfAnwers.length; i += 1) {
          if (arrOfAnwers[i].checked) {
            neededArr1.push(arrOfAnwers[i].parentElement.innerText);
          }
        }
        answerOfUser1.answers.push({
          question: question.innerText,
          answers: neededArr1,
        });
        // -----------------------------------запись ответов
        counterOfVentilation += 1;
        forVentilationhbs.innerHTML = html;
      }
    }
    if (e.target.id == "lastBtnVent") {
      e.preventDefault();
      // answerOfUser.answers.forEach((el, i) => {
      //   if (el.answers.length === 0) el.answers[i].slice(i, 1)
      // })
      const userInfoForm = document.getElementById('userInfoVent');
      if (userInfoForm.children[2].value.length < 11) {
        alert("вы ввели неправильные данные\n Запишите телефон в указанном формате")
      }
      else {
        ventProgressBar.style.cssText = 'width: 100%';
        ventProgressBar.innerText = '100%';
        answerOfUser1.phone = userInfoForm.children[2].value;
        answerOfUser1.email = userInfoForm.children[5].value;
        const responce = await fetch('/ventilation/final', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: answerOfUser1.email,
            phone: answerOfUser1.phone,
            answers: answerOfUser1.answers,
          }),
        })
        const resp = await responce.json();
        const lastResponce = await fetch('/hbs/thx.hbs');
        const lastText = await lastResponce.text();
        const template = Handlebars.compile(lastText);
        const html = template();
        forVentilationhbs.innerHTML = html;
      }
    }
    if (e.target.id == "close") {
      e.preventDefault();
      dialogAboutVentilation.style.cssText = 'display: none;';
      ventilationButton.style.cssText = '';
      forVentilationhbs.innerHTML = '';
      ventPercentCounter = 8;
      ventProgressBar.style.cssText = `width: ${ventPercentCounter}`;
      ventProgressBar.innerText = '';
      allQustionOfVentilation = null;
      answerOfUser1 = {
        email: String,
        phone: String,
        answers: [{
          question: String,
          answers: Array,
        }],
      };
      counterOfVentilation = 0;
      dialogAboutVentilation.close();
    }
  });
}
if (closeDialogAboutVentilation) {
  closeDialogAboutVentilation.addEventListener('click', async (e) => {
    dialogAboutVentilation.style.cssText = 'display: none;';
    ventilationButton.style.cssText = '';
    forVentilationhbs.innerHTML = '';
    ventPercentCounter = 8
    ventProgressBar.style.cssText = `width: ${ventPercentCounter}`;
    ventProgressBar.innerText = '';
    allQustionOfVentilation = null;
    answerOfUser1 = {
      email: String,
      phone: String,
      answers: [{
        question: String,
        answers: Array,
      }],
    };
    counterOfVentilation = 0;
    dialogAboutVentilation.close(); // прячем диалоговое окно вентиляции
  });
}