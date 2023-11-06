import axios from 'axios';
import config from '../../../config/config';
import { SearchType } from '../controllers/MovieController';
import { ActorInfo } from '../types/Actor';
import { TitleInfo } from '../types/Title';
import Logger from '../../../common/Logger';
import { v4 as uuidV4 } from 'uuid';
import Description from '../models/Description';
import PgDataSource from '../../../data-source';
import { Brackets } from 'typeorm';

const logger = Logger(__filename);

const search = async (
  search: string,
  type: SearchType
): Promise<{ title_results: TitleInfo[]; people_results: ActorInfo[] }> => {
  const response = await axios.get(config.watchmode.url, {
    params: {
      apiKey: process.env.YOUR_WATCHMODE_API_KEY,
      search_field: 'name',
      search_value: search,
      types: SearchType[type],
    },
  });

  return response.data;
};

const openaiSearch = async (
  title: string,
  year: number
): Promise<{ id: string; description: string }> => {
  // Prompt for OpenAI
  const prompt = `Write me a short description of the movie '${title}'${
    year ? ` (${year})` : ''
  }.`;

  try {
    const requestData = {
      prompt,
      max_tokens: config.openai.max_tokens, // Adjust the max tokens as needed
    };

    const res = await axios.post(config.openai.url, requestData, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const description = res.data.choices[0].text;
    const id = uuidV4();

    // TODO - check if it has already been created if it is necessary
    const descriptionEntity = new Description();
    descriptionEntity.id = id;
    descriptionEntity.title = title;
    descriptionEntity.year = year;
    descriptionEntity.description = description;

    const desc = await PgDataSource.getRepository(Description).save(
      descriptionEntity
    );

    logger.info(`Movie - ${desc.title} has been saved to the database`);

    return {
      id: desc.id,
      description: desc.description,
    };
  } catch (error: any) {
    logger.error(error);
    throw new Error(error.message);
  }
};

type PaginationOptions = {
  page?: number;
  size?: number;
};

export type FilterOptions = {
  title?: string;
  year?: number;
};

export type SortOptions = {
  field?: string;
  order?: 'ASC' | 'DESC';
};

type ListParamsType = {
  filter?: FilterOptions;
  sort?: SortOptions;
  pagination?: PaginationOptions;
};

const list = async (params: ListParamsType): Promise<Description[]> => {
  try {
    const defaultParams: ListParamsType = {
      pagination: {
        page: 1,
        size: 100,
      },
      sort: {
        field: 'description.title',
        order: 'ASC',
      },
    };

    const findParams: ListParamsType = {
      filter: {
        ...defaultParams.filter,
        ...params.filter,
      },
      sort: { ...defaultParams.sort, ...params.sort },
      pagination: params.pagination
        ? params.pagination
        : defaultParams.pagination,
    };
    const queryBuilder =
      PgDataSource.getRepository(Description).createQueryBuilder('description');

    if (findParams.filter?.year) {
      queryBuilder.where(
        findParams.filter.year
          ? 'description.year = :year'
          : 'description.year IS NOT NULL',
        { year: findParams.filter.year }
      );
    }

    if (findParams.filter?.title) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(description.title) ILIKE LOWER(:title)', {
            title: `%${findParams.filter?.title}%`,
          });
        })
      );

      delete findParams.filter.title;
    }

    if (findParams.pagination?.size) {
      queryBuilder.limit(findParams.pagination.size);

      if (findParams.pagination?.page) {
        queryBuilder.offset(
          findParams.pagination.size * (findParams.pagination.page - 1)
        );
      }
    }

    if (findParams.sort?.field) {
      queryBuilder.orderBy(
        findParams.sort?.field,
        findParams.sort?.order ?? 'ASC'
      );
    }

    const descriptions = await queryBuilder.getMany();

    return descriptions;
  } catch (error: any) {
    logger.error(error);
    throw new Error(error.message);
  }
};

export default { search, openaiSearch, list };
