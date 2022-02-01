
  firebase.initializeApp({
    apiKey: "AIzaSyC9HYv9l0sYXwV4wMV5HkM1kyH_H_MoF50",
    authDomain: "ask-nurlykhan.firebaseapp.com",
    databaseURL: "https://ask-nurlykhan.firebaseio.com",
    projectId: "ask-nurlykhan",
    storageBucket: "ask-nurlykhan.appspot.com"
  })


  const questionsRef = firebase.database().ref('questions/')

  let questions = []

  let questionsWrap = document.querySelector('.questions')


// Object list questions
function allQuestions () {

	questions = []

	questionsRef.on('child_added', function(data) {
 		questions.push(data.val())
	})

}

allQuestions()

// Start UI
let btnSendQuestion = document.getElementById('btn-send-question')

let errorModal = document.querySelector('.error-modal')

function sendQuestion(event){

	event.preventDefault()

	let isAnonym = document.getElementById('anonym').checked

	let nameAskerElement = document.getElementById('name-asker')

	let nameAskerValue = document.getElementById('name-asker').value.trim()

	let nameAsker = isAnonym || nameAskerValue == '' ? 'Какой-то чел' : nameAskerValue
	
	let textQuestionElement = document.getElementById('text-question')

	let textQuestion = document.getElementById('text-question').value

	// Get Date

	let globalDate = new Date() 
	let monthIndex = globalDate.getMonth() 
	let month = ''
	let day = globalDate.getDate() < 10 ? `0${globalDate.getDate()}` : globalDate.getDate()
	let minute = globalDate.getMinutes() < 10 ? `0${globalDate.getMinutes()}` : globalDate.getMinutes()

	switch(monthIndex){
		case 0:
			month = 'Январь'
			break
		case 1:
			month = 'Февраль'
			break
		case 2:
			month = 'Март'
			break
		case 3:
			month = 'Апрель'
			break
		case 4:
			month = 'Май'
			break
		case 5:
			month = 'Июнь'
			break
		case 6:
			month = 'Июль'
			break
		case 7:
			month = 'Август'
			break
		case 8:
			month = 'Сентябрь'
			break
		case 9:
			month = 'Октябрь'
			break
		case 10:
			month = 'Ноябрь'
			break
		case 11:
			month = 'Декабрь'
			break
		default:
			month = 'Какой-то месяц'
	
	}

	let sendDate = `${day} ${month} ${globalDate.getFullYear()} ${globalDate.getHours()}:${minute}`

	// Validate for min 5 symbols
	if( textQuestion.length <= 4 ){
		errorModal.textContent = 'Жазсай дұрыстап 5 әріптен көп етіп'
		errorModal.classList.add('show')
		errorModal.style.background = '#f13942'

		setTimeout(() => errorModal.classList.remove('show'), 5000)
		return
	} 

	// Id
	let questionId

	function setId(){		
		questionId = questions.length + 1
		questionsRef.on('child_added', function(data) {
			if(data.val().id == questionId){
				questionId++
			} 
		});
	}

	setId()

	// Add to base
	async function toAsk(newId, yourQuestion, date, name){
			let question = {
				id: newId,
				question: yourQuestion,
				date: sendDate,
				answer: 'не отвечено',
				name: name
			}

			questionsRef.push(question)

	}


	// Show loader
	let loadLoader = document.querySelector('.load-loader')
	loadLoader.classList.add('show')
	
	setTimeout(() => loadLoader.classList.remove('show') , 4000)
	setTimeout(showQuestions, 3000)

	setTimeout(() => {
		errorModal.textContent = 'Нормально кетті походу'
		errorModal.classList.add('show')
		errorModal.style.background = '#23cf54'
		
		textQuestionElement.value = ''
		nameAskerElement.value = ''
	
	setTimeout(() => {
		errorModal.classList.remove('show')
	},2500)	

	}, 3000)

	toAsk(questionId, textQuestion, sendDate, nameAsker)
}

btnSendQuestion.addEventListener('click', sendQuestion)


// HIDE or SHOW name
let isAnonym = document.getElementById('anonym')
	isAnonym.addEventListener('click', () => {
		let nameAskerElement = document.getElementById('name-asker')
		nameAskerElement.parentElement.classList.toggle('hide')
})

//
//
//
// Show questions

function renderQuestions(){

	try {
		questionsWrap.innerHTML = ''
		questions.forEach((question) => {
			questionsWrap.innerHTML += `
				<div class="question-wrap" data-id="${question.id}">
					<div class="header-question">
						<p class="name">${question.name}</p>
						<p class="date">${question.date}</p>
					</div>
					<div class="body-question">
						<p class="question">Вопрос: ${question.question}</p>
					</div>
					<div class="body-answer">
						<p class="answer">${question.answer}</p>
						<input type="text" class="answer-input" value="${question.answer}">
						<button class="send-answer" data-id="${question.id}">Ответить</button>
					</div>
				</div>
			`
		})

		questions.reverse()
	} catch (error) {
		console.log('Вопросы закончились.')
	}

}


let loadLoader = document.querySelector('.load-loader')
let infoQuestions = document.querySelector('.info-questions')

function showQuestions(){

	questions.reverse()

	loadLoader.classList.add('show')

	if(questions.length == 0){
		infoQuestions.style.display = 'block'
		infoQuestions.textContent = 'Интернет слабый'
		console.log('1 if')
	} else {
		infoQuestions.style.display = 'none'
		renderQuestions()
	}

	setTimeout(() => {
		loadLoader.classList.remove('show')
	},500)

}

loadLoader.classList.add('show')

setTimeout(() => {
	loadLoader.classList.remove('show')
	showQuestions()
},5000)

// login admin
function showAdmin(){
	questionsWrap.classList.add('admin')

	let answerInputs = document.querySelectorAll('.answer-input')
	let answerBtns = document.querySelectorAll('.send-answer')

	answerBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			answerValue = btn.previousElementSibling.value
			answerID = btn.dataset.id

			toAnswer(answerID, answerValue) 
		})
	})

}

let loginInputs = [document.getElementById('name-asker'), document.getElementById('text-question')]
let login = null
let password = null

fetch('assets/data.json')
.then((data) => {
	return data.json()
})
.then((data) => {
	login = data.name
	password = data.password
})

loginInputs[1].addEventListener('change', (event) => {

	let loginValue = loginInputs[0].value
	
	if(loginValue === login && event.target.value == password){
		showAdmin()
	}

})


// Answer to question
function toAnswer(myId, myAnswer) {
	
	let a = questions.length
	
	questions.forEach((question) => {
		if(myId == question.id.toString()){
			question.answer = myAnswer
			publicAnswer ()
		}
	})

	questions.length = a
}

// Save answer to DATA
function publicAnswer () {
	questionsRef.set(null)

	questions.forEach((question) => {
		questionsRef.push(question)
	})
}

