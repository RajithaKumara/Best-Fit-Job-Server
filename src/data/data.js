//define application data
const redirectURL = "<frontend root URL>";
const mailerURL = "<php mail server URL>";
const mailerKey = "<mail server auth key>";
const jwtSecretKeySign = "<Secret Key1>";
const jwtSecretKeyAuth = "<Secret Key2>";

const dictionaryURL = "https://od-api.oxforddictionaries.com:443/api/v1/entries/en/";
const dictionaryAppId = process.env.DIC_APP_ID;//"<Api id>"
const dictionaryAppKey = process.env.DIC_APP_KEY;//"<Api app key>"

const googleLanguageApiURL = "https://language.googleapis.com/v1/documents";
const googleLanguageApiKey = process.env.NLP_API_KEY;//"<Api key>"

const defaultCluster = "/Jobs & Education/Jobs";

//export application data
module.exports = {
  redirectURL,
  mailerURL,
  mailerKey,
  jwtSecretKeySign,
  jwtSecretKeyAuth,
  dictionaryURL,
  dictionaryAppId,
  dictionaryAppKey,
  googleLanguageApiURL,
  googleLanguageApiKey,
  defaultCluster
}