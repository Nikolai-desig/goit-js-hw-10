import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info')
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const countryName = evt.target.value.trim();
  if (!countryName) {
    clearCountryList();
    clearCountryInfo();
    return;
  }
  fetchCountries(countryName)
    .then(renderCountries)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    // .catch(alertNoName);
}

function renderCountries(countries) {
  if (countries.length > 10) {
    alertMatches()
    return;
  };

  if (countries.length > 1 && countries.length <= 10) {
    clearCountryList();
    const markupList = countries.map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${flags.alt}" width="50">${name.official}</li>`;
    })
    .join('');
    refs.countryList.insertAdjacentHTML('beforeend', markupList)
    .filter(
    (country, index, array) => array.indexOf(country) === index);
  };

  if (countries.length === 1) {
    clearCountryList();
    const markupInfo = countries.map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${name.official}" width='70'>
        <h1 class="country-item-name">${name.official}</h1>
        <p class="country-item-info">Capital: ${capital}</p>
        <p class="country-item-info">Population: ${population}</p>
        <p class="country-item-info">Languages: ${Object.values(languages)} </p>`})
    .join();
    refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
  };

  if (!countries.length) {
    alertNoName()
    return
   };
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function alertNoName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}