import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { fail } from 'assert';
import { HexUInt } from '../../src';

/**
 * Test Txt class.
 * @group unit/vcdm
 */
describe('HexUInt class tests', () => {
    describe('Construction tests', () => {
        test('Return an HexUInt instance if the passed argument is positive', () => {
            const exp = '0xcaffee';
            const hi = HexUInt.of(exp);
            expect(hi).toBeInstanceOf(HexUInt);
        });

        test('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            try {
                HexUInt.of(exp);
                fail('should not reach here');
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidDataType);
                if (error instanceof InvalidDataType) {
                    expect(error.message).toBe(
                        `Method 'HexUInt.constructor' failed.\n-Reason: 'not positive'\n-Parameters: \n\t{"hi":"-0xcaffee"}\n-Internal error: \n\tNo internal error given`
                    );
                }
            }
        });
    });
});
