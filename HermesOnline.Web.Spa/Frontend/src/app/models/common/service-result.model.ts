export interface ServiceResult<T> {
    succeeded: boolean;
    resultObject: T;
    message: string;
}
