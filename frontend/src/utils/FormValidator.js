// FUNCTION - Mostrar mensagem de erro
export const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(
    `.popup__input-error[data-input="${inputElement.name}"]`
  );

  if (errorElement) {
    inputElement.classList.add("popup__input_type_error");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("visible");
  }
};

// FUNCTION - Ocultar mensagem de erro
export const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(
    `.popup__input-error[data-input="${inputElement.name}"]`
  );
  if (errorElement) {
    inputElement.classList.remove("popup__input_type_error");
    errorElement.classList.remove("popup__input-error_visible");
    errorElement.textContent = "";
  }
};

// FUNCTION - Checar validade dos INPUTS
const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

// FUNCTION - Verificar se tem INPUT invalido
const hasInvalidInput = (inputList) =>
  inputList.some((inputElement) => !inputElement.validity.valid);

// FUNCTION - Habilitar botao SUBMIT
export const renderSubmit = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.setAttribute("disabled", true);
    buttonElement.classList.add("disabled");
  } else {
    buttonElement.removeAttribute("disabled");
    buttonElement.classList.remove("disabled");
  }
};

// FUNCTION - Ativa Listeners de forma escalonavel
const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const buttonElement = formElement.querySelector(".popup__submit-button");
  renderSubmit(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement);
      renderSubmit(inputList, buttonElement);
    });
  });
};

// FUNCTION - Habilitar validacao nos formularios
export const enableValidation = () => {
  document.querySelectorAll(".popup__wrapper").forEach((formElement) => {
    formElement.addEventListener("submit", (event) => event.preventDefault());
    setEventListeners(formElement);
  });
};
