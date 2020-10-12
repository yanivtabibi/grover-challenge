import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAssetsQuery } from '../get-assets.query';
import { Asset } from '../../models/asset.model';

@QueryHandler(GetAssetsQuery)
export class GetAssetsHandler implements IQueryHandler<GetAssetsQuery> {
    async execute(query: GetAssetsQuery) {
        if (!query.assetId) {
            return Asset.findAll();
        }

        return Asset.findAll({
            where: {
                id: query.assetId
            }
        });
    }
}
