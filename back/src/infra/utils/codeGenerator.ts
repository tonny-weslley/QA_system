/**
 * Gera um código alfanumérico único de 5 caracteres
 * Caracteres permitidos: A-Z, a-z, 0-9 (case-sensitive)
 */
export class CodeGenerator {
  private static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private static readonly CODE_LENGTH = 5;

  /**
   * Gera um código aleatório de 5 caracteres
   */
  static generate(): string {
    let code = '';
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARACTERS.length);
      code += this.CHARACTERS[randomIndex];
    }
    return code;
  }

  /**
   * Valida se um código tem o formato correto
   */
  static isValid(code: string): boolean {
    if (!code || code.length !== this.CODE_LENGTH) {
      return false;
    }
    
    // Verifica se todos os caracteres são alfanuméricos
    const regex = /^[A-Za-z0-9]{5}$/;
    return regex.test(code);
  }
}
