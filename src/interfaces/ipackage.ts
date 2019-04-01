export interface IPackage {
    name: string;
    version: string;
    description?: string;
    main?: string;
    scripts?: Array<{
        [key: string]: string;
    }>;
    author?: string;
    license?: string;
}
