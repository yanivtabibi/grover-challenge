import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStoresQuery } from '../get-stores.query';
import { Store } from '../../models/store.model';

@QueryHandler(GetStoresQuery)
export class GetStoresHandler implements IQueryHandler<GetStoresQuery> {
    async execute(query: GetStoresQuery) {
        if (!query.storeId) {
            return Store.findAll();
        }

        return Store.findAll({
            where: {
                id: query.storeId
            }
        });
    }
}