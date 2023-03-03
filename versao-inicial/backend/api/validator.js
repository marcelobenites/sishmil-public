module.exports = app =>{
    function existsOrError(value, msg){/**Teste de validacao de string*/
        if(!value) throw msg/**Valor e falso */
        if(Array.isArray(value) && value.length == 0) throw msg /**E um array vazio*/
        if(typeof value === 'string' && !value.trim()) throw msg /**Strings com espacos em branco */
    }

    function notExistsOrError(value, msg){/**Da erro caso value exista, contrario da anterior */
        try{
            existsOrError(value, msg)
        }catch(msg){/**Recebe a msg de erro e retorna sem erro */
            return 
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg){/**Verifica se dois valores sao iguais */
        if(valueA !== valueB) throw msg
    }

    /**TODO #1 */
    return {existsOrError, notExistsOrError, equalsOrError}
}