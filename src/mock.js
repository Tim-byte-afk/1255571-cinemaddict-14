import {shuffle, getRandomInt, getRandomDate} from './utils/common';

const MIN_RATING = 0;
const MAX_RATING = 9;

const MIN_WRITERS = 1;
const MAX_WRITERS = 3;

const MIN_ACTORS = 1;
const MAX_ACTORS = 3;

const MIN_DESC_COUNT = 1;
const MAX_DESC_COUNT = 5;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 5;

const MIN_MINUTS = 10;
const MAX_MINUTS = 59;

const MIN_DAYS = 10;
const MAX_DAYS = 30;

const MIN_YEARS = 1915;
const MAX_YEARS = 1990;

const MIN_GENRE_COUNT = 1;
const MAX_GENRE_COUNT = 3;

const filmsList = [
  {name: 'The Dance of Life', original: 'The Dance of Life', image: 'the-dance-of-life.jpg'},
  {name: 'Sagebrush Trail', original: 'Sagebrush Trail', image: 'sagebrush-trail.jpg'},
  {name: 'The Man with the Golden Arm', original: 'The Man with the Golden Arm', image: 'the-man-with-the-golden-arm.jpg'},
  {name: 'Santa Claus Conquers the Martians', original: 'Santa Claus Conquers the Martians', image: 'santa-claus-conquers-the-martians.jpg'},
  {name: 'Popeye the Sailor Meets Sindbad the Sailor', original: 'Popeye the Sailor Meets Sindbad the Sailor', image: 'popeye-meets-sinbad.png'},
  {name: 'The Great Flamarion', original: 'The Great Flamarion', image: 'the-great-flamarion.jpg'},
  {name: 'Made for Each Other', original: 'Made for Each Other', image: 'made-for-each-other.png'},
];

const directorsList = [
  'Anthony Mann',
  'Tommy Wiseau',
  'Stanley Kubrick',
  'Steven Allan Spielberg',
];

const writersList = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
];

const actorsList = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Tommy Wiseau',
];

const countriesList = [
  'USA',
  'Spain',
  'England',
];

const genresList = [
  'Drama',
  'Film-Noir',
  'Mystery',
  'Cartoon',
  'Comedy',
  'Western',
  'Musical',
];

const ageRatingList = [
  '3+',
  '13+',
  '18+',
];

const descriptionList = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const commentsList = [
  {
    id: '1',
    author: 'Tim Macoveev',
    date: '2019-01-11T16:12:32.554Z',
    comment: 'Interesting setting and a good cast',
    emotion: 'smile',
  },
  {
    id: '11',
    author: 'John Doe',
    date: '2019-02-11T16:12:32.554Z',
    comment: 'Booooooooooring',
    emotion: 'sleeping',
  },
  {
    id: '42',
    author: 'John Doe',
    date: '2019-03-11T16:12:32.554Z',
    comment: 'Very very old. Meh',
    emotion: 'puke',
  },
  {
    id: '50',
    author: 'John Doe',
    date: '2019-04-11T16:12:32.554Z',
    comment: 'Almost two hours? Seriously?',
    emotion: 'angry',
  },
  {
    id: '88',
    author: 'Tommy Wiseau',
    date: '2019-05-11T16:12:32.554Z',
    comment: 'I did not hit her, its not true! Its bullshit! I did not hit her! I did not! Oh hi, Mark.',
    emotion: 'smile',
  },
];

const getMockArray = (count) => {
  const filmsArray = [];
  for (let i = 0; i < count; i++) {
    const randomFilm = filmsList[getRandomInt(0, filmsList.length - 1)];
    const randomRating = getRandomInt(MIN_RATING, MAX_RATING) + '.' + getRandomInt(MIN_RATING, MAX_RATING);
    const randomDate = getRandomDate(new Date(MIN_YEARS, MIN_DAYS, MAX_DAYS), new Date(MAX_YEARS));
    const randomRuntime = 60 + getRandomInt(MIN_MINUTS, MAX_MINUTS);
    const id = 'f' + (i + 1);
    const descriptionArray = shuffle(descriptionList, getRandomInt(MIN_DESC_COUNT, MAX_DESC_COUNT));
    let description = '';
    descriptionArray.forEach((value) => {
      description += value + ' ';
    });

    const filmObj = {
      id,
      'comments': shuffle(commentsList, getRandomInt(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT)),
      'film_info': {
        'title': randomFilm.name,
        'alternative_title': randomFilm.original,
        'total_rating': randomRating,
        'poster': './images/posters/' + randomFilm.image,
        'age_rating': ageRatingList[getRandomInt(0, ageRatingList.length - 1)],
        'director': directorsList[getRandomInt(0, directorsList.length - 1)],
        'writers': shuffle(writersList, getRandomInt(MIN_WRITERS, MAX_WRITERS)),
        'actors': shuffle(actorsList, getRandomInt(MIN_ACTORS, MAX_ACTORS)),
        'release': {
          'date': randomDate,
          'release_country': countriesList[getRandomInt(0, countriesList.length - 1)],
        },
        'runtime': randomRuntime,
        'genre': shuffle(genresList, getRandomInt(MIN_GENRE_COUNT, MAX_GENRE_COUNT)),
        description,
      },
      'user_details': {
        'watchlist': false,
        'already_watched': false,
        'watching_date': '',
        'favorite': false,
      },
    };

    filmsArray.push(filmObj);
  }
  return filmsArray;
};

export {getMockArray};
