import { keccak_256 as nh_keccak_256 } from '@noble/hashes/sha3';
import { InvalidOperation } from '@vechain/sdk-errors';
import { Hex, HexUInt, Txt, type Hash } from '../vcdm';

/**
 * Represents the result of an [SHA-3](https://en.wikipedia.org/wiki/SHA-3) [KECCAK 256](https://keccak.team/keccak.html) hash operation.
 *
 * @extends HexUInt
 * @implements Hash
 */
class Keccak256 extends HexUInt implements Hash {
    /**
     * Generates the [SHA-3](https://en.wikipedia.org/wiki/SHA-3) [KECCAK 256](https://keccak.team/keccak.html) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [KECCAK 256](https://keccak.team/keccak.html) hash of the input value.
     *
     * @throws {InvalidOperation} - If a hash error occurs.
     *
     * @remark Security auditable method, depends on
     * * [`nh_keccak_256`](https://github.com/paulmillr/noble-hashes#sha3-fips-shake-keccak).
     */
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Keccak256 {
        try {
            const hash = nh_keccak_256(HexUInt.of(exp).bytes);
            return new Keccak256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new InvalidOperation('Keccak256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

// Backwards compatibility, remove in future release #1184

const keccak256 = (
    hex: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnType: 'buffer' | 'hex' = 'buffer'
): string | Uint8Array =>
    returnType === 'buffer'
        ? Keccak256.of(Txt.of(hex).bytes).bytes
        : Keccak256.of(Txt.of(hex).bytes).toString();

export { Keccak256, keccak256 };
