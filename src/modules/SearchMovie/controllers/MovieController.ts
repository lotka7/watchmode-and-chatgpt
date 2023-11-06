import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../../../common/Logger';
import TypedHandle from '../../../middlewares/TypedHandle';
import MovieService, { FilterOptions } from '../services/MovieService';
import { ActorInfo } from '../types/Actor';
import { TitleInfo } from '../types/Title';
import { v4 as uuidV4 } from 'uuid';
import Description from '../models/Description';

const logger = Logger(__filename);

const Movie = Router();

export enum SearchType {
  movie = 'movie',
  person = 'person',
  tv = 'tv',
}

Movie.get(
  '/search',
  TypedHandle<
    void,
    string | { title_results: TitleInfo[]; people_results: ActorInfo[] }
  >(async (req, res): Promise<any> => {
    const search = req.query.search as string;
    const type = req.query.type as SearchType;

    // Validating the search query
    if (!search || search.length < 3 || search.length > 20) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(`Search param must be between 3 and 20.`);
    }

    // Validating the type query
    if (!type || !Object.values(SearchType).includes(type)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(`Type must be either 'movie', 'tv' or 'person'.`);
    }

    try {
      const data = await MovieService.search(search, type);

      // Check if there are no search results
      if (data.title_results.length === 0 && data.people_results.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send(`No results found.`);
      }

      return res.status(StatusCodes.OK).send(data);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Something went wrong.`);
    }
  })
);

Movie.post(
  '/description',
  TypedHandle<void, string | { id: string; description: string }>(
    async (req, res): Promise<any> => {
      const search = req.query.search as string;
      const type = req.query.type as SearchType;

      // Validating the search query
      if (!search || search.length < 3 || search.length > 20) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(`Search param must be between 3 and 20.`);
      }

      // Validating the type query
      if (!type || !Object.values(SearchType).includes(type)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(`Type must be either 'movie', 'tv' or 'person'.`);
      }

      try {
        const data = await MovieService.search(search, type);

        if (data.title_results.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send(`There is no matching movie.`);
        }

        const description = await MovieService.openaiSearch(
          data.title_results[0].name,
          data.title_results[0].year
        );

        return res.status(StatusCodes.OK).send(description);
      } catch (error: any) {
        logger.error(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(`Something went wrong.`);
      }
    }
  )
);

Movie.get(
  '/descriptions',
  TypedHandle<void, string | Description[]>(async (req, res): Promise<any> => {
    // TODO - it can be extended with page, size, orderby
    const title = req.query.title as string;
    const year = req.query.year as string;

    // Validating the type of year
    if (year && !/^\d+$/.test(year)) {
      return res.status(StatusCodes.BAD_REQUEST).send(`Year must be integer.`);
    }

    const filter = {} as FilterOptions;

    if (title) {
      filter.title = title;
    }

    if (year) {
      filter.year = parseInt(year);
    }

    try {
      const descriptions = await MovieService.list({
        filter,
      });

      // TODO - return total number of descriptions if it is needed
      return res.status(StatusCodes.OK).send(descriptions);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(`Something went wrong.`);
    }
  })
);

export default Movie;
