// ===== Открытие и закрытие окна

// Получение окна по id
const orderDialog = document.getElementById('order-dialog');
// Получение всех кнопок, открывающих окно быстрого заказа
const orderButtons = document.querySelectorAll('[data-order-open]');
// Получаем кнопку закрытия модального окна
const closeDialogButton = document.getElementById('close-order-dialog');
// Получаем скрытое поле, в которое будет записываться выбранный товар
const selectedProductInput = document.getElementById('selected-product');
// Перебираем все кнопки заказа и добавляем обработчик события клика
orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Получаем название товара из data-атрибута кнопки
        const productName = button.dataset.product || '';
        // Записываем название товара в скрытое поле формы
        selectedProductInput.value = productName;
        // Открываем модальное окно
        orderDialog.showModal();
    });
});

// Закрытие модального окна при клике на кнопку закрытия
if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
    });
}

// ===== Отправка формы

// Получаем форму заказа
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке
const successMessage = document.getElementById('success-message');

// Обрабатываем отправку формы
orderForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Пока что отменяем отправку, так как бекенда нет.
    // Сбрасываем предыдущие признаки ошибок
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((element) => {
        if (element.willValidate) {
            element.removeAttribute('aria-invalid');
        }
    });

    // Проверяем валидность формы
    if (!orderForm.checkValidity()) {
        formElements.forEach((element) => {
            if (element.willValidate && !element.checkValidity()) {
                element.setAttribute('aria-invalid', 'true');
            }
        });

        // Показываем стандартные сообщения об ошибках
        orderForm.reportValidity();
        return;
    }

    // Соо об успешной отправке
    successMessage.hidden = false;

    // Очистка формы
    orderForm.reset();

    // Закрытие модального окна
    if (orderDialog) {
        orderDialog.close();
    }
});
