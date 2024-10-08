import React from 'react';
import TransactionSpinner from './TransactionSpinner';

interface Props {
    text?: string;
    width?: string;
    fontSize?: string;
    color?: string;
    hideSpinner?: boolean | null;
    inlineButton?: boolean;
}

const Loader = ({ text, width, fontSize, hideSpinner, inlineButton, color="#1A74EC" }: Props) => {
    return (
        <div className={`loader ${inlineButton ? 'inline' : ''}`}>
            {!hideSpinner && (
                <TransactionSpinner color={color} style={{ width: width || '14px', height: width || '14px' }} />
            )}
            <span style={{ fontSize }}>{text}</span>
        </div>
    );
};

export default Loader;


