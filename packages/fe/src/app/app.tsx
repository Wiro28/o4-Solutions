import {QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {StandardPage} from "@frontend/app/pages/standard-page";
import {
  createBrowserRouter,
  RouteObject,
  Outlet,
  RouterProvider,
  redirect
} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import queryClient from "@frontend/extensions/http/configured-react-query";
import MainLayout from "@frontend/app/layout/MainLayout";
import React from "react";
import {pages} from "@frontend/app/pages";
import {SnackbarProvider} from "notistack";
import ScrollToTop from "@frontend/app/components/core/ScrollToTop";
import ToggleColorMode from "@frontend/app/providers/ToggleColorMode";
import User from "@frontend/app/providers/User";
import PageDataProvider from "@frontend/app/providers/PageData";
import ErrorBoundary from "@frontend/app/components/core/ErrorBoundary";

// Verspielt
import '@fontsource/pacifico'; 
import '@fontsource/grandstander'; 
import '@fontsource/caveat';
import '@fontsource/indie-flower';
import '@fontsource/happy-monkey';
import '@fontsource/twinkle-star';

// Schlicht
import '@fontsource/open-sans'; 
import '@fontsource/lato'; 
import '@fontsource/montserrat';
import '@fontsource/raleway';
import '@fontsource/josefin-sans';
import '@fontsource/work-sans';

// Maschinell
import '@fontsource/roboto-mono'; 
import '@fontsource/source-code-pro'; 
import '@fontsource/fira-code';
import '@fontsource/inconsolata';
import '@fontsource/space-mono';
import '@fontsource/dm-mono';
import '@fontsource/courier-prime';
import '@fontsource/press-start-2p';
import '@fontsource/silkscreen';

// Gerundet
import '@fontsource/nunito'; 
import '@fontsource/dongle'; 
import '@fontsource/comic-neue';
import '@fontsource/comfortaa';
import '@fontsource/m-plus-rounded-1c';
import '@fontsource/dosis';

// Elegant
import '@fontsource/didact-gothic';
import '@fontsource/questrial';
import '@fontsource/average-sans';
import '@fontsource/libre-franklin';
import '@fontsource/metropolis';
import '@fontsource/urbanist';
import '@fontsource/lexend-zetta';

// Dramatisch
import '@fontsource/bebas-neue';
import '@fontsource/righteous';
import '@fontsource/bungee';
import '@fontsource/anton';
import '@fontsource/staatliches';
import '@fontsource/monoton';
import '@fontsource/krona-one';
import '@fontsource-variable/fredoka';
import '@fontsource/abril-fatface';

// Sachlich
import '@fontsource/cormorant-garamond';
import '@fontsource/spectral';
import '@fontsource/quattrocento';
import '@fontsource/old-standard-tt';
import '@fontsource/noto-serif-jp';
import '@fontsource/bodoni-moda';
import '@fontsource/roboto'; 
import '@fontsource/inter';
import '@fontsource/ubuntu';
import '@fontsource/noto-sans';
import '@fontsource/manrope';

export function App() {
  const Layout = (props: React.PropsWithChildren) => {
    return <>
      <User>
        <PageDataProvider>
          <ToggleColorMode>
            <SnackbarProvider maxSnack={3} >
              <MainLayout>
                <ScrollToTop />
                <Outlet />
              </MainLayout>
            </SnackbarProvider>
          </ToggleColorMode>
        </PageDataProvider>
      </User>
    </>
  };

  const routeObjects: RouteObject[] = Object.values(pages).map(p => ({
    path: p.route,
    handle: {page: p},
    element: <StandardPage page={p} key={p.route}/>,
    errorElement: <ErrorBoundary codyEngine={true} />,
  }));

  routeObjects.unshift({
    path: "/",
    loader: async () => redirect('/dashboard')
  })

  const rootRoute: RouteObject = {
    element: <Layout />,
    children: routeObjects,
    errorElement: <ErrorBoundary codyEngine={true} />,
  }

  const router = createBrowserRouter([rootRoute]);

  return (
    <QueryClientProvider client={queryClient!}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
