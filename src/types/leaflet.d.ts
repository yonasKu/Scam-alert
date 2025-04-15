/* Type declarations for Leaflet and react-leaflet */
declare module 'leaflet' {
  export interface MapOptions {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
  }
  
  export class Icon {
    constructor(options: any);
    
    static Default: {
      prototype: {
        _getIconUrl?: any;
      };
      mergeOptions(options: any): void;
    };
  }
}

declare module 'react-leaflet' {
  import { ReactNode, RefAttributes } from 'react';
  import * as L from 'leaflet';
  
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    children?: ReactNode;
  }
  
  export interface TileLayerProps {
    attribution: string;
    url: string;
  }
  
  export interface MarkerProps {
    position: [number, number];
    icon?: L.Icon;
  }
  
  export interface PopupProps {
    children?: ReactNode;
  }
  
  export class MapContainer extends React.Component<MapContainerProps & RefAttributes<L.Map>> {}
  export class TileLayer extends React.Component<TileLayerProps & RefAttributes<L.TileLayer>> {}
  export class Marker extends React.Component<MarkerProps & RefAttributes<L.Marker>> {}
  export class Popup extends React.Component<PopupProps & RefAttributes<L.Popup>> {}
}
