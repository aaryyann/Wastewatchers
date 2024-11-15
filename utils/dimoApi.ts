const DUMMY_DATA = {
    devices: [{ id: 'dummy-device-id' }],
    vehicleStatus: {
      vin: 'DUMMY1234567890',
      make: 'DIMO',
      model: 'EcoSaver',
      year: 2023,
      odometer: 15000,
      fuelPercentRemaining: 0.75,
    },
    trips: {
      trips: [
        { averageSpeed: 55 },
        { averageSpeed: 65 },
        { averageSpeed: 50 },
      ],
    },
  };
  
  async function fetchDimoApi(action: string, tokenId?: string) {
    try {
      const response = await fetch(`/api/dimo?action=${action}&tokenId=${tokenId || ''}`);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch DIMO data (${action}):`, error);
      return null;
    }
  }
  
  export async function getUserDevices() {
    const result = await fetchDimoApi('getUserDevices');
    return result || DUMMY_DATA.devices;
  }
  
  export async function getDeviceData(tokenId: string) {
    const result = await fetchDimoApi('getDeviceData', tokenId);
    return result || DUMMY_DATA.vehicleStatus;
  }
  
  export async function getDeviceTrips(tokenId: string) {
    const result = await fetchDimoApi('getDeviceTrips', tokenId);
    return result || DUMMY_DATA.trips;
  }