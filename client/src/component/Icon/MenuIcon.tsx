import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import { BaseIcon } from './BaseIcon';

type Props = {
    icon: IconProp;
    name: string;
};

export const MenuIcon: React.FC<Props> = ({ icon, name }) => {
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
            className={'text-base w-8 h-8 flex items-center justify-center rounded mr-1.5'}
            style={{
                background: `#${strbg}`,
            }}
        >
            <BaseIcon icon={icon || 'home'} color={'#fff'} />
        </div>
    );
};
