import React from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from 'react-router';

export interface WrapperRouteProps extends RouteProps {
    /** document title locale id */
    titleId: string;
    /** authorization？ */
    auth?: boolean;
}

const WrapperRouteComponent: React.FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
    const WitchRoute = //auth ? PrivateRoute :
        Route;
    // if (titleId) {
    //     document.title = formatMessage({
    //         id: titleId
    //     });
    // }
    return (
        <>
            <WitchRoute {...props} />
        </>
    );
};

export default WrapperRouteComponent;
