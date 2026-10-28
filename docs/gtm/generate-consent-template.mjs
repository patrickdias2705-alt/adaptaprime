import { writeFileSync } from "node:fs";

const types = ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"];
const string = value => ({ type: 1, string: value });
const bool = value => ({ type: 8, boolean: value });
const row = values => ({ type: 3, mapKey: Object.keys(values).map(string), mapValue: Object.values(values).map(value => typeof value === "boolean" ? bool(value) : string(value)) });
const permission = (publicId, key, listItem) => ({
  instance: { key: { publicId, versionId: "1" }, param: [{ key, value: { type: 2, listItem } }] },
  clientAnnotations: { isEditedByUser: true }, isRequired: true,
});
const code = `const setDefaultConsentState = require('setDefaultConsentState');
const updateConsentState = require('updateConsentState');
const callInWindow = require('callInWindow');

setDefaultConsentState({
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});

callInWindow('adaptaConsentSubscribe', function(state) {
  updateConsentState({
    analytics_storage: state.analytics_storage === 'granted' ? 'granted' : 'denied',
    ad_storage: state.ad_storage === 'granted' ? 'granted' : 'denied',
    ad_user_data: state.ad_user_data === 'granted' ? 'granted' : 'denied',
    ad_personalization: 'denied'
  });
  callInWindow('adaptaConsentReady');
});
data.gtmOnSuccess();`;

const sections = {
  INFO: { type: "TAG", id: "cvt_ADAPTA_CONSENT", version: 1, displayName: "Adapta Prime — consentimento",
    description: "Conecta as escolhas do site às APIs nativas de Consent Mode v2. Usar em Consent Initialization — All Pages.", containerContexts: ["WEB"], securityGroups: [] },
  TEMPLATE_PARAMETERS: [],
  SANDBOXED_JS_FOR_WEB_TEMPLATE: code,
  WEB_PERMISSIONS: [
    permission("access_consent", "consentTypes", types.map(consentType => row({ consentType, read: false, write: true }))),
    permission("access_globals", "keys", ["adaptaConsentSubscribe", "adaptaConsentReady"].map(key => row({ key, read: false, write: false, execute: true }))),
  ],
  TESTS: { scenarios: [] },
};

const output = Object.entries(sections).map(([name, value]) => `___${name}___\n\n${typeof value === "string" ? value : JSON.stringify(value, null, 2)}`).join("\n\n");
writeFileSync(new URL("consent-template.tpl", import.meta.url), output + "\n");
console.log("Template Adapta Prime gerado.");
