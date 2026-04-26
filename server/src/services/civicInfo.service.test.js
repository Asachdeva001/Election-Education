const axios = require('axios');
const civicInfoService = require('./civicInfo.service');
const { CivicApiError } = require('../utils/errors');

jest.mock('axios');

describe('Civic Information Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, CIVIC_INFO_API_KEY: 'test-api-key' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getElections', () => {
    it('should successfully fetch return elections', async () => {
      const mockData = { elections: [{ id: '2000', name: 'VIP Test Election' }] };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await civicInfoService.getElections();

      expect(axios.get).toHaveBeenCalledWith(
        'https://civicinfo.googleapis.com/civicinfo/v2/elections',
        { params: { key: 'test-api-key' } }
      );
      expect(result).toEqual(mockData.elections);
    });

    it('should throw CivicApiError when API key is missing', async () => {
      delete process.env.CIVIC_INFO_API_KEY;

      await expect(civicInfoService.getElections()).rejects.toThrow(CivicApiError);
    });
  });

  describe('getVoterInfo', () => {
    const mockAddress = '1263 Pacific Ave. Kansas City KS';

    it('should throw CivicApiError when address is null', async () => {
      await expect(civicInfoService.getVoterInfo(null)).rejects.toThrow(CivicApiError);
      await expect(civicInfoService.getVoterInfo('')).rejects.toThrow(CivicApiError);
    });

    it('should fetch voter information (zero-PII compliance behavior)', async () => {
      const mockResponse = {
        data: {
          pollingLocations: [{ address: { locationName: 'Main Library' } }],
          earlyVoteSites: [],
          contests: [{ type: 'General' }],
          state: [{ name: 'Kansas' }]
        }
      };
      
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await civicInfoService.getVoterInfo(mockAddress);

      expect(axios.get).toHaveBeenCalledWith(
        'https://civicinfo.googleapis.com/civicinfo/v2/voterinfo',
        expect.objectContaining({
          params: { key: 'test-api-key', address: mockAddress }
        })
      );

      // Verify that the data returned shapes correctly without retaining raw, potentially sensitive extra fields.
      expect(result.pollingLocations.length).toBe(1);
      expect(result.state[0].name).toBe('Kansas');
    });
  });
});
