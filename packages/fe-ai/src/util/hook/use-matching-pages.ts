import {usePageMatch} from "@frontend-ai/util/hook/use-page-match";
import {pages} from "@frontend-ai/app/pages";
import {compileRouteIfPossible} from "@frontend-ai/util/routing/compile-route";
import {PageDefinition} from "@frontend-ai/app/pages/page-definitions";

export const useMatchingPages = (): PageDefinition[] => {
  const {handle: {page}, params, pathname} = usePageMatch();

  return Object.values(pages).filter(p => {
    if(p === page) {
      return true;
    }
    const compiledRoute = compileRouteIfPossible(p, params);

    if(!compiledRoute) {
      return false;
    }

    return pathname.includes(compiledRoute);
  }).sort((aPage, bPage) => {
    const aNestingLevel = aPage.route.split("/").length;
    const bNestingLevel = bPage.route.split("/").length;

    return aNestingLevel < bNestingLevel ? -1 : 1;
  })
}
