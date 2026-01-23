declare module 'react-svg-map' {
    export interface Map {
        viewBox: string;
        locations: {
            path: string;
            id: string;
            name?: string;
        }[];
        label?: string;
    }

    export interface SVGMapProps {
        map: Map;
        className?: string;
        role?: string;
        locationClassName?: string | ((location: any, index: number) => string);
        locationTabIndex?: string | ((location: any, index: number) => string);
        locationRole?: string;
        locationAriaLabel?: string | ((location: any, index: number) => string);
        onLocationMouseOver?: (event: any) => void;
        onLocationMouseOut?: (event: any) => void;
        onLocationMouseMove?: (event: any) => void;
        onLocationClick?: (event: any) => void;
        onLocationKeyDown?: (event: any) => void;
        onLocationFocus?: (event: any) => void;
        onLocationBlur?: (event: any) => void;
        isLocationSelected?: (location: any, index: number) => boolean;
    }

    export class SVGMap extends React.Component<SVGMapProps> { }
    export class CheckboxSVGMap extends React.Component<SVGMapProps> { }
    export class RadioSVGMap extends React.Component<SVGMapProps> { }
}

declare module '@svg-maps/japan' {
    const Japan: any;
    export default Japan;
}
