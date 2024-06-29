import React from 'react';
import CoreWelcome from '@frontend/app/components/core/welcome';
import Questionnaire from '@frontend/app/components/core/weboranger/questionnaire';
import Adminpanel from '@frontend/app/components/core/weboranger/Adminpanel';
import Examplefeature from '@frontend/app/components/core/weboranger/Examplefeature';
import FleetManagementCar from '@frontend/app/components/fleet-management/views/Car';
import FleetManagementCarList from '@frontend/app/components/fleet-management/views/CarList';

export type ViewRegistry = {
  [valueObjectName: string]: React.FunctionComponent<any>;
};

export const views: ViewRegistry = {
  'Core.Welcome': CoreWelcome,
  'Core.Questions': Questionnaire,
  'Core.Adminpanel': Adminpanel,
  'Core.Examplefeature': Examplefeature,
  'FleetManagement.Car': FleetManagementCar,
  'FleetManagement.CarList': FleetManagementCarList,
};
