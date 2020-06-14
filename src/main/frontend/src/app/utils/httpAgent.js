import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import promise from 'promise'
const Promise = promise;
const superagent = superagentPromise(_superagent, Promise);

const handleErrors = async (err,apiRoot,apiVersion,nextParams) => {
    return err.response && err.response.body ? err.response.body : err;
};

const responseBody = (res, backParams) => {
  if(backParams) {
    return {...res.body, backParams} || {...JSON.parse(res.text), backParams}
  }else{
    return res.body || JSON.parse(res.text)
  }
};

const tokenPlugin = (req, header) => {
  if(header) {
    for(const key in header) {
      req.set(key, header[key]);
    }
  }
};

const getUrl = (apiRoot, url, apiVersion, version) => {
  if(/^http/.test(url)) {
    return url
  }
  return `${apiRoot}/${version ? version : apiVersion}${url}`
}

const requests = (apiRoot, apiVersion) => {
  return {
    get: (url,backParams, version, header) =>
      superagent
        .get(getUrl(apiRoot, url, apiVersion, version))
        .use((req) => {
          tokenPlugin(req, header)
        })
        .then(
          res =>responseBody(res,backParams),
          err => {
            const nextUrl = getUrl(apiRoot, url, apiVersion, version)
            const nextParams = {
              type: 'get',
              url: nextUrl,
              header,
              backParams
            }
            return handleErrors(err,apiRoot,apiVersion,nextParams).then(
              suc => suc,
              err => err
            )
          } // err
        ),//then
    post: (url, body, backParams, version, header) =>
      superagent
        .post(getUrl(apiRoot,url, apiVersion, version), body)
        .use((req) => {
          tokenPlugin(req, header)
        })
        .then(
          res =>responseBody(res,backParams),
          err => {
            const nextUrl = getUrl(apiRoot, url, apiVersion, version)
            const nextParams = {
              type: 'post',
              url: nextUrl,
              header,
              body,
              backParams
            }
            return handleErrors(err,apiRoot,apiVersion,nextParams).then(
              suc => suc,
              err => err
            )
          } // err
        ),//then
    kong: (body, query, backParams, version, header) =>
      superagent
        .post(getUrl(apiRoot, query && query === 'query'? '/kong/suite/proxy/queryForPage' : '/kong/suite/proxy', apiVersion, version), body)
        .use((req) => {
          tokenPlugin(req, header)
        })
        .then(
          res =>responseBody(res,backParams),
          err => {
            const nextUrl = getUrl(apiRoot, query && query === 'query'? '/kong/suite/proxy/queryForPage' : '/kong/suite/proxy', apiVersion, version)
            const nextParams = {
              type: 'post',
              url: nextUrl,
              header,
              body,
              backParams
            }
            return handleErrors(err,apiRoot,apiVersion,nextParams).then(
              suc => suc,
              err => err
            )
          } // err
        ),//then
  }
};

export default requests
