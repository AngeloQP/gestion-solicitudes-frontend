/**
 * Valida un número de teléfono para asegurarse de que contiene solo dígitos numéricos
 * y no exceda los 9 caracteres.
 * @param {string} telefono - El número de teléfono a validar.
 * @returns {boolean} - Retorna `true` si el número de teléfono es válido, `false` en caso contrario.
 */
export const validateTelefono = (telefono) => {
    const telefonoRegex = /^[0-9]{0,9}$/;
    return telefonoRegex.test(telefono);
};
