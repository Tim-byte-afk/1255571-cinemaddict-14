import {countList} from '../const';

export const createFilmCardTemplate = ({film_info, comments}) => {
  const {id, title, total_rating, release, runtime, genre, poster, description} = film_info;

  const genreList = genre[0];
  const shortDesc = description.length > countList.MAX_COUNT_CHARACTER ? description.slice(0, countList.MAX_COUNT_CHARACTER) + '...' : description ;
  const date = new Date(release.date).getFullYear();

  return (
    `<article id='${id}_${date}' class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${total_rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genreList}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDesc}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};
