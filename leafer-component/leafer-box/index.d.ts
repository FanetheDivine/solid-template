type LeaferBoxProps = {
    text: string;
};
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'leafer-box': LeaferBoxProps;
        }
    }
}
export {};
