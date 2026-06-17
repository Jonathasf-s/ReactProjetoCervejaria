export function gerarIdUnico() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Valida se um ID foi gerado corretamente
 */
export function isIdValido(id) {
  return typeof id === 'string' && id.includes('_') && !isNaN(parseInt(id.split('_')[0]));
}