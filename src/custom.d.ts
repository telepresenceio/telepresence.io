declare module "*.svg" {
    import {FunctionComponent, SVGAttributes} from "react";
    const content: FunctionComponent<SVGAttributes<SVGElement>>;
    export default content;
}

declare module "*.png" {
    const value: any;
    export = value;
}
