import { describe, expect, test } from '@jest/globals';
import { bytesToHex } from '@noble/hashes/utils';
import { InvalidOperation } from '@vechain/sdk-errors';
import { blake2b256, Blake2b256, Hex } from '../../src';
import { CONTENT, NO_CONTENT } from './fixture';

// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_BLAKE2B256 = Hex.of(
    '0x6a908bb80109908919c0bf5d0594c890700dd46acc097f9f28bfc85a0a2e6c0c'
);

// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_BLAKE2B256 = Hex.of(
    '0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8'
);

/**
 * Test Blake2b256 class.
 * @group unit/hash
 */
describe('Blake2b256 class tests', () => {
    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = Blake2b256.of(255n);
            const ofBytes = Blake2b256.of(Uint8Array.of(255));
            const ofHex = Blake2b256.of('0xff');
            const ofN = Blake2b256.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });

    test('Return hash for content', () => {
        const hash = Blake2b256.of(CONTENT);
        expect(hash.isEqual(CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Return hash for no content', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const hash = Blake2b256.of(NO_CONTENT);
        expect(hash.isEqual(NO_CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Blake2b256.of('0xfoe')).toThrow(InvalidOperation);
    });
});
describe('Backwards compatibility tests', () => {
    test('Should return the hash as hex', () => {
        const rawString = 'Hello, World!';
        const hash = blake2b256(rawString, 'hex');
        expect(hash).toBe(
            '0x511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03'
        );
    });
    test('Should return the hash as buffer', () => {
        const rawString = 'Hello, World!';
        const hash = blake2b256(rawString) as Uint8Array;
        expect(bytesToHex(hash)).toBe(
            '511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03'
        );
    });
});
