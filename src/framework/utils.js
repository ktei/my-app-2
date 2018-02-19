export function statusCodeToError(statusCode) {
  if (statusCode === 200) {
    return '';
  }
  if (statusCode === 404) {
    return 'No such record was found : (';
  }
  return 'Oops, there was an error : (';
}
