
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({

    // This is only relevant for running the web app locally which needs key
    // for authentication in making connections with GCP 

    // This is the path to my key
    keyFilename: '../nextjs_agent_key.json',
});

const bucketName = "run-sources-medtax-ocr-prototype-us-central1"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ message: "Only POST method is allowed" });
    }

    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
        return res.status(400).json({ message: 'Missing fileName or contentType' });
    }

    const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  };

    const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

    console.log("Generated signed URL:", url);

    if (!url) {
        return res.status(500).json({ message: 'Failed to generate upload URL' });
    }
    return res.status(200).json({ url });

}

