import React from 'react';

const ThreeDElement = ({ size = 100, type = 'cube', className = '', style = {} }) => {
    const scale = size / 100;

    const renderShape = () => {
        switch (type) {
            case 'pyramid':
                return (
                    <div className="pyramid-container cube-float">
                        <div className="pyramid-face face-1"></div>
                        <div className="pyramid-face face-2"></div>
                        <div className="pyramid-face face-3"></div>
                        <div className="pyramid-face face-4"></div>
                        <div className="pyramid-base"></div>
                    </div>
                );
            case 'ring':
                return (
                    <div className="ring-container cube-float">
                        <div className="ring-inner"></div>
                        <div className="ring-main"></div>
                        <div className="ring-outer"></div>
                    </div>
                );
            case 'sphere':
                return (
                    <div className="sphere-container cube-float">
                        <div className="sphere-layer layer-1"></div>
                        <div className="sphere-layer layer-2"></div>
                        <div className="sphere-layer layer-3"></div>
                    </div>
                );
            case 'cube':
            default:
                return (
                    <div className="cube-container cube-float">
                        <div className="cube-face face-front"></div>
                        <div className="cube-face face-back"></div>
                        <div className="cube-face face-right"></div>
                        <div className="cube-face face-left"></div>
                        <div className="cube-face face-top"></div>
                        <div className="cube-face face-bottom"></div>
                    </div>
                );
        }
    };

    return (
        <div
            className={`perspective-container ${className}`}
            style={{
                ...style,
                transform: `${style.transform || ''} scale(${scale})`
            }}
        >
            {renderShape()}
        </div>
    );
};

export default ThreeDElement;
