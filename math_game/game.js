// Состояние игры
const gameState = {
    level: 0, // 0 - начальный, 1 - средний, 2 - продвинутый
    levelNames: ['Начальный', 'Средний', 'Продвинутый'],
    currentQuestion: 0,
    totalQuestions: 10,
    correctAnswers: 0,
    incorrectAnswers: 0,
    usedQuestions: new Set(), // Для отслеживания использованных вопросов
    isGameActive: true,
    isGameComplete: false
};

// Генерация случайного числа в диапазоне
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация уникального вопроса
function generateQuestion() {
    let question;
    let answer;
    let questionKey;

    do {
        if (gameState.level === 0) {
            // Начальный уровень: только арифметические операции
            const operations = ['+', '-', '*', '/'];
            const op = operations[randomInt(0, operations.length - 1)];
            let a, b;

            if (op === '/') {
                // Для деления генерируем так, чтобы результат был целым
                b = randomInt(2, 12);
                const result = randomInt(2, 10);
                a = b * result;
            } else if (op === '-') {
                // Для вычитания избегаем отрицательных результатов
                a = randomInt(10, 100);
                b = randomInt(1, a);
            } else {
                a = randomInt(1, 50);
                b = randomInt(1, 50);
            }

            question = `${a} ${op} ${b}`;
            questionKey = question;

            // Вычисляем ответ
            switch (op) {
                case '+':
                    answer = a + b;
                    break;
                case '-':
                    answer = a - b;
                    break;
                case '*':
                    answer = a * b;
                    break;
                case '/':
                    answer = a / b;
                    break;
            }
        } else if (gameState.level === 1) {
            // Средний уровень: арифметические операции + операторы сравнения
            const useComparison = Math.random() < 0.5;
            
            if (useComparison) {
                const comparisons = ['<', '>', '<=', '>=', '==', '!='];
                const op = comparisons[randomInt(0, comparisons.length - 1)];
                const a = randomInt(1, 50);
                const b = randomInt(1, 50);
                
                question = `${a} ${op} ${b}`;
                questionKey = question;
                
                // Вычисляем результат сравнения (true/false)
                switch (op) {
                    case '<':
                        answer = a < b;
                        break;
                    case '>':
                        answer = a > b;
                        break;
                    case '<=':
                        answer = a <= b;
                        break;
                    case '>=':
                        answer = a >= b;
                        break;
                    case '==':
                        answer = a === b;
                        break;
                    case '!=':
                        answer = a !== b;
                        break;
                }
            } else {
                // Арифметическая операция
                const operations = ['+', '-', '*', '/'];
                const op = operations[randomInt(0, operations.length - 1)];
                let a, b;

                if (op === '/') {
                    b = randomInt(2, 12);
                    const result = randomInt(2, 10);
                    a = b * result;
                } else if (op === '-') {
                    a = randomInt(10, 100);
                    b = randomInt(1, a);
                } else {
                    a = randomInt(1, 50);
                    b = randomInt(1, 50);
                }

                question = `${a} ${op} ${b}`;
                questionKey = question;

                switch (op) {
                    case '+':
                        answer = a + b;
                        break;
                    case '-':
                        answer = a - b;
                        break;
                    case '*':
                        answer = a * b;
                        break;
                    case '/':
                        answer = a / b;
                        break;
                }
            }
        } else {
            // Продвинутый уровень: логические операторы и двоичные числа
            const useBinary = Math.random() < 0.5;
            
            if (useBinary) {
                // Операции с двоичными числами
                const operations = ['+', '-', '*'];
                const op = operations[randomInt(0, operations.length - 1)];
                const a = randomInt(1, 15);
                const b = randomInt(1, 15);
                
                const aBinary = a.toString(2);
                const bBinary = b.toString(2);
                
                question = `${aBinary} (bin) ${op} ${bBinary} (bin)`;
                questionKey = question;
                
                let result;
                switch (op) {
                    case '+':
                        result = a + b;
                        break;
                    case '-':
                        result = Math.max(0, a - b);
                        break;
                    case '*':
                        result = a * b;
                        break;
                }
                answer = result.toString(2);
            } else {
                // Логические операции
                const operations = ['&&', '||'];
                const op = operations[randomInt(0, operations.length - 1)];
                const a = Math.random() < 0.5;
                const b = Math.random() < 0.5;
                
                const aStr = a ? 'true' : 'false';
                const bStr = b ? 'true' : 'false';
                
                question = `${aStr} ${op} ${bStr}`;
                questionKey = question;
                
                switch (op) {
                    case '&&':
                        answer = a && b;
                        break;
                    case '||':
                        answer = a || b;
                        break;
                }
            }
        }
    } while (gameState.usedQuestions.has(questionKey));

    gameState.usedQuestions.add(questionKey);
    return { question, answer };
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('level-display').textContent = gameState.levelNames[gameState.level];
    document.getElementById('question-number').textContent = gameState.currentQuestion + 1;
    document.getElementById('correct-count').textContent = gameState.correctAnswers;
    document.getElementById('incorrect-count').textContent = gameState.incorrectAnswers;
}

// Показ вопроса
function showQuestion() {
    if (!gameState.isGameActive || gameState.isGameComplete) {
        return;
    }

    const { question, answer } = generateQuestion();
    gameState.currentQuestionData = { question, answer };
    
    document.getElementById('question').textContent = question;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('submit-btn').disabled = false;
}

// Проверка ответа
function checkAnswer(userAnswer) {
    const { answer } = gameState.currentQuestionData;
    let isCorrect = false;

    // Нормализация ответа
    userAnswer = userAnswer.trim().toLowerCase();
    
    if (typeof answer === 'boolean') {
        // Для булевых значений
        const userBool = userAnswer === 'true' || userAnswer === 'истина' || userAnswer === 'да';
        isCorrect = userBool === answer;
    } else if (typeof answer === 'number') {
        // Для чисел
        const userNum = parseFloat(userAnswer);
        isCorrect = !isNaN(userNum) && Math.abs(userNum - answer) < 0.0001;
    } else if (typeof answer === 'string') {
        // Для строк (двоичные числа)
        isCorrect = userAnswer === answer.toLowerCase();
    }

    return isCorrect;
}

// Обработка ответа
function handleAnswer() {
    if (!gameState.isGameActive || gameState.isGameComplete) {
        return;
    }

    const userAnswer = document.getElementById('answer-input').value;
    const isCorrect = checkAnswer(userAnswer);

    if (isCorrect) {
        gameState.correctAnswers++;
        document.getElementById('feedback').textContent = 'Правильно!';
        document.getElementById('feedback').className = 'feedback correct';
    } else {
        gameState.incorrectAnswers++;
        document.getElementById('feedback').textContent = `Неправильно! Правильный ответ: ${gameState.currentQuestionData.answer}`;
        document.getElementById('feedback').className = 'feedback incorrect';
    }

    document.getElementById('submit-btn').disabled = true;
    updateUI();

    gameState.currentQuestion++;

    // Проверка завершения раунда из 10 вопросов
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        setTimeout(() => {
            checkLevelProgress();
        }, 2000);
    } else {
        setTimeout(() => {
            showQuestion();
        }, 2000);
    }
}

// Проверка прогресса уровня
function checkLevelProgress() {
    const successRate = gameState.correctAnswers / gameState.totalQuestions;
    const requiredRate = 0.8; // 80%

    if (successRate >= requiredRate) {
        if (gameState.level < 2) {
            // Переход на следующий уровень
            gameState.level++;
            gameState.currentQuestion = 0;
            gameState.correctAnswers = 0;
            gameState.incorrectAnswers = 0;
            gameState.usedQuestions.clear();
            
            document.getElementById('feedback').textContent = `Отлично! Вы переходите на уровень: ${gameState.levelNames[gameState.level]}`;
            document.getElementById('feedback').className = 'feedback correct';
            
            setTimeout(() => {
                showQuestion();
            }, 3000);
        } else {
            // Игра завершена
            completeGame();
        }
    } else {
        // Не прошли уровень
        endGame(false);
    }
}

// Завершение игры (успешное)
function completeGame() {
    gameState.isGameComplete = true;
    gameState.isGameActive = false;
    
    const totalCorrect = gameState.correctAnswers;
    const totalIncorrect = gameState.incorrectAnswers;
    const totalQuestions = gameState.currentQuestion;
    
    document.getElementById('congratulations').style.display = 'block';
    document.getElementById('congratulations-text').innerHTML = `
        Поздравляем! Вы успешно прошли все уровни!<br><br>
        <strong>Итоговая статистика:</strong><br>
        Правильных ответов: ${totalCorrect}<br>
        Неправильных ответов: ${totalIncorrect}<br>
        Всего вопросов: ${totalQuestions}
    `;
    
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';
    document.getElementById('exit-btn').style.display = 'inline-block';
}

// Завершение игры (неуспешное)
function endGame(success) {
    gameState.isGameActive = false;
    
    if (!success) {
        const successRate = (gameState.correctAnswers / gameState.totalQuestions * 100).toFixed(0);
        document.getElementById('feedback').textContent = `Игра окончена. Вы набрали ${successRate}% правильных ответов. Для перехода на следующий уровень нужно минимум 80%.`;
        document.getElementById('feedback').className = 'feedback incorrect';
    }
    
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('restart-btn').style.display = 'inline-block';
    document.getElementById('exit-btn').style.display = 'inline-block';
}

// Перезапуск игры
function restartGame() {
    gameState.level = 0;
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    gameState.usedQuestions.clear();
    gameState.isGameActive = true;
    gameState.isGameComplete = false;
    
    document.getElementById('congratulations').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    document.getElementById('input-section').style.display = 'flex';
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('exit-btn').style.display = 'none';
    
    updateUI();
    showQuestion();
}

// Выход из игры
function exitGame() {
    if (confirm('Вы уверены, что хотите выйти из игры?')) {
        window.close();
    }
}

// Инициализация игры
function initGame() {
    updateUI();
    showQuestion();
    
    // Обработчики событий
    document.getElementById('submit-btn').addEventListener('click', handleAnswer);
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !document.getElementById('submit-btn').disabled) {
            handleAnswer();
        }
    });
    
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('exit-btn').addEventListener('click', exitGame);
}

// Запуск игры при загрузке страницы
window.addEventListener('DOMContentLoaded', initGame);

