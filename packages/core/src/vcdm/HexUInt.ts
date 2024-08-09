import { ErrorInterceptor, InvalidDataType } from '@vechain/sdk-errors';
import { Hex } from './Hex';
import { HexInt } from './HexInt';

/**
 * Represents a hexadecimal unsigned integer.
 *
 * @extends HexInt
 */
class HexUInt extends HexInt {
    /**
     * Creates a new instance of this class to represent the absolute `hi` value.
     *
     * @param {HexInt} hi - The HexInt object representing the hexadecimal value.
     *
     * @throws {InvalidDataType} Throws an error if the sign of hi is not positive.
     */
    protected constructor(hi: HexInt) {
        if (hi.sign >= Hex.POSITIVE) {
            super(hi);
        } else {
            throw new InvalidDataType('HexUInt.constructor', 'not positive', {
                hi
            });
        }
    }

    /**
     * Create a HexUInt instance from the given expression interprete as an unsigned integer.
     *
     * @param exp The expression to convert. It can be of type bigint, number, string, Uint8Array, or HexInt.
     *
     * @returns {HexUInt} The converted hexadecimal unsigned integer.
     *
     * @throws {InvalidDataType} If the given expression is not a valid hexadecimal positive integer expression.
     */
    @ErrorInterceptor('not a valid hexadecimal unsigned integer expression')
    public static of(
        exp: bigint | number | string | Uint8Array | HexInt
    ): HexUInt {
        return new HexUInt(HexInt.of(exp));
    }
}

export { HexUInt };
