//@ts-nocheck
import getSuspender from './getSuspender';

function fetchData(url) {
  const promise = fetch(url).then((res) => res.json());

  return getSuspender(promise);
}

export default fetchData;
