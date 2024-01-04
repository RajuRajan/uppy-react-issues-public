import React from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/url/dist/style.css";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";
import Transloadit from "@uppy/transloadit";
import ImageEditor from "@uppy/image-editor";
const API_URLS = {
  CONTENT_UPLOADER: "https://api.learnyst.com/learnyst/content_uploader",
};

const UPPY_TRANSLOADIT_CREDS = {
  templateId: "",
  key: "",
  notifyUrl: "https://api.learnyst.com/webhook/v1/transloadit",
};

const getSignature = () => {
  /* Params should be same for signature create and transloadit upload */
  let params = {
    auth: {
      key: UPPY_TRANSLOADIT_CREDS.key,
    },
    template_id: UPPY_TRANSLOADIT_CREDS.templateId,
    notify_url: UPPY_TRANSLOADIT_CREDS.notifyUrl,
    token: "",
    upload_type: 1,
    fields: {
      path: "new/path",
    },
  };

  let signatureData = { signature: "", expiration: "" };

  const data101 = fetch(API_URLS.CONTENT_UPLOADER, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("DATATATATATATATATTTATATA-=========", data);
      signatureData = {
        ...signatureData,
        signature: data.signature,
        expiration: data.expires,
      };
      return signatureData;
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(":: ==== Uppy Signature Fetch Error === ::", error);
    });
  return data101;
};

const App = () => {
  const [sigData, setSigData] = React.useState(null);
  const uppy = React.useMemo(() => {
    /* Params should be same for signature create and transloadit upload along with expiration and signature */
    const param = {
      auth: {
        key: UPPY_TRANSLOADIT_CREDS.key,
        expires: sigData?.expiration,
      },
      template_id: UPPY_TRANSLOADIT_CREDS.templateId,
      notify_url: UPPY_TRANSLOADIT_CREDS.notifyUrl,
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJsZXNzb25faWQiOjI3MDE2NjYsImNvdXJzZV9pZCI6MTcxMjA2LCJ1aWQiOjU2MTk4Nywic2lkIjozOTEzLCJyb2xlX2lkIjoyLCJleHAiOjE3MDIxODk5MjB9.PsG0v0By-RHUN0973SQhktsZib4CZyKPSKdxvklnjKs",
      upload_type: 1,
      fields: {
        path: "new/path",
      },
    };

    return new Uppy({ autoProceed: true })
      .use(Transloadit, {
        id: "transloaditUploader",
        params: param,
        signature: sigData?.signature,
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
      .on("error", (error) => {
        console.error(" Uploader ERROR :: ", error, error.stack);
      });    
  }, [sigData?.signature]);

  React.useEffect(() => {
    const getSigData = async () => {
      const result = await getSignature();
      console.log("result=====", result);
      setSigData(result);
    };
    getSigData();
  }, []);

  return (
    <div>
      <Dashboard
        uppy={uppy}
        // width="100%"
        // disableLocalFiles={true}
        proudlyDisplayPoweredByUppy={false}
        plugins={["GoogleDrive", "Dropbox"]}
        autoOpenFileEditor
      />
    </div>
  );
};

export default App;
