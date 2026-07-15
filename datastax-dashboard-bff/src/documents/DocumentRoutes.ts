import axios from 'axios';
import https from 'https';
import { Request, Response, Router } from 'express';

interface DocumentRequestBody {
  requestConfigurationDetails: {
    url: string;
    headerName: string;
    headerValue: string;
  };
  requestBody: any;
}

const documentRouter = Router();

documentRouter.post('/api/documents', async (req: Request<unknown, unknown, DocumentRequestBody>, res: Response) => {
  const { requestConfigurationDetails, requestBody } = req.body;

  if (
    !requestConfigurationDetails ||
    !requestConfigurationDetails.url ||
    !requestConfigurationDetails.headerName ||
    !requestConfigurationDetails.headerValue
  ) {
    return res.status(400).json({
      message: 'requestConfigurationDetails.url, headerName, and headerValue are required'
    });
  }

  try {
    const agent = requestConfigurationDetails.url.startsWith('https')
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const response = await axios.post(requestConfigurationDetails.url, requestBody, {
      headers: {
        [requestConfigurationDetails.headerName]: requestConfigurationDetails.headerValue
      },
      httpsAgent: agent
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: 'Failed to process document request',
        error: error.response?.data || error.message
      });
    }

    return res.status(500).json({
      message: 'Unexpected server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default documentRouter;
