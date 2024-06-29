import { AggregateEventDescription } from '@event-engine/descriptions/descriptions';

export const CarAddedToFleetDesc: AggregateEventDescription = {
  name: 'FleetManagement.Car.CarAddedToFleet',
  aggregateEvent: true,
  public: false,
  aggregateState: 'FleetManagement.Car.Car',
  aggregateName: 'FleetManagement.Car',
  aggregateIdentifier: 'vehicleId',
  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'ffNnxtdjq6zfbhm9MdmTAU',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-28T09:14:41.849Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-28T09:15:54.410Z',
  _pbVersion: 3,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=ffNnxtdjq6zfbhm9MdmTAU&clicks=1',
};
