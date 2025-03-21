document.addEventListener('DOMContentLoaded', function() {
    // DOM-элементы для страницы коллекций
    const mainContent = document.getElementById('main-content');
    const loadingContainer = document.getElementById('loading-container');
    const collectionsContainer = document.getElementById('collections-container');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    
    // DOM-элементы для страницы упражнений
    const exerciseContainer = document.getElementById('exercise-container');
    const collectionTitle = document.getElementById('collection-title');
    const collectionDescription = document.getElementById('collection-description');
    const collectionLevel = document.getElementById('collection-level');
    const collectionLanguage = document.getElementById('collection-language');
    const exerciseCounter = document.getElementById('exercise-counter');
    const exerciseText = document.getElementById('exercise-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const backToCollectionsBtn = document.getElementById('back-to-collections');

    // Данные приложения
    let exercisesData = null;
    let currentCollection = null;
    let currentExerciseIndex = 0;
    let answersChecked = false;

    // Инициализация приложения
    initApp();

    function initApp() {
        // Загрузка данных упражнений
        loadExercisesData()
            .then(data => {
                exercisesData = data;
                renderCollections();
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                loadingContainer.style.display = 'none';
                errorContainer.style.display = 'block';
                errorMessage.textContent = 'Не удалось загрузить коллекции упражнений.';
            });

        // Привязка обработчиков событий
        checkBtn.addEventListener('click', checkAnswers);
        nextBtn.addEventListener('click', nextExercise);
        backToCollectionsBtn.addEventListener('click', showCollections);
    }

    // Загрузка данных упражнений из JSON-файла
    async function loadExercisesData() {
        const response = await fetch('static/data/exercises.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные упражнений');
        }
        return await response.json();
    }

    // Отрисовка списка коллекций упражнений
    function renderCollections() {
        // Скрываем загрузчик
        loadingContainer.style.display = 'none';
        
        if (exercisesData && Object.keys(exercisesData).length > 0) {
            // Отображаем коллекции
            collectionsContainer.style.display = 'flex';
            collectionsContainer.innerHTML = '';
            
            Object.entries(exercisesData).forEach(([collectionId, collection]) => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4';
                
                // Определяем цвет карточки в зависимости от уровня сложности
                let levelBadgeClass = 'bg-success';
                if (collection.level === 'Средний') {
                    levelBadgeClass = 'bg-warning text-dark';
                } else if (collection.level === 'Продвинутый') {
                    levelBadgeClass = 'bg-danger';
                }
                
                card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${collection.title}</h5>
                            <span class="badge ${levelBadgeClass}">${collection.level}</span>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${collection.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge bg-secondary me-2">${collection.language}</span>
                                    <span class="badge bg-info">${collection.exercises.length} упражнений</span>
                                </div>
                                <button class="btn btn-primary start-collection" data-collection-id="${collectionId}">
                                    <i class="fas fa-play-circle me-2"></i> Начать
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                collectionsContainer.appendChild(card);
            });

            // Добавляем обработчики кнопок для каждой коллекции
            document.querySelectorAll('.start-collection').forEach(button => {
                button.addEventListener('click', function() {
                    const collectionId = this.getAttribute('data-collection-id');
                    loadCollection(collectionId);
                });
            });
        } else {
            // Отображаем сообщение, если коллекций нет
            errorContainer.style.display = 'block';
            errorMessage.textContent = 'Коллекции упражнений не найдены.';
        }
    }

    // Загрузка выбранной коллекции и начало упражнений
    function loadCollection(collectionId) {
        currentCollection = exercisesData[collectionId];
        currentExerciseIndex = 0;
        
        if (currentCollection && currentCollection.exercises && currentCollection.exercises.length > 0) {
            // Отображаем метаданные коллекции
            collectionTitle.textContent = currentCollection.title;
            collectionDescription.textContent = currentCollection.description;
            collectionLevel.textContent = currentCollection.level;
            collectionLanguage.textContent = currentCollection.language;
            
            // Показываем первое упражнение
            showExerciseContainer();
            displayExercise(0);
        } else {
            // Показываем ошибку, если коллекция пуста или не найдена
            errorContainer.style.display = 'block';
            errorMessage.textContent = 'Упражнения в данной коллекции не найдены.';
        }
    }

    // Отображение выбранного упражнения
    function displayExercise(index) {
        if (!currentCollection || !currentCollection.exercises || currentCollection.exercises.length === 0) {
            return;
        }
        
        const exercise = currentCollection.exercises[index];
        exerciseCounter.textContent = `Упражнение ${index + 1} из ${currentCollection.exercises.length}`;
        
        // Сбрасываем состояние
        answersChecked = false;
        nextBtn.disabled = true;
        feedbackContainer.classList.add('d-none');
        feedbackContainer.classList.remove('alert-success', 'alert-danger');
        
        // Создаем HTML для упражнения с выпадающими списками для окончаний глаголов
        let exerciseHTML = '';
        let segmentIndex = 0;
        
        exercise.segments.forEach(segment => {
            if (segment.type === 'text') {
                exerciseHTML += `<span>${segment.content}</span>`;
            } else if (segment.type === 'verb') {
                const verbRoot = segment.verbRoot;
                const options = segment.options;
                const correctEnding = segment.correctEnding;
                
                exerciseHTML += `
                    <span>${verbRoot}</span>
                    <select class="form-select d-inline-block verb-ending bg-white text-dark" style="width: auto; min-width: 80px;" data-correct="${correctEnding}" id="verb-${segmentIndex}">
                        <option value="">...</option>
                        ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;
                segmentIndex++;
            }
        });
        
        exerciseText.innerHTML = exerciseHTML;
    }

    // Проверка ответов пользователя
    function checkAnswers() {
        if (answersChecked) return;
        
        const verbEndings = document.querySelectorAll('.verb-ending');
        let allCorrect = true;
        let correctCount = 0;
        
        verbEndings.forEach(select => {
            const userAnswer = select.value;
            const correctAnswer = select.getAttribute('data-correct');
            
            // Удаляем предыдущие классы
            select.classList.remove('is-valid', 'is-invalid');
            
            if (userAnswer === correctAnswer) {
                select.classList.add('is-valid');
                correctCount++;
            } else {
                select.classList.add('is-invalid');
                allCorrect = false;
            }
        });
        
        // Показываем обратную связь
        feedbackContainer.classList.remove('d-none');
        
        if (allCorrect) {
            feedbackContainer.classList.add('alert-success');
            feedbackContainer.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                <strong>Отлично!</strong> Все ответы правильные.
            `;
        } else {
            feedbackContainer.classList.add('alert-danger');
            feedbackContainer.innerHTML = `
                <i class="fas fa-times-circle me-2"></i>
                <strong>Попробуйте снова!</strong> Вы ответили правильно на ${correctCount} из ${verbEndings.length}.
                ${allCorrect ? '' : 'Неправильные ответы выделены красным.'}
            `;
        }
        
        // Включаем кнопку "Следующее" независимо от правильности, чтобы не застрять
        nextBtn.disabled = false;
        answersChecked = true;
    }

    // Переход к следующему упражнению
    function nextExercise() {
        if (currentExerciseIndex < currentCollection.exercises.length - 1) {
            currentExerciseIndex++;
            displayExercise(currentExerciseIndex);
        } else {
            // Все упражнения завершены
            exerciseText.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">Поздравляем!</h4>
                    <p>Вы выполнили все упражнения в этой коллекции.</p>
                    <hr>
                    <button id="return-to-collections" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i> Вернуться к списку коллекций
                    </button>
                </div>
            `;
            nextBtn.disabled = true;
            checkBtn.disabled = true;
            exerciseCounter.textContent = `Выполнено ${currentCollection.exercises.length} упражнений`;

            // Добавляем обработчик для кнопки возврата
            document.getElementById('return-to-collections').addEventListener('click', showCollections);
        }
    }

    // Показать контейнер с упражнениями
    function showExerciseContainer() {
        mainContent.style.display = 'none';
        exerciseContainer.style.display = 'block';
    }

    // Показать список коллекций
    function showCollections() {
        exerciseContainer.style.display = 'none';
        mainContent.style.display = 'block';
    }
});