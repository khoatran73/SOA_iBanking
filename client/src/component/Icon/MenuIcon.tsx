import { IconPrefix } from '@fortawesome/fontawesome-common-types';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconName } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { BaseIcon } from './BaseIcon';

type Props = {
    icon: IconName;
    background?: string;
    name: string;
};

export const MenuIcon: React.FC<Props> = ({ background, icon, name }) => {
    const fnHashCode = (str: string) => {
        let hash = 0;
        if (!str) return str;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const intToRGB = (i: any) => {
        const c = (i & 0x0098aa82).toString(16).toUpperCase();
        return '00000'.substring(0, 6 - c.length) + c;
    };

    const hashCode = fnHashCode(name);
    const strbg = intToRGB(hashCode);

    return (
        <div
            className={'text-base'}
            style={{
                background: `#${strbg}`,
                color: '#ccc',
            }}
        >
            <BaseIcon icon={icon || 'home'} color={'#ccc'} />
        </div>
    );
};
