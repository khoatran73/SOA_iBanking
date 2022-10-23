import * as React from 'react';

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

// add icon to library fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee, faHome, fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas, faCheckSquare, faCoffee, faHome);
library.add(fab, faCheckSquare, faCoffee);

//

type Props = FontAwesomeIconProps;

export const BaseIcon: React.FC<Props> = props => {
    return <FontAwesomeIcon {...props} />;
};
