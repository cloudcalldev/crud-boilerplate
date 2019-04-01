export interface IGraphiteController {
    write(activityType: string, error?: boolean): void;
    writeTiming(activityType: string, time: Date): void;
}
