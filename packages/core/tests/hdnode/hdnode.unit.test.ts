import { describe, expect, test } from '@jest/globals';
import {
    InvalidHDNode,
    InvalidHDNodeMnemonic,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import {
    Address,
    HDNode,
    mnemonic,
    secp256k1,
    type WordlistSizeType,
    ZERO_BYTES
} from '../../src';
import { addresses, words, wrongDerivationPath, wrongWords } from './fixture';

/**
 * Mnemonic tests
 * @group unit/hdnode
 */
describe('HDNode', () => {
    describe('fromMnemonic', () => {
        test('fromMnemonic - invalid - path', () => {
            expect(() =>
                HDNode.fromMnemonic(words, wrongDerivationPath)
            ).toThrowError(InvalidHDNode);
        });

        test('fromMnemonic - invalid - word list', () => {
            expect(() => HDNode.fromMnemonic(wrongWords)).toThrowError(
                InvalidHDNodeMnemonic
            );
        });

        test('fromMnemonic - invalid - word list leak check', () => {
            const words =
                'denial pet squirrel other broom bar gas better priority spoil cross'.split(
                    ' '
                );
            try {
                HDNode.fromMnemonic(words);
                expect(true).toBeFalsy();
            } catch (error) {
                (error as Error)
                    .toString()
                    .split(' ')
                    .forEach((word) => {
                        expect(words.includes(word)).toBeFalsy();
                    });
            }
        });

        test('fromMnemonic - valid - address sequence', () => {
            const root = HDNode.fromMnemonic(words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.publicKey).toBeDefined();
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(addresses[i]);
                // do we need <child>.address?
            }
        });

        test('fromMnemonic - valid - public key sequence', () => {
            const root = HDNode.fromMnemonic(words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });

        test('fromMnemonic - valid - word list - case insensitive', () => {
            const reference = HDNode.fromMnemonic(words);
            expect(reference.publicKey).toBeDefined();
            const lowercase = HDNode.fromMnemonic(
                words.map((w) => w.toLowerCase())
            );
            expect(lowercase.publicKey).toBeDefined();
            expect(
                Address.ofPublicKey(
                    lowercase.publicKey as Uint8Array
                ).toString()
            ).toBe(
                Address.ofPublicKey(
                    reference.publicKey as Uint8Array
                ).toString()
            );
            const uppercase = HDNode.fromMnemonic(
                words.map((w) => w.toUpperCase())
            );
            expect(uppercase.publicKey).toBeDefined();
            expect(
                Address.ofPublicKey(
                    uppercase.publicKey as Uint8Array
                ).toString()
            ).toBe(
                Address.ofPublicKey(
                    reference.publicKey as Uint8Array
                ).toString()
            );
        });

        test('fromMnemonic - valid - word list - multiple lengths', () => {
            new Array<WordlistSizeType>(12, 15, 18, 21, 24).forEach(
                (length: WordlistSizeType) => {
                    const hdKey = HDNode.fromMnemonic(
                        mnemonic.generate(length)
                    );
                    expect(hdKey.privateKey).toBeDefined();
                    expect(
                        secp256k1.isValidPrivateKey(
                            hdKey.privateKey as Uint8Array
                        )
                    ).toBeTruthy();
                    expect(hdKey.publicKey).toBeDefined();
                    expect(hdKey.publicKey).toEqual(
                        secp256k1.derivePublicKey(
                            hdKey.privateKey as Uint8Array
                        )
                    );
                }
            );
        });
    });

    describe('derivePrivateKey', () => {
        test('derivePrivateKey - invalid - chain code', () => {
            expect(() =>
                HDNode.fromPrivateKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('derivePrivateKey - invalid - private key', () => {
            expect(() =>
                HDNode.fromPrivateKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('derivePrivateKey - valid - address sequence', () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(addresses[i]);
            }
        });

        test('derivePrivateKey - valid - public key sequence', () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });
    });

    describe('derivePublicKey', () => {
        test('derivePublicKey - invalid - chain code', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(InvalidHDNode);
        });

        test('derivePublicKey - invalid - public key', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(InvalidHDNode);
        });

        test(`derivePublicKey - valid - address sequence, no private key`, () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.publicKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPublicKey(
                root.publicKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeNull();
                expect(child.publicKey).toBeDefined();
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(addresses[i]);
            }
        });
    });
});
