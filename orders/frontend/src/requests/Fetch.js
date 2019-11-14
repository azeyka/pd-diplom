export default function Fetch(onSucsess, onFail, url, params) {
  fetch(process.env.REACT_APP_API_URL.concat(url), params)
    .then(response => {
      if (200 <= response.status && response.status < 300) {
        return response.json();
      } else {
        throw new Error(
          `Ошибка ${response.status}! Попробуйте снова через некоторое время.`
        );
      }
    })
    .then(result => {
      result.Status ? onSucsess(result.Info) : onFail(result.Errors);
    })
    .catch(err => onFail(err));
}
