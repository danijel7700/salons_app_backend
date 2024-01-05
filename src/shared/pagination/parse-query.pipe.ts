import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any) {
    if (value.sort) {
      value.sort = this.tryParse(value.sort, {});
    }

    if (value.projection) {
      value.projection = this.tryParse(value.projection, {});
    }

    if (value.page) {
      value.page = this.tryParse(value.page, 1);
      value.page = Math.max(value.page, 1);
    }

    if (value.limit) {
      value.limit = this.tryParse(value.limit, 1);
      value.limit = Math.min(Math.max(value.limit, 1), 50);
    }

    if (value.skip) {
      value.skip = this.tryParse(value.skip, 1);
    }

    if (value.filter) {
      value.filter = this.tryParse(value.filter, {});
    }

    return value;
  }

  private tryParse(value: any, defaultValue: number | {}) {
    try {
      value = JSON.parse(value);
    } catch (error) {
      value = defaultValue;
    }

    return value;
  }
}
