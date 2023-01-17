import {describe, expect, test, jest} from '@jest/globals';
import axios from 'axios';
import { Outage } from '../src/models/outage';
import { Helper } from '../src/services/helper';

const outages = [
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2021-07-26T17:09:31.036Z",
    "end": "2021-08-29T00:37:42.253Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2022-05-23T12:21:27.377Z",
    "end": "2022-11-13T02:16:38.905Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2022-12-04T09:59:33.628Z",
    "end": "2022-12-12T22:35:13.815Z"
  },
  {
    "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  },
  {
    "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  },
  {
    "id": "27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1",
    "begin": "2021-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  }
];

const site = {
  "id": "kingfisher",
  "name": "KingFisher",
  "devices": [
    {
      "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
      "name": "Battery 1"
    },
    {
      "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
      "name": "Battery 2"
    }
  ]
};

const expectedResults = [
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "name": "Battery 1",
    "begin": "2022-05-23T12:21:27.377Z",
    "end": "2022-11-13T02:16:38.905Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "name": "Battery 1",
    "begin": "2022-12-04T09:59:33.628Z",
    "end": "2022-12-12T22:35:13.815Z"
  },
  {
    "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
    "name": "Battery 2",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  }
];

const outageBefore2022 = [
  new Outage("086b0d53-b311-4441-aaf3-935646f03d4d", new Date("2021-07-12T16:31:47.254Z"), new Date("2022-10-13T04:05:10.044Z"))
];

const outagesAt2022 = [
  new Outage("086b0d53-b311-4441-aaf3-935646f03d", new Date("2022-01-01T00:00:00.000Z"), new Date("2022-10-13T04:05:10.044Z"))
];

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockImplementation((url) : Promise<any> => {
  switch(url) {
    case '/outages':
      return Promise.resolve({data: outages});
    case '/site-info/kingfisher':
      return Promise.resolve({data: site});
    default:
      return Promise.resolve(null);
  }
});

describe('KrakenFlex Unit Tests', () => {
  test('KingFisher complete test', () => {
    const helper = new Helper(mockedAxios);
    helper.getSiteInfo('kingfisher').then(npt => {
      helper.getOutages().then(outageList => {
        const filteredOutages = outageList.filter(outage => helper.filterByDate(outage, new Date("2022-01-01")))
                .filter(outage => helper.filterById(outage, npt.devices));
        filteredOutages.forEach(outage => {
          helper.attachDisplayName(outage, npt.devices)
        });
        expect(filteredOutages).toStrictEqual(expectedResults);
      });
    });
  });

  test('KingFisher getSite call', () => {
    const helper = new Helper(mockedAxios);
    helper.getSiteInfo('kingfisher').then(npt => {
    expect(npt.name).toStrictEqual(site.name);
    expect(npt.devices).toStrictEqual(site.devices);
    expect(npt.id).toStrictEqual(site.id);
    });
  });

  test('KingFisher getOutages call', () => {
    const helper = new Helper(mockedAxios);
    helper.getOutages().then(outageList => {
      expect(outageList.length).toEqual(outages.length);
    });
  });

  test('KingFisher filter outages before 2022', () => {
    const helper = new Helper(mockedAxios);
    const filteredOutages = outageBefore2022.filter(outage => helper.filterByDate(outage, new Date("2022-01-01")));
    expect(filteredOutages.length).toEqual(0);
  });

  test('KingFisher filter outages at 2022', () => {
    const helper = new Helper(mockedAxios);
    const filteredOutages = outagesAt2022.filter(outage => helper.filterByDate(outage, new Date("2022-01-01")));
    expect(filteredOutages.length).toEqual(1);
  });

  test('KingFisher filter outages with id present in device list', () => {
    const helper = new Helper(mockedAxios);
    const filteredOutages = outageBefore2022.filter(outage => helper.filterById(outage, site.devices));
    expect(filteredOutages.length).toEqual(1);
  });

  test('KingFisher filter outages with id not present in device list', () => {
    const helper = new Helper(mockedAxios);
    const filteredOutages = outagesAt2022.filter(outage => helper.filterById(outage, site.devices));
    expect(filteredOutages.length).toEqual(0);
  });
});