import { isEmpty } from 'lodash';
import { FC, useMemo } from 'react';
import { RouteProps, useLocation } from 'react-router';
import { RouteMatch, useNavigate } from 'react-router-dom';
import { useAppState } from '~/AppStore';
import Loading from '~/component/Elements/loading/Loading';
import Forbidden from '~/component/Layout/Forbidden';
import { useMatchRoute } from '~/routes/index';

export interface ExtraPrivateRouteProps {
    checkAuth?: (currentRoute: string) => boolean;
    rights?: string[];
    ignoreCheckPermission?: boolean;
}

type Props = RouteProps & ExtraPrivateRouteProps;

const PrivateRoute: FC<Props> = props => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, checkLoginLoading, authUser } = useAppState(state => state.authData);
    const { menus } = useAppState(state => state.layout);
    const matchRoutes = useMatchRoute(location.pathname);

    const hasPermissionOnRoute = useMemo(() => {
        const getOriginPathFromMatchRoute = (routeMatch: RouteMatch<string>) => {
            let pathName = routeMatch.pathname;
            Object.keys(routeMatch.params).forEach(
                key => (pathName = pathName.replace(routeMatch.params[key] as string, `:${key}`)),
            );
            return pathName;
        };
        const menu = menus
            .filter(menu => {
                const isMatch = menu.route === location.pathname;
                const currentRouteParamArr = menu.route.match(/:\w+/g) || [];
                const matchWithRouteParams = matchRoutes?.find(matchRoute => {
                    const originPathName = getOriginPathFromMatchRoute(matchRoute);
                    if (originPathName.includes(menu.route) && matchRoute.route.path) {
                        return currentRouteParamArr.includes(matchRoute.route.path);
                    }
                });
                return isMatch || !isEmpty(matchWithRouteParams);
            })
            ?.[0];
        // Todo: hard return if null
        return menu?.hasPermissionToAccess;
    }, [menus, location.pathname, matchRoutes]);

    if (checkLoginLoading || menus.length === 0) {
        return <Loading text={'Đang kiểm tra dữ liệu'} />;
    }

    if (!isAuthenticated) {
        navigate('/login');
    }

    if (hasPermissionOnRoute && !checkLoginLoading) {
        return <>{props.children}</>;
    }

    return <Forbidden />;
};

export default PrivateRoute;
