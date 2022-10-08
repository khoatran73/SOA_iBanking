import ReactLoading from 'react-loading';
import React from 'react';

interface ILoading {
    text?: string;
}

const Loading: React.FC<ILoading> = (props: ILoading): JSX.Element => {
    const { text } = props;
    return (
        <div className="full-screen d-flex align-items-center justify-content-center flex-column">
            <ReactLoading type="cylon" color="#0088fe" height={50} width={50} />
            <p>{text}</p>
        </div>
    );
};

export default Loading;
