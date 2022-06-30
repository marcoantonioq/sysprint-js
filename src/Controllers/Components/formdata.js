const { v4: uuidv4 } = require('uuid');

function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

/**
 * Build dados jon para formulário
 * @param {FormData} formData Formulário
 * @param {JSON} data Json com dados
 * @param {string} parentKey Chave
 */
export function buildFormData(formData, data, parentKey) {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey, value);
  }
}

/**
 * JSON para FormData
 * @param {*} data JSON
 * @return FormData
 */
export function jsonToFormData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

/**
 * Upload de arquivos
 * @param {Array} files Arquivos[]
 * @param {String} path Pasta destino (Default: upload/)
 */
export function upLoadFiles({ files }, res) {
  console.log(files);
  if (!files) {
    throw new UserException('Sem arquivos!');
  }
  Object.keys(files).forEach((key) => {
    const file = files[key];
    const filename = uuidv4(file.name);
    const ext = file.mimetype.split('/')[1];
    file.mv(`upload/${filename}.${ext}`);
  });
}

export default {
  buildFormData,
  jsonToFormData,
  upLoadFiles,
};
