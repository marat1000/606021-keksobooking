'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  function CustomValidation() {}
  CustomValidation.prototype = {
  // Установим пустой массив сообщений об ошибках
    invalidities: [],
    // Метод, проверяющий валидность
    checkValidity: function (input) {
      this.invalidities = [];
      var validity = input.validity;
      if (validity.rangeOverflow) {
        var max = input.getAttribute('max');
        this.addInvalidity('Максимальное значение ' + max);
      }
      if (validity.rangeUnderflow) {
        var min = input.getAttribute('min');
        this.addInvalidity('Минимальное значение ' + min);
      }
      if (validity.tooShort) {
        var minlength = input.getAttribute('minlength');
        this.addInvalidity('Минимальная длина ' + minlength);
      }
      if (validity.tooLong) {
        var maxlength = input.getAttribute('maxlength');
        this.addInvalidity('Максимальная длина ' + maxlength);
      }
      if (validity.valueMissing) {
        this.addInvalidity('Обязательно для заполнения');
      }
    },
    // Добавляем сообщение об ошибке в массив ошибок
    addInvalidity: function (message) {
      this.invalidities.push(message);
    },
    // Получаем общий текст сообщений об ошибках
    getInvalidities: function () {
      return this.invalidities.join('. \n');
    }
  };

  CustomValidation.prototype.getInvaliditiesForHTML = function () {
    return this.invalidities.join('. <br>');
  };
  // Добавляем обработчик клика на кнопку отправки формы
  var submit = document.querySelector('.ad-form__submit');
  submit.addEventListener('click', function (evt) {
  // Пройдёмся по всем полям
    adForm.querySelector('#capacity').style.cssText = '';
    var stopSubmit = false;
    var inputs = document.querySelectorAll('.ad-form input');
    for (var j = 0; j < inputs.length; j++) {
      var input = inputs[j];
      // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
      if (!input.checkValidity()) {
        var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
        inputCustomValidation.checkValidity(input); // Выявим ошибки
        var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
        input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке
        // Добавим ошибки в документ
        var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
        input.insertAdjacentHTML('afterend', '<p class="error-message">' + customValidityMessageForHTML + '</p>');
        stopSubmit = true;
      }
    }
    var index = adForm.querySelector('#capacity').selectedIndex;
    if (adForm.querySelector('#capacity').options[index].disabled === true) {
      stopSubmit = true;
      adForm.querySelector('#capacity').insertAdjacentHTML('afterend', '<p class="error-message">Измените количество мест</p>');
      adForm.querySelector('#capacity').style.cssText = 'border: 1px solid red; box-shadow: 0 0 3px red;';
    }
    setTimeout(function () {
      var errorMessages = adForm.querySelectorAll('.error-message');
      for (j = 0; j < errorMessages.length; j++) {
        errorMessages[j].remove();
      }
    }, 5000);
    if (stopSubmit) {
      evt.preventDefault();
    }
  });

  var selectTypeHouse = adForm.querySelector('#type');
  var priceHouse = adForm.querySelector('#price');
  function onSelectTypeChange() {
    var PRICE_MIN_BUNGALO = 0;
    var PRICE_MIN_FLAT = 1000;
    var PRICE_MIN_HOUSE = 5000;
    var PRICE_MIN_PALACE = 10000;
    var COMPLIANCE_TYPE_PRICE = {
      palace: PRICE_MIN_PALACE,
      flat: PRICE_MIN_FLAT,
      house: PRICE_MIN_HOUSE,
      bungalo: PRICE_MIN_BUNGALO
    };
    priceHouse.placeholder = COMPLIANCE_TYPE_PRICE[selectTypeHouse.value];
    priceHouse.min = COMPLIANCE_TYPE_PRICE[selectTypeHouse.value];
  }
  selectTypeHouse.addEventListener('change', onSelectTypeChange);

  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  function onSelectTimeChange(evt) {
    if (evt.target === timeIn) {
      timeOut.selectedIndex = evt.target.selectedIndex;
    } else {
      timeIn.selectedIndex = evt.target.selectedIndex;
    }
  }
  timeIn.addEventListener('change', onSelectTimeChange);
  timeOut.addEventListener('change', onSelectTimeChange);

  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var FOR_1_GUEST = 0;
  var FOR_2_GUESTS = 1;
  var FOR_3_GUESTS = 2;
  var NOT_FOR_GUESTS = 3;
  function onSelectCapacityChange(evt) {
    var COMPLIANCE_ROOMS_CAPACITY = [
      [FOR_2_GUESTS, FOR_3_GUESTS, NOT_FOR_GUESTS],
      [FOR_3_GUESTS, NOT_FOR_GUESTS],
      [NOT_FOR_GUESTS],
      [FOR_1_GUEST, FOR_2_GUESTS, FOR_3_GUESTS]
    ];
    var capacitySelectOptions = adForm.querySelectorAll('#capacity option');
    for (var j = 0; j < capacitySelectOptions.length; j++) {
      capacitySelectOptions[j].disabled = false;
    }
    var capacities = COMPLIANCE_ROOMS_CAPACITY[evt.target.selectedIndex];
    for (j = 0; j < capacities.length; j++) {
      capacitySelect.options[capacities[j]].disabled = true;
    }
  }
  roomNumberSelect.addEventListener('change', onSelectCapacityChange);
})();
