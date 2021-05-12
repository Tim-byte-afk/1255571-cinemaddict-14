import {SortTypes, MONTH_NAMES} from '../const';

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sorting = (data, activeSorting) => {
  if (activeSorting === SortTypes.BY_DEFAULT) {
    return data.slice().sort((a, b) => (b.id - a.id));
  } else if (activeSorting === SortTypes.BY_DATE) {
    return data.slice().sort((a, b) => (new Date(b.film_info.release.date) - new Date(a.film_info.release.date)));
  } else if (activeSorting === SortTypes.BY_RAITING) {
    return data.slice().sort((a, b) => (b.film_info.total_rating - a.film_info.total_rating));
  } else if (activeSorting === SortTypes.BY_COMMENTING) {
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

export {shuffle, getRandomInt, getRandomDate, arrayToString, sorting, getDateFilm, getDateComment, updateItem};
