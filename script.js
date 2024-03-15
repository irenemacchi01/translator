// Elementi DOM
const langButtons = document.querySelectorAll('.lang-button');
const textInput = document.querySelector('.text-input');
const translationText = document.querySelector('.translation-text');
const translationFlag = document.querySelector('.translation-flag');
const resetButton = document.querySelector('.reset-button');
const randomButton = document.querySelector('.random-button');
const favoriteButtons = document.querySelectorAll('.favorite-button');
const favoritesContainer = document.querySelector('.favorites-container');

// Chiave per il localStorage
const STORAGE_KEY = 'favorites';

// Array dei preferiti
let favorites = [];

// Funzione per caricare i preferiti dal localStorage al caricamento della pagina
function loadFavoritesFromStorage() {
  const storedFavorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  favorites = storedFavorites;
  renderFavorites();
}

// Funzione per renderizzare i preferiti nella pagina
function renderFavorites() {
  favoritesContainer.innerHTML = '';
  favorites.forEach(function(favorite) {
    const favoriteElement = document.createElement('div');
    favoriteElement.innerHTML = `Testo originale: ${favorite.original}<br>Traduzione: ${favorite.translation}<br><br>`;
    favoritesContainer.appendChild(favoriteElement);
  });
}

// Resetta i campi di input
function reset() {
  textInput.value = '';
  translationText.innerText = 'Traduzione';
  translationFlag.innerHTML = '';
}

// Funzione asincrona per tradurre il testo
async function translate(text, lang, flag) {
  const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}`;
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    const result = jsonData.responseData.translatedText;
    translationText.innerText = result;
    translationFlag.innerHTML = `<img src="${flag}" alt="${lang}" style="max-width: 20px; max-height: 20px; margin-left: 15px;">`;
  } catch (error) {
    console.error('Errore durante la traduzione:', error);
  }
}

// Ottieni una parola casuale
async function getRandomWord() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?lang=it');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Errore durante il recupero della parola casuale:', error);
  }
}

// Gestione eventi dei pulsanti di lingua
langButtons.forEach(function(langButton) {
  langButton.addEventListener('click', function() {
    const text = textInput.value;
    const lang = langButton.dataset.lang;
    const flag = langButton.querySelector('img').getAttribute('src');
    translate(text, lang, flag);
  });
});

// Gestione evento del pulsante di reset
resetButton.addEventListener('click', reset);

// Gestione evento del pulsante per ottenere una parola casuale
randomButton.addEventListener('click', async function() {
  const randomWord = await getRandomWord();
  textInput.value = randomWord;
});

// Gestione evento dei pulsanti preferiti
favoriteButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const translation = translationText.textContent;
    addToFavorites(translation, textInput.value);
  });
});

// Aggiungi una traduzione ai preferiti
function addToFavorites(translation, original) {
  const favorite = { translation, original };
  favorites.push(favorite);
  saveFavorites();
  renderFavorites();
}

// Salva i preferiti nel localStorage
function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Carica i preferiti al caricamento della pagina
loadFavoritesFromStorage();
