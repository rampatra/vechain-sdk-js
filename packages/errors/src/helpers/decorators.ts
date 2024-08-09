import { type ObjectErrorData, InvalidDataType } from '../errors';

/**
 * Error handler for Hex and its subclasses so we do not hide them.
 *
 * @param {unknown} subclassError - The error thrown by a subclass.
 * @param invalidDataTypeParams - The parameters to pass to the InvalidDataType constructor.
 * @throws {InvalidDataType} - Throws an error with the given message and data.
 */
const errorHandler = (
    subclassError: unknown,
    ...invalidDataTypeParams: [string, string, ObjectErrorData, unknown?]
): never => {
    if (subclassError instanceof InvalidDataType) {
        throw subclassError;
    }

    throw new InvalidDataType(...invalidDataTypeParams);
};

const ErrorInterceptor =
    (errorMessage: string) =>
    (
        target: unknown,
        methodName: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor => {
        const originalMethod = descriptor.value as (
            ...args: unknown[]
        ) => unknown;

        descriptor.value = function (...args: unknown[]) {
            try {
                return originalMethod.apply(target, args);
            } catch (error) {
                errorHandler(
                    error,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    `${target!.constructor.name}.${methodName}`,
                    errorMessage ?? '',
                    { args, error }
                );
            }
        };

        return descriptor;
    };

export { ErrorInterceptor };
