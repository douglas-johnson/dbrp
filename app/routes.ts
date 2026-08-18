import {type RouteConfig} from '@react-router/dev/routes';
import {flatRoutes} from '@react-router/fs-routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

// All routes in app/routes/ follow the flat-file convention (e.g.
// `($locale).products.$handle.tsx`), so we let `flatRoutes()` derive the
// route tree from the filesystem, then let Hydrogen append its built-in
// dev-only routes (GraphiQL, subrequest profiler, etc.).
export default hydrogenRoutes([...(await flatRoutes())]) satisfies RouteConfig;
