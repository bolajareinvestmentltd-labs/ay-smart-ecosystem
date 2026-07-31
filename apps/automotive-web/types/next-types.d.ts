declare module 'next' {
  export interface Metadata {}
  export interface Viewport {}
  export interface NextConfig {}
}

declare module 'next/font/google' {
  export function Geist(...args: any[]): any;
  export function Geist_Mono(...args: any[]): any;
}

declare module 'next/image' {
  export default function Image(props: any): any;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = import('next/dist/lib/metadata/types/metadata').ResolvingMetadata;
  export type ResolvingViewport = import('next/dist/lib/metadata/types/metadata').ResolvingViewport;
  export type Metadata = import('next/dist/lib/metadata/types/metadata').Metadata;
  export type Viewport = import('next/dist/lib/metadata/types/metadata').Viewport;
}
