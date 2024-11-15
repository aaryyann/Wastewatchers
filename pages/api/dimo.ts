import { NextApiRequest, NextApiResponse } from 'next';
import {DIMO} from '@dimo-network/dimo-node-sdk';

const dimo = new DIMO('Dev');

const CLIENT_ID = process.env.DIMO_CLIENT_ID;
const DOMAIN = process.env.DIMO_DOMAIN;
const PRIVATE_KEY = process.env.DIMO_PRIVATE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, tokenId } = req.query;

  try {
    const auth = await dimo.auth.getToken({
      client_id: CLIENT_ID,
      domain: DOMAIN,
      private_key: PRIVATE_KEY,
    });

    let result;
    switch (action) {
      case 'getUserDevices':
        result = await dimo.user.get(auth);
        break;
      case 'getDeviceData':
        const privToken = await dimo.tokenexchange.exchange({
          ...auth,
          privileges: [1],
          tokenId: tokenId as string,
        });
        result = await dimo.devicedata.getVehicleStatus({
          ...privToken,
          tokenId: tokenId as string,
        });
        break;
      case 'getDeviceTrips':
        const tripPrivToken = await dimo.tokenexchange.exchange({
          ...auth,
          privileges: [4],
          tokenId: tokenId as string,
        });
        result = await dimo.trips.list({
          ...tripPrivToken,
          tokenId: tokenId as string,
        });
        break;
      default:
        throw new Error('Invalid action');
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('DIMO API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}