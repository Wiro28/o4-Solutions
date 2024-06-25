import { CircularProgress } from '@mui/material';
import StateView from '@frontend/app/components/core/StateView';
import { usePageData } from '@frontend/hooks/use-page-data';
import { useContext, useEffect } from 'react';
import { useGetCar } from '@frontend/queries/fleet-management/use-get-car';
import { FleetManagementCarCarVORuntimeInfo } from '@app/shared/types/fleet-management/car/car';
import { determineQueryPayload } from '@app/shared/utils/determine-query-payload';
import { FleetManagementGetCarQueryRuntimeInfo } from '@app/shared/queries/fleet-management/get-car';
import { ThemeContext } from '@frontend/app/providers/ToggleColorMode';

type CarProps = Record<string, string> & { vehicleId: string };

const Car = (props: CarProps) => {
  const { applyTheme } = useContext(ThemeContext);
  const [, addQueryResult] = usePageData();
  const query = useGetCar(
    determineQueryPayload(props, FleetManagementGetCarQueryRuntimeInfo)
  );

  useEffect(() => {
    fetchCurrentTheme();
  }, []);

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch('http://localhost:3000/getLastTheme');
      if (!response.ok) {
        throw new Error('Fehler bei: /getLastTheme');
      }
      const data = await response.json();
      console.log(data.theme);
      applyTheme(data.theme);
    } catch (error) {
      console.error('Error fetching current ID:', error);
    }
  };

  useEffect(() => {
    addQueryResult('/Car/Car', query);
  }, [query.dataUpdatedAt]);

  return (
    <>
      {query.isLoading && <CircularProgress />}
      {query.isSuccess && (
        <StateView
          description={FleetManagementCarCarVORuntimeInfo}
          state={query.data}
        />
      )}
    </>
  );
};

export default Car;
