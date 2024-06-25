import { TopLevelPageWithProophBoardDescription } from '@frontend/app/pages/page-definitions';
import { staticLabel } from '@frontend/util/breadcrumb/static-label';
import { CarMultiple } from 'mdi-material-ui';

export const CarOverview: TopLevelPageWithProophBoardDescription = {
  commands: ['FleetManagement.AddCarToFleet'],
  components: ['FleetManagement.CarList'],
  topLevel: true,
  route: '/cars',
  sidebar: {
    label: 'Cars',
    Icon: CarMultiple,
    position: 5,
  },
  breadcrumb: staticLabel('Car Overview'),

  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'b9rmKAk4NCbkCqFf7GcCTm',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-25T09:54:26.537Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-25T09:56:45.708Z',
  _pbVersion: 4,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=b9rmKAk4NCbkCqFf7GcCTm&clicks=1',
};
