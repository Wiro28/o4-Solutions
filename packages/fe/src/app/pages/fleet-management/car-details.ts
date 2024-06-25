import { SubLevelPageWithProophBoardDescription } from '@frontend/app/pages/page-definitions';
import { dynamicLabel } from '@frontend/util/breadcrumb/dynamic-label';
import { GetCarDesc } from '@app/shared/queries/fleet-management/get-car.desc';
import { getCar } from '@frontend/queries/fleet-management/use-get-car';
import jexl from '@app/shared/jexl/get-configured-jexl';

export const CarDetails: SubLevelPageWithProophBoardDescription = {
  commands: ['FleetManagement.UpdateCar'],
  components: ['FleetManagement.Car'],
  topLevel: false,
  route: '/cars/:vehicleId',
  routeParams: ['vehicleId'],
  breadcrumb: dynamicLabel(
    GetCarDesc.name,
    getCar,
    (data) => {
      const ctx: any = { data, value: '' };

      ctx['value'] = jexl.evalSync("data.brand + ' ' + data.model", ctx);

      return ctx.value;
    },
    'Car Details'
  ),

  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'd2FtH5DFdyL9a4tY8GyxVP',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-25T09:54:36.100Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-25T09:54:36.100Z',
  _pbVersion: 1,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=d2FtH5DFdyL9a4tY8GyxVP&clicks=1',
};
