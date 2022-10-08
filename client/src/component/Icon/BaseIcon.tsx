import * as React from 'react';

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

type Props = FontAwesomeIconProps;

export const BaseIcon: React.FC<Props> = props => {
    return <FontAwesomeIcon {...props} />;
};
