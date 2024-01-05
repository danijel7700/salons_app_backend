import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { SortDirection } from '../../constants/sortDirection';
import { PaginationOptions } from '../../types/paginationOptions.definition';
import { PaginationResponseType } from 'src/types/paginationResponseTypes.definition';

@Injectable()
export class PaginationService<T> {
  async getPaginated(
    model: Model<T>,
    query: FilterQuery<T>,
    options: PaginationOptions,
  ): Promise<PaginationResponseType<T>> {
    let { page, skip } = options;
    const { limit = 15, sort, populate, projection, filter } = options;

    if (limit > 50) {
      throw new BadRequestException('Max value of limit is 50');
    }

    if (skip && page) {
      skip = undefined;
    }

    if (!skip && !page) {
      page = 1;
    }

    if (skip !== undefined) {
      page = Math.ceil(skip / limit) + 1;
    } else {
      skip = (page - 1) * limit;
    }

    const projectionObject = (projection || []).reduce(
      (projection, field) => ({
        ...projection,
        [field]: 1,
      }),
      {},
    );

    let sortCriteria = {};

    if (sort) {
      sortCriteria = {
        [sort.sortBy]: sort.direction,
      };
    } else {
      sortCriteria = {};
    }

    const [items, totalItems] = await Promise.all([
      model
        .find(filter || query, projectionObject)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .exec(),
      model.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, page, totalPages };
  }
}
