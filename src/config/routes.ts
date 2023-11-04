import MovieController from '../modules/SearchMovie/controllers/MovieController';

export enum Routes {
  MOVIE = '/movie',
}

export default {
  [Routes.MOVIE]: [MovieController],
};
