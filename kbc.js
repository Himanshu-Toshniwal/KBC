const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const prizeElement = document.getElementById('prize');
const fiftyFiftyButton = document.getElementById('fifty-fifty');
const audiencePollButton = document.getElementById('audience-poll');
const phoneFriendButton = document.getElementById('phone-friend');
// const frontPage = document.getElementById('front-page');
// const controls = document.querySelector('.controls');
const kbcTune = document.getElementById('kbc-tune');


let shuffledQuestions, currentQuestionIndex;
  let currentPrizeIndex = 0;
const prizeAmounts = [
    '₹5,000', '₹10,000', '₹20,000', '₹40,000', '₹80,000',
    '₹1,60,000', '₹3,20,000', '₹6,40,000', '₹12,50,000',
    '₹25,00,000', '₹50,00,000', '₹1,00,00,000', '₹3,00,00,000',
    '₹5,00,00,000', '₹7,00,00,000'
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
   currentPrizeIndex++;
    setNextQuestion();
});
fiftyFiftyButton.addEventListener('click', useFiftyFifty);
audiencePollButton.addEventListener('click', useAudiencePoll);
phoneFriendButton.addEventListener('click', usePhoneFriend);

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    // frontPage.classList.add('hide');
    //  controls.classList.remove('hide');
    currentQuestionIndex = 0;
    currentPrizeIndex = 0;
    questionContainerElement.classList.remove('hide');
    //document.querySelector('.controls').classList.remove('hide');
    setNextQuestion();
    kbcTune.play();

}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    prizeElement.innerText = `Prize: ${prizeAmounts[currentQuestionIndex]}`;
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        // button.disabled = true;
    });

    if (correct) {
        alert(`Correct Answer!\n you have won: ${prizeAmounts[currentPrizeIndex]}!`);
        if (currentQuestionIndex === prizeAmounts.length - 1 ) {
            alert(`Congratulations! You have won the jackpot of ₹7,00,00,000!`);
            startButton.innerText = 'Restart';
            startButton.classList.remove('hide');
        } else {
            nextButton.classList.remove('hide');
            // alert(Congratulations! you 've won the top prize of ${prizeAmounts[currentPrizeIndex]}!);
        }
    } else {
        const correctButton = Array.from(answerButtonsElement.children).find(button => button.dataset.correct === 'true');
        alert(`Wrong Answer!\nThe correct answer is : ${correctButton.innerText}\nYou won: ${prizeAmounts[currentQuestionIndex - 1]}`);
      //  alert(Game over! You won ${currentPrizeIndex > 0 ? prizeAmounts[currentPrizeIndex - 1] : '₹0'}. The correct answer was highlighted.);
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        questionContainerElement.classList.add('hide');
        // controls.classList.add('hide');
    }
}

function showCorrectAnswer(){
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add(correct);
        }
    });
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function useFiftyFifty() {
    const currentAnswers = Array.from(answerButtonsElement.children);
    const correctAnswer = currentAnswers.find(button => button.dataset.correct === 'true');
    let incorrectAnswers = currentAnswers.filter(button => button.dataset.correct !== 'true');

    incorrectAnswers = incorrectAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    incorrectAnswers.forEach(button => button.classList.add('hide'));

    fiftyFiftyButton.disabled = true;
}

function useAudiencePoll() {
    const currentAnswers = Array.from(answerButtonsElement.children);
    const pollResults = currentAnswers.map(button => {
        return {
            text: button.innerText,
            correct: button.dataset.correct === 'true',
            votes: 0
        };
    });

    const correctAnswer = pollResults.find(answer => answer.correct);
    const incorrectAnswers = pollResults.filter(answer => !answer.correct);

    // Give the correct answer a higher chance of having more votes
    correctAnswer.votes = Math.floor(Math.random() * 40) + 50; // 50-90% for the correct answer

    // Distribute the remaining votes to the incorrect answers
    let remainingVotes = 100 - correctAnswer.votes;
    incorrectAnswers.forEach(answer => {
        answer.votes = Math.floor(Math.random() * remainingVotes);
        remainingVotes -= answer.votes;
    });

    // Add the remaining votes to one of the incorrect answers
    if (incorrectAnswers.length > 0) {
        incorrectAnswers[0].votes += remainingVotes;
    }

    pollResults.sort((a, b) => b.votes - a.votes);

    alert(`Audience Poll Results:\n${pollResults.map(result => `${result.text}: ${result.votes}%`).join('\n')}`

    );
    audiencePollButton.disabled = true;
}

function usePhoneFriend() {
    const currentAnswers = Array.from(answerButtonsElement.children);
    const correctAnswer = currentAnswers.find(button => button.dataset.correct === 'true');

    alert(`Your friend suggests the answer is: ${correctAnswer.innerText}`);
    phoneFriendButton.disabled = true;
}

const questions = [
    {
        question: 'Who is the current Prime Minister of India?',
        answers: [
            { text: 'Narendra Modi', correct: true },
            { text: 'Rahul Gandhi', correct: false },
            { text: 'Amit Shah', correct: false },
            { text: 'Arvind Kejriwal', correct: false }
        ]
    },
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Lisbon', correct: false }
        ]
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answers: [
            { text: 'Earth', correct: false },
            { text: 'Mars', correct: true },
            { text: 'Jupiter', correct: false },
            { text: 'Saturn', correct: false }
        ]
    },
    {
        question: 'Who wrote "To Kill a Mockingbird"?',
        answers: [
            { text: 'Harper Lee', correct: true },
            { text: 'Mark Twain', correct: false },
            { text: 'Ernest Hemingway', correct: false },
            { text: 'F. Scott Fitzgerald', correct: false }
        ]
    },
    {
        question: 'What is the smallest prime number?',
        answers: [
            { text: '1', correct: false },
            { text: '2', correct: true },
            { text: '3', correct: false },
            { text: '5', correct: false }
        ]
    },
    {
        question: 'Which country is known as the Land of the Rising Sun?',
        answers: [
            { text: 'China', correct: false },
            { text: 'Japan', correct: true },
            { text: 'India', correct: false },
            { text: 'South Korea', correct: false }
        ]
    },
    {
        question: 'What is the chemical symbol for water?',
        answers: [
            { text: 'O2', correct: false },
            { text: 'H2O', correct: true },
            { text: 'CO2', correct: false },
            { text: 'H2', correct: false }
        ]
    },
    {
        question: 'Who developed the theory of relativity?',
        answers: [
            { text: 'Isaac Newton', correct: false },
            { text: 'Albert Einstein', correct: true },
            { text: 'Nikola Tesla', correct: false },
            { text: 'Galileo Galilei', correct: false }
        ]
    },
    {
        question: 'What is the largest mammal in the world?',
        answers: [
            { text: 'Elephant', correct: false },
            { text: 'Blue Whale', correct: true },
            { text: 'Giraffe', correct: false },
            { text: 'Rhino', correct: false }
        ]
    },
    {
        question: 'What is the hardest natural substance on Earth?',
        answers: [
            { text: 'Gold', correct: false },
            { text: 'Iron', correct: false },
            { text: 'Diamond', correct: true },
            { text: 'Platinum', correct: false }
        ]
    },
    {
        question: 'Who is known as the father of computers?',
        answers: [
            { text: 'Bill Gates', correct: false },
            { text: 'Charles Babbage', correct: true },
            { text: 'Alan Turing', correct: false },
            { text: 'Steve Jobs', correct: false }
        ]
    },
    {
        question: 'What is the capital of Australia?',
        answers: [
            { text: 'Sydney', correct: false },
            { text: 'Melbourne', correct: false },
            { text: 'Canberra', correct: true },
            { text: 'Brisbane', correct: false }
        ]
    },
    {
        question: 'What is the smallest unit of matter?',
        answers: [
            { text: 'Molecule', correct: false },
            { text: 'Atom', correct: true },
            { text: 'Electron', correct: false },
            { text: 'Neutron', correct: false }
        ]
    },
    {
        question: 'Who painted the Mona Lisa?',
        answers: [
            { text: 'Vincent van Gogh', correct: false },
            { text: 'Pablo Picasso', correct: false },
            { text: 'Leonardo da Vinci', correct: true },
            { text: 'Raphael' , correct: false }
            ]
    },
    {
        question: 'who won the t20 world cup in 2024',
        answers: [
            { text: 'South Africa', correct: false },
            { text: 'England', correct: false },
            { text: 'Afganistan', correct: false },
            { text: 'India', correct: true }
        ]
        }
    ]

//     const startButton = document.getElementById('start-btn');
// const nextButton = document.getElementById('next-btn');
// const questionContainerElement = document.getElementById('question-container');
// const questionElement = document.getElementById('question');
// const answerButtonsElement = document.getElementById('answer-buttons');
// const prizeElement = document.getElementById('prize');
// const fiftyFiftyButton = document.getElementById('fifty-fifty');
// const audiencePollButton = document.getElementById('audience-poll');
// const phoneFriendButton = document.getElementById('phone-friend');
//  const frontPage = document.getElementById('front-page');
// // const controls = document.querySelector('.controls');
// const kbcTune = document.getElementById('kbc-tune');


// let shuffledQuestions, currentQuestionIndex;
//   let currentPrizeIndex = 0;
// const prizeAmounts = [
//     '₹5,000', '₹10,000', '₹20,000', '₹40,000', '₹80,000',
//     '₹1,60,000', '₹3,20,000', '₹6,40,000', '₹12,50,000',
//     '₹25,00,000', '₹50,00,000', '₹1,00,00,000', '₹3,00,00,000',
//     '₹5,00,00,000', '₹7,00,00,000'
// ];

// startButton.addEventListener('click', startGame);
// nextButton.addEventListener('click', () => {
//     currentQuestionIndex++;
//    currentPrizeIndex++;
//     setNextQuestion();
// });
// fiftyFiftyButton.addEventListener('click', useFiftyFifty);
// audiencePollButton.addEventListener('click', useAudiencePoll);
// phoneFriendButton.addEventListener('click', usePhoneFriend);

// function startGame() {
//     startButton.classList.add('hide');
//     shuffledQuestions = questions.sort(() => Math.random() - 0.5);
//      frontPage.classList.add('hide');
//     //  controls.classList.remove('hide');
//     currentQuestionIndex = 0;
//     currentPrizeIndex = 0;
//     questionContainerElement.classList.remove('hide');
//     //document.querySelector('.controls').classList.remove('hide');
//     setNextQuestion();
//     kbcTune.play();

// }

// function setNextQuestion() {
//     resetState();
//     showQuestion(shuffledQuestions[currentQuestionIndex]);
//     prizeElement.innerText = `Prize: ${prizeAmounts[currentQuestionIndex]}`;
// }

// function showQuestion(question) {
//     questionElement.innerText = question.question;
//     question.answers.forEach(answer => {
//         const button = document.createElement('button');
//         button.innerText = answer.text;
//         button.classList.add('btn');
//         if (answer.correct) {
//             button.dataset.correct = answer.correct;
//         }
//         button.addEventListener('click', selectAnswer);
//         answerButtonsElement.appendChild(button);
//     });
// }

// function resetState() {
//     clearStatusClass(document.body);
//     nextButton.classList.add('hide');
//     while (answerButtonsElement.firstChild) {
//         answerButtonsElement.removeChild(answerButtonsElement.firstChild);
//     }
// }

// function selectAnswer(e) {
//     const selectedButton = e.target;
//     const correct = selectedButton.dataset.correct === 'true';
//     setStatusClass(document.body, correct);
//     Array.from(answerButtonsElement.children).forEach(button => {
//         setStatusClass(button, button.dataset.correct === 'true');
//         // button.disabled = true;
//     });

//     if (correct) {
//         alert(`Correct Answer!\n you have won: ${prizeAmounts[currentPrizeIndex]}!`);
//         if (currentQuestionIndex === prizeAmounts.length - 1 ) {
//             alert(`Congratulations! You have won the jackpot of ₹7,00,00,000!`);
//             startButton.innerText = 'Restart';
//             startButton.classList.remove('hide');
//         } else {
//             nextButton.classList.remove('hide');
//             // alert(`Congratulations! you 've won the top prize of ${prizeAmounts[currentPrizeIndex]}!`);
//         }
//     } else {
//         const correctButton = Array.from(answerButtonsElement.children).find(button => button.dataset.correct === 'true');
//         alert(`Wrong Answer!\nThe correct answer is : ${correctButton.innerText}\nYou won: ${prizeAmounts[currentQuestionIndex - 1]}`);
//       //  alert(`Game over! You won ${currentPrizeIndex > 0 ? prizeAmounts[currentPrizeIndex - 1] : '₹0'}. The correct answer was highlighted.`);
//         startButton.innerText = 'Restart';
//         startButton.classList.remove('hide');
//         questionContainerElement.classList.add('hide');
//         // controls.classList.add('hide');
//     }
// }

// function showCorrectAnswer(){
//     Array.from(answerButtonsElement.children).forEach(button => {
//         if (button.dataset.correct === 'true') {
//             button.classList.add(`correct`);
//         }
//     });
// }

// function setStatusClass(element, correct) {
//     clearStatusClass(element);
//     if (correct) {
//         element.classList.add('correct');
//     } else {
//         element.classList.add('wrong');
//     }
// }

// function clearStatusClass(element) {
//     element.classList.remove('correct');
//     element.classList.remove('wrong');
// }

// function useFiftyFifty() {
//     const currentAnswers = Array.from(answerButtonsElement.children);
//     const correctAnswer = currentAnswers.find(button => button.dataset.correct === 'true');
//     let incorrectAnswers = currentAnswers.filter(button => button.dataset.correct !== 'true');

//     incorrectAnswers = incorrectAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
//     incorrectAnswers.forEach(button => button.classList.add('hide'));

//     fiftyFiftyButton.disabled = true;
// }

// function useAudiencePoll() {
//     const currentAnswers = Array.from(answerButtonsElement.children);
//     const pollResults = currentAnswers.map(button => {
//         return {
//             text: button.innerText,
//             correct: button.dataset.correct === 'true',
//             votes: 0
//         };
//     });

//     const correctAnswer = pollResults.find(answer => answer.correct);
//     const incorrectAnswers = pollResults.filter(answer => !answer.correct);

//     // Give the correct answer a higher chance of having more votes
//     correctAnswer.votes = Math.floor(Math.random() * 40) + 50; // 50-90% for the correct answer

//     // Distribute the remaining votes to the incorrect answers
//     let remainingVotes = 100 - correctAnswer.votes;
//     incorrectAnswers.forEach(answer => {
//         answer.votes = Math.floor(Math.random() * remainingVotes);
//         remainingVotes -= answer.votes;
//     });

//     // Add the remaining votes to one of the incorrect answers
//     if (incorrectAnswers.length > 0) {
//         incorrectAnswers[0].votes += remainingVotes;
//     }

//     pollResults.sort((a, b) => b.votes - a.votes);

//     alert(`Audience Poll Results:\n${pollResults.map(result => `${result.text}: ${result.votes}%`).join('\n')}`);
//     audiencePollButton.disabled = true;
// }

// function usePhoneFriend() {
//     const currentAnswers = Array.from(answerButtonsElement.children);
//     const correctAnswer = currentAnswers.find(button => button.dataset.correct === 'true');

//     alert(`Your friend suggests the answer is: ${correctAnswer.innerText}`);
//     phoneFriendButton.disabled = true;
// }

// const questions = [
//     {
//         question: 'Who is the current Prime Minister of India?',
//         answers: [
//             { text: 'Narendra Modi', correct: true },
//             { text: 'Rahul Gandhi', correct: false },
//             { text: 'Amit Shah', correct: false },
//             { text: 'Arvind Kejriwal', correct: false }
//         ]
//     },
//     {
//         question: 'What is the capital of France?',
//         answers: [
//             { text: 'Berlin', correct: false },
//             { text: 'Madrid', correct: false },
//             { text: 'Paris', correct: true },
//             { text: 'Lisbon', correct: false }
//         ]
//     },
//     {
//         question: 'Which planet is known as the Red Planet?',
//         answers: [
//             { text: 'Earth', correct: false },
//             { text: 'Mars', correct: true },
//             { text: 'Jupiter', correct: false },
//             { text: 'Saturn', correct: false }
//         ]
//     },
//     {
//         question: 'Who wrote "To Kill a Mockingbird"?',
//         answers: [
//             { text: 'Harper Lee', correct: true },
//             { text: 'Mark Twain', correct: false },
//             { text: 'Ernest Hemingway', correct: false },
//             { text: 'F. Scott Fitzgerald', correct: false }
//         ]
//     },
//     {
//         question: 'What is the smallest prime number?',
//         answers: [
//             { text: '1', correct: false },
//             { text: '2', correct: true },
//             { text: '3', correct: false },
//             { text: '5', correct: false }
//         ]
//     },
//     {
//         question: 'Which country is known as the Land of the Rising Sun?',
//         answers: [
//             { text: 'China', correct: false },
//             { text: 'Japan', correct: true },
//             { text: 'India', correct: false },
//             { text: 'South Korea', correct: false }
//         ]
//     },
//     {
//         question: 'What is the chemical symbol for water?',
//         answers: [
//             { text: 'O2', correct: false },
//             { text: 'H2O', correct: true },
//             { text: 'CO2', correct: false },
//             { text: 'H2', correct: false }
//         ]
//     },
//     {
//         question: 'Who developed the theory of relativity?',
//         answers: [
//             { text: 'Isaac Newton', correct: false },
//             { text: 'Albert Einstein', correct: true },
//             { text: 'Nikola Tesla', correct: false },
//             { text: 'Galileo Galilei', correct: false }
//         ]
//     },
//     {
//         question: 'What is the largest mammal in the world?',
//         answers: [
//             { text: 'Elephant', correct: false },
//             { text: 'Blue Whale', correct: true },
//             { text: 'Giraffe', correct: false },
//             { text: 'Rhino', correct: false }
//         ]
//     },
//     {
//         question: 'What is the hardest natural substance on Earth?',
//         answers: [
//             { text: 'Gold', correct: false },
//             { text: 'Iron', correct: false },
//             { text: 'Diamond', correct: true },
//             { text: 'Platinum', correct: false }
//         ]
//     },
//     {
//         question: 'Who is known as the father of computers?',
//         answers: [
//             { text: 'Bill Gates', correct: false },
//             { text: 'Charles Babbage', correct: true },
//             { text: 'Alan Turing', correct: false },
//             { text: 'Steve Jobs', correct: false }
//         ]
//     },
//     {
//         question: 'What is the capital of Australia?',
//         answers: [
//             { text: 'Sydney', correct: false },
//             { text: 'Melbourne', correct: false },
//             { text: 'Canberra', correct: true },
//             { text: 'Brisbane', correct: false }
//         ]
//     },
//     {
//         question: 'What is the smallest unit of matter?',
//         answers: [
//             { text: 'Molecule', correct: false },
//             { text: 'Atom', correct: true },
//             { text: 'Electron', correct: false },
//             { text: 'Neutron', correct: false }
//         ]
//     },
//     {
//         question: 'Who painted the Mona Lisa?',
//         answers: [
//             { text: 'Vincent van Gogh', correct: false },
//             { text: 'Pablo Picasso', correct: false },
//             { text: 'Leonardo da Vinci', correct: true },
//             { text: 'Raphael' , correct: false }
//             ]
//     },
//     {
//         question: 'who won the t20 world cup in 2024',
//         answers: [
//             { text: 'South Africa', correct: false },
//             { text: 'England', correct: false },
//             { text: 'Afganistan', correct: false },
//             { text: 'India', correct: true }
//         ]
//         }
//     ]


