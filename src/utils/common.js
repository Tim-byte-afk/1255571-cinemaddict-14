import {SortingTypes, MONTH_NAMES, Places} from '../const';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray, count) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  if (someArray.length < count) {
    count = someArray.length;
  }

  const newArray = [];
  for (let i = 0; i < count; i++) {
    newArray.push(someArray[i]);
  }

  return newArray;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const arrayToString = (myArray) => {
  let someString = '';
  myArray.forEach((element, index) => {
    if(index < myArray.length) {
      someString = someString + element + ', ';
    } else {
      someString = someString + element;
    }
  });

  return someString;
};

const sorting = (data, activeSorting) => {
  if (activeSorting === SortingTypes.BY_DEFAULT) {
    return data.slice().sort((a, b) => (b.id - a.id));
  } else if (activeSorting === SortingTypes.BY_DATE) {
    return data.slice().sort((a, b) => (new Date(b.film_info.release.date) - new Date(a.film_info.release.date)));
  } else if (activeSorting === SortingTypes.BY_RAITING) {
    return data.slice().sort((a, b) => (b.film_info.total_rating - a.film_info.total_rating));
  } else if (activeSorting === SortingTypes.BY_COMMENTING) {
    return data.slice().sort((a, b) => (b.comments.length - a.comments.length));
  }

  return data;
};

const getDateFilm = (date) => {
  return new Date(date).getDay() + ' ' + MONTH_NAMES[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
};

const getDateComment = (date) => {
  return new Date(date).getFullYear() + '/' + new Date(date).getMonth() + '/' + new Date(date).getDay() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes();
};

const render = (container, element, place) => {
  switch (place) {
    case Places.AFTERBEGIN:
      container.prepend(element);
      break;
    case Places.BEFOREEND:
      container.append(element);
      break;
    case Places.BEFOREBEGIN:
      container.before(element);
      break;
  }
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};


export {shuffle, getRandomInt, getRandomDate, arrayToString, sorting, getDateFilm, getDateComment, render, renderTemplate, createElement};
