import bcrypt from 'bcrypt';

/**
 * A helper class for generating and verifying hashes using bcrypt.
 */
export default class HashHelper {

  static async generateHash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, 10);
  }

  static async verifyHash(plainText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  }
}
