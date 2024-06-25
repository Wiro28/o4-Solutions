import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useContext, useEffect } from 'react';
import { triggerSideBarAnchorsRendered } from '@frontend/util/sidebar/trigger-sidebar-anchors-rendered';
import { usePageData } from '@frontend/hooks/use-page-data';
import { GetCarList } from '@app/shared/queries/fleet-management/get-car-list';
import { useGetCarList } from '@frontend/queries/fleet-management/use-get-car-list';
import NoRowsOverlay from '@frontend/app/components/core/table/NoRowsOverlay';
import { ThemeContext } from '@frontend/app/providers/ToggleColorMode';

import { stringify } from '@app/shared/utils/stringify';
import jexl from '@app/shared/jexl/get-configured-jexl';
import PageLink from '@frontend/app/components/core/PageLink';
import { mapProperties } from '@app/shared/utils/map-properties';
import { CarDetails } from '@frontend/app/pages/fleet-management/car-details';
import { useUser } from '@frontend/hooks/use-user';

const CarList = (params: GetCarList) => {
  const { applyTheme } = useContext(ThemeContext);
  const [, addQueryResult] = usePageData();
  const query = useGetCarList(params);
  const [user] = useUser();

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
    triggerSideBarAnchorsRendered();
  }, [params]);

  useEffect(() => {
    addQueryResult('/Car/CarList', query);
  }, [query.dataUpdatedAt]);

  const columns: GridColDef[] = [
    {
      field: 'vehicleId',
      headerName: 'Vehicle Id',
      flex: 1,
      valueGetter: (params) => stringify(params.value),
    },
    {
      field: 'carName',
      valueGetter: (params) => {
        const ctx: any = { ...params, value: '', user };

        ctx['value'] = jexl.evalSync("row.brand + ' ' + row.model", ctx);

        return ctx.value;
      },
      renderCell: (rowParams) => (
        <PageLink
          page={CarDetails}
          params={mapProperties({ ...rowParams.row, ...params }, {})}
        >
          {rowParams.value}
        </PageLink>
      ),
      headerName: 'Car Name',
      flex: 1,
    },
    {
      field: 'productionYear',
      headerName: 'Production Year',
      flex: 1,
      valueGetter: (params) => stringify(params.value),
    },
  ];

  return (
    <Box component="div">
      <Typography
        variant="h3"
        className="sidebar-anchor"
        sx={{ padding: (theme) => theme.spacing(4), paddingLeft: 0 }}
        id="component-fleet-management-car-list"
      >
        Car List
      </Typography>
      {query.isLoading && <CircularProgress />}
      {query.isSuccess && (
        <DataGrid
          columns={columns}
          rows={query.data}
          getRowId={(row) => row.vehicleId}
          sx={{ width: '100%' }}
          slots={{
            toolbar: GridToolbar,
            noRowsOverlay: NoRowsOverlay,
          }}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 25]}
          density="comfortable"
        />
      )}
    </Box>
  );
};

export default CarList;
