import React, { useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/url/dist/style.css';
import GoogleDrive from '@uppy/google-drive';
import Dropbox from '@uppy/dropbox';
import Transloadit from '@uppy/transloadit';

const UPPY_TRANSLOADIT_CREDS = {
  templateId: "",
  key: "",
  notifyUrl: "https://api-contentV6.learnyst.com/webhook/v1/transloadit",
};

function createUppy(param) {
  return (
    new Uppy({ autoProceed: true, meta: { params: param } })
      .use(Transloadit, {
        id: 'transloaditUploader',
        async assemblyOptions(file) {
          const response = await fetch(
            'https://api.learnyst.com/learnyst/content_uploader',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              },
              /* Params should be same for signature create and transloadit upload */
              body: JSON.stringify(file.meta.params),
            }
          );
          const res = response.json();
          return res;
        },
      })
      .use(GoogleDrive, {
        companionUrl: Transloadit.COMPANION,
        companionAllowedHosts: Transloadit.COMPANION_PATTERN,
      })
      .use(Dropbox, {
        companionUrl: Transloadit.COMPANION,
        companionAllowedHosts: Transloadit.COMPANION_PATTERN,
      })
      // .on("complete", () => {
      //   // const { successful, transloadit, uploadID, failed } = assembly;

      //   console.log("::::On UPLOAD COMPLETE::::");
      // })
      .on('error', (error) => {
        console.error(' Uploader ERROR :: ', error, error.stack);
      })
  );
}

const App = () => {
  let params = {
    auth: {
      key: UPPY_TRANSLOADIT_CREDS.key,
    },
    template_id: UPPY_TRANSLOADIT_CREDS.templateId,
    notify_url: UPPY_TRANSLOADIT_CREDS.notifyUrl,
    token: '',
    upload_type: 1,
    fields: {
      path: 'new/path',
    },
  };
  const [uppy] = useState(() => createUppy(params));
  return (
    <div>
      <Dashboard
        uppy={uppy}
        // width="100%"
        // disableLocalFiles={true}
        proudlyDisplayPoweredByUppy={false}
        plugins={['GoogleDrive', 'Dropbox']}
        autoOpenFileEditor
      />
    </div>
  );
};

export default App;
