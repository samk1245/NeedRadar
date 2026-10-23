import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface LocalityItem {
  name: string;
  lat: number;
  lon: number;
}

export interface CityData {
  name: string;
  state: string;
  code?: string;
  lat: number;
  lon: number;
  zoom: number;
  landmark?: string;
  municipal_authority?: string;
  helpline?: string;
  ambulance?: string;
  police?: string;
  localities: LocalityItem[];
}

interface CityContextType {
  currentCity: string;
  setCity: (cityName: string) => void;
  cityData: CityData;
  availableCities: CityData[];
  loadingCities: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const DEFAULT_CITIES: CityData[] = [
  // SOUTH
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    code: 'BLR',
    lat: 12.9716,
    lon: 77.5946,
    zoom: 12,
    landmark: 'Vidhana Soudha & Cubbon Park',
    municipal_authority: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    helpline: '080-22660000 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Koramangala', lat: 12.9352, lon: 77.6245 },
      { name: 'HSR Layout', lat: 12.9121, lon: 77.6446 },
      { name: 'Indiranagar', lat: 12.9784, lon: 77.6408 },
      { name: 'Whitefield', lat: 12.9698, lon: 77.7500 },
      { name: 'Jayanagar', lat: 12.9308, lon: 77.5838 },
      { name: 'Electronic City', lat: 12.8399, lon: 77.6770 }
    ]
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    code: 'MAA',
    lat: 13.0827,
    lon: 80.2707,
    zoom: 12,
    landmark: 'Marina Beach & Ripon Building',
    municipal_authority: 'Greater Chennai Corporation (GCC)',
    helpline: '1913 / 044-25619206',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'T. Nagar', lat: 13.0418, lon: 80.2341 },
      { name: 'Adyar', lat: 13.0012, lon: 80.2565 },
      { name: 'Mylapore', lat: 13.0368, lon: 80.2676 },
      { name: 'Velachery', lat: 12.9815, lon: 80.2180 }
    ]
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    code: 'HYD',
    lat: 17.3850,
    lon: 78.4867,
    zoom: 12,
    landmark: 'Charminar & Cyberabad',
    municipal_authority: 'Greater Hyderabad Municipal Corporation (GHMC)',
    helpline: '040-21111111 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Banjara Hills', lat: 17.4156, lon: 78.4350 },
      { name: 'Hitec City', lat: 17.4435, lon: 78.3772 },
      { name: 'Gachibowli', lat: 17.4401, lon: 78.3489 },
      { name: 'Secunderabad', lat: 17.4399, lon: 78.4983 }
    ]
  },
  {
    name: 'Kochi',
    state: 'Kerala',
    code: 'COK',
    lat: 9.9312,
    lon: 76.2673,
    zoom: 12,
    landmark: 'Fort Kochi & Marine Drive Walkway',
    municipal_authority: 'Kochi Municipal Corporation (KMC)',
    helpline: '0484-2369007 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Fort Kochi', lat: 9.9658, lon: 76.2425 },
      { name: 'Marine Drive', lat: 9.9806, lon: 76.2758 },
      { name: 'Kaloor', lat: 9.9986, lon: 76.2952 },
      { name: 'Edappally', lat: 10.0246, lon: 76.3082 }
    ]
  },
  {
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    code: 'VTZ',
    lat: 17.6868,
    lon: 83.2185,
    zoom: 12,
    landmark: 'RK Beach & Kailasagiri',
    municipal_authority: 'Greater Visakhapatnam Municipal Corporation (GVMC)',
    helpline: '1800 425 0001 / 0891-2746400',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'RK Beach Road', lat: 17.7126, lon: 83.3182 },
      { name: 'MVP Colony', lat: 17.7441, lon: 83.3364 },
      { name: 'Gajuwaka', lat: 17.6934, lon: 83.2148 }
    ]
  },

  // NORTH
  {
    name: 'Delhi',
    state: 'National Capital Territory',
    code: 'DEL',
    lat: 28.6139,
    lon: 77.2090,
    zoom: 11,
    landmark: 'India Gate & Connaught Place',
    municipal_authority: 'Municipal Corporation of Delhi (MCD)',
    helpline: '155305 / 011-23220010',
    ambulance: '102 / 108',
    police: '112',
    localities: [
      { name: 'Connaught Place', lat: 28.6315, lon: 77.2167 },
      { name: 'Lajpat Nagar', lat: 28.5677, lon: 77.2433 },
      { name: 'Rohini', lat: 28.7166, lon: 77.1136 },
      { name: 'Dwarka', lat: 28.5921, lon: 77.0460 }
    ]
  },
  {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    code: 'LKO',
    lat: 26.8467,
    lon: 80.9462,
    zoom: 12,
    landmark: 'Rumi Darwaza & Hazratganj',
    municipal_authority: 'Lucknow Municipal Corporation (LMC)',
    helpline: '0522-2622080 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Hazratganj', lat: 26.8532, lon: 80.9472 },
      { name: 'Gomti Nagar', lat: 26.8504, lon: 81.0006 },
      { name: 'Aliganj', lat: 26.8925, lon: 80.9392 },
      { name: 'Charbagh', lat: 26.8289, lon: 80.9231 }
    ]
  },
  {
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    code: 'PRG',
    lat: 25.4358,
    lon: 81.8463,
    zoom: 12,
    landmark: 'Triveni Sangam & Anand Bhavan',
    municipal_authority: 'Prayagraj Nagar Nigam (PNN)',
    helpline: '0532-2407555 / 1920',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Civil Lines', lat: 25.4526, lon: 81.8344 },
      { name: 'Katra', lat: 25.4601, lon: 81.8569 },
      { name: 'Daraganj', lat: 25.4326, lon: 81.8789 }
    ]
  },
  {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    code: 'KNP',
    lat: 26.4499,
    lon: 80.3319,
    zoom: 12,
    landmark: 'JK Temple & Industrial Hub',
    municipal_authority: 'Kanpur Nagar Nigam (KNN)',
    helpline: '0512-2556488 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Civil Lines', lat: 26.4735, lon: 80.3496 },
      { name: 'Swaroop Nagar', lat: 26.4805, lon: 80.3156 },
      { name: 'Kakadeo', lat: 26.4789, lon: 80.2925 }
    ]
  },
  {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    code: 'VNS',
    lat: 25.3176,
    lon: 82.9739,
    zoom: 12,
    landmark: 'Kashi Vishwanath & Dashashwamedh',
    municipal_authority: 'Varanasi Nagar Nigam (VNN)',
    helpline: '0542-2280010 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Godowlia', lat: 25.3092, lon: 83.0068 },
      { name: 'Lanka / BHU', lat: 25.2798, lon: 82.9994 },
      { name: 'Sigra', lat: 25.3189, lon: 82.9868 }
    ]
  },
  {
    name: 'Chandigarh',
    state: 'Punjab & Haryana',
    code: 'IXC',
    lat: 30.7333,
    lon: 76.7794,
    zoom: 12,
    landmark: 'Rock Garden & Sukhna Lake',
    municipal_authority: 'Municipal Corporation Chandigarh (MCC)',
    helpline: '0172-2787200 / 155304',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Sector 17', lat: 30.7398, lon: 76.7827 },
      { name: 'Sector 35', lat: 30.7224, lon: 76.7686 }
    ]
  },
  {
    name: 'Dehradun',
    state: 'Uttarakhand',
    code: 'DED',
    lat: 30.3165,
    lon: 78.0322,
    zoom: 12,
    landmark: 'Clock Tower & Robbers Cave',
    municipal_authority: 'Dehradun Municipal Corporation (DMC)',
    helpline: '0135-2651477 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Rajpur Road', lat: 30.3456, lon: 78.0645 },
      { name: 'Clock Tower', lat: 30.3255, lon: 78.0436 }
    ]
  },
  {
    name: 'Shimla',
    state: 'Himachal Pradesh',
    code: 'SLV',
    lat: 31.1048,
    lon: 77.1734,
    zoom: 12,
    landmark: 'The Ridge & Mall Road',
    municipal_authority: 'Municipal Corporation Shimla (SMC)',
    helpline: '0177-2802771 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'The Mall / Ridge', lat: 31.1044, lon: 77.1746 },
      { name: 'Sanjauli', lat: 31.1011, lon: 77.2023 }
    ]
  },

  // WEST
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    code: 'BOM',
    lat: 19.0760,
    lon: 72.8777,
    zoom: 11,
    landmark: 'Gateway of India & Marine Drive',
    municipal_authority: 'Brihanmumbai Municipal Corporation (BMC)',
    helpline: '1916 / 022-22694725',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Bandra West', lat: 19.0596, lon: 72.8295 },
      { name: 'Andheri East', lat: 19.1136, lon: 72.8697 },
      { name: 'Dadar', lat: 19.0178, lon: 72.8478 },
      { name: 'Colaba', lat: 18.9067, lon: 72.8147 }
    ]
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    code: 'PNQ',
    lat: 18.5204,
    lon: 73.8567,
    zoom: 12,
    landmark: 'Shaniwar Wada & Aga Khan Palace',
    municipal_authority: 'Pune Municipal Corporation (PMC)',
    helpline: '1800 1030 222 / 020-25501000',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Kothrud', lat: 18.5074, lon: 73.8077 },
      { name: 'Viman Nagar', lat: 18.5679, lon: 73.9143 },
      { name: 'Hinjawadi', lat: 18.5913, lon: 73.7389 }
    ]
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    code: 'AMD',
    lat: 23.0225,
    lon: 72.5714,
    zoom: 12,
    landmark: 'Sabarmati Ashram & Atal Bridge',
    municipal_authority: 'Ahmedabad Municipal Corporation (AMC)',
    helpline: '155303 / 079-25391811',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Navrangpura', lat: 23.0365, lon: 72.5611 },
      { name: 'Bodakdev', lat: 23.0401, lon: 72.5115 }
    ]
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    code: 'JAI',
    lat: 26.9124,
    lon: 75.7873,
    zoom: 12,
    landmark: 'Hawa Mahal & Amer Fort',
    municipal_authority: 'Jaipur Greater Municipal Corporation',
    helpline: '0141-2742823 / 181',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'C-Scheme', lat: 26.9114, lon: 75.8013 },
      { name: 'Malviya Nagar', lat: 26.8549, lon: 75.8243 }
    ]
  },
  {
    name: 'Panaji',
    state: 'Goa',
    code: 'GOI',
    lat: 15.4909,
    lon: 73.8278,
    zoom: 12,
    landmark: 'Fontainhas & Mandovi Promenade',
    municipal_authority: 'Corporation of the City of Panaji (CCP)',
    helpline: '0832-2223339 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Fontainhas', lat: 15.4962, lon: 73.8324 },
      { name: 'Miramar Beach', lat: 15.4828, lon: 73.8122 }
    ]
  },

  // CENTRAL
  {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    code: 'BHO',
    lat: 23.2599,
    lon: 77.4126,
    zoom: 12,
    landmark: 'Upper Lake & Van Vihar',
    municipal_authority: 'Bhopal Municipal Corporation (BMC)',
    helpline: '155304 / 0755-2701000',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'VIP Road / Upper Lake', lat: 23.2662, lon: 77.3785 },
      { name: 'Arera Colony', lat: 23.2144, lon: 77.4339 }
    ]
  },
  {
    name: 'Indore',
    state: 'Madhya Pradesh',
    code: 'IDR',
    lat: 22.7196,
    lon: 75.8577,
    zoom: 12,
    landmark: 'Rajwada Palace & 56 Dukan',
    municipal_authority: 'Indore Municipal Corporation (IMC)',
    helpline: '0731-2535555 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Rajwada', lat: 22.7187, lon: 75.8554 },
      { name: 'Vijay Nagar', lat: 22.7533, lon: 75.8937 }
    ]
  },

  // EAST & NORTHEAST
  {
    name: 'Kolkata',
    state: 'West Bengal',
    code: 'CCU',
    lat: 22.5726,
    lon: 88.3639,
    zoom: 12,
    landmark: 'Howrah Bridge & Victoria Memorial',
    municipal_authority: 'Kolkata Municipal Corporation (KMC)',
    helpline: '033-22861212 / 1600',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Park Street', lat: 22.5510, lon: 88.3524 },
      { name: 'Salt Lake Sector V', lat: 22.5802, lon: 88.4350 }
    ]
  },
  {
    name: 'Bhubaneswar',
    state: 'Odisha',
    code: 'BBI',
    lat: 20.2961,
    lon: 85.8245,
    zoom: 12,
    landmark: 'Lingaraj Temple & Smart City Corridor',
    municipal_authority: 'Bhubaneswar Municipal Corporation (BMC)',
    helpline: '1800 345 0061 / 1929',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Patia / Infocity', lat: 20.3533, lon: 85.8174 },
      { name: 'Saheed Nagar', lat: 20.2884, lon: 85.8428 }
    ]
  },
  {
    name: 'Patna',
    state: 'Bihar',
    code: 'PAT',
    lat: 25.5941,
    lon: 85.1376,
    zoom: 12,
    landmark: 'Golghar & Gandhi Ghat',
    municipal_authority: 'Patna Municipal Corporation (PMC)',
    helpline: '155304 / 0612-2223791',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Bailey Road', lat: 25.6122, lon: 85.0978 },
      { name: 'Boring Road', lat: 25.6186, lon: 85.1167 }
    ]
  },
  {
    name: 'Guwahati',
    state: 'Assam',
    code: 'GAU',
    lat: 26.1445,
    lon: 91.7362,
    zoom: 12,
    landmark: 'Kamakhya Temple & Brahmaputra Front',
    municipal_authority: 'Guwahati Municipal Corporation (GMC)',
    helpline: '0361-2540525 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Kamakhya Foothills', lat: 26.1648, lon: 91.7058 },
      { name: 'GS Road', lat: 26.1524, lon: 91.7765 }
    ]
  },
  {
    name: 'Amritsar',
    state: 'Punjab',
    code: 'ATQ',
    lat: 31.6340,
    lon: 74.8723,
    zoom: 12,
    landmark: 'Golden Temple & Jallianwala Bagh',
    municipal_authority: 'Municipal Corporation Amritsar (MCA)',
    helpline: '0183-2545155 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Ranjit Avenue', lat: 31.6560, lon: 74.8568 },
      { name: 'Mall Road', lat: 31.6420, lon: 74.8710 },
      { name: 'Hall Gate', lat: 31.6310, lon: 74.8765 },
      { name: 'Chheharta', lat: 31.6280, lon: 74.8010 }
    ]
  },
  {
    name: 'Surat',
    state: 'Gujarat',
    code: 'STV',
    lat: 21.1702,
    lon: 72.8311,
    zoom: 12,
    landmark: 'Dumas Beach & Tapi Riverfront',
    municipal_authority: 'Surat Municipal Corporation (SMC)',
    helpline: '0261-2423751 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Athwa', lat: 21.1645, lon: 72.7985 },
      { name: 'Adajan', lat: 21.1960, lon: 72.7930 },
      { name: 'Vesu', lat: 21.1410, lon: 72.7750 },
      { name: 'Varachha', lat: 21.2180, lon: 72.8580 }
    ]
  },
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    code: 'NAG',
    lat: 21.1458,
    lon: 79.0882,
    zoom: 12,
    landmark: 'Zero Mile Stone & Deekshabhoomi',
    municipal_authority: 'Nagpur Municipal Corporation (NMC)',
    helpline: '0712-2567035 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Dharampeth', lat: 21.1415, lon: 79.0585 },
      { name: 'Sadar', lat: 21.1610, lon: 79.0790 },
      { name: 'Sitabuldi', lat: 21.1460, lon: 79.0830 },
      { name: 'Wardha Road', lat: 21.0920, lon: 79.0710 }
    ]
  },
  {
    name: 'Ludhiana',
    state: 'Punjab',
    code: 'LUH',
    lat: 30.9010,
    lon: 75.8573,
    zoom: 12,
    landmark: 'Clock Tower & PAU Grounds',
    municipal_authority: 'Municipal Corporation Ludhiana (MCL)',
    helpline: '0161-2746400 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Model Town', lat: 30.8910, lon: 75.8360 },
      { name: 'Sarabha Nagar', lat: 30.8870, lon: 75.8080 },
      { name: 'Ferozepur Road', lat: 30.9050, lon: 75.7950 },
      { name: 'Civil Lines', lat: 30.9120, lon: 75.8450 }
    ]
  },
  {
    name: 'Agra',
    state: 'Uttar Pradesh',
    code: 'AGR',
    lat: 27.1767,
    lon: 78.0081,
    zoom: 12,
    landmark: 'Taj Mahal & Agra Fort',
    municipal_authority: 'Agra Nagar Nigam (ANN)',
    helpline: '0562-2520615 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Tajganj', lat: 27.1650, lon: 78.0410 },
      { name: 'Sanjay Place', lat: 27.2020, lon: 78.0060 },
      { name: 'Dayalbagh', lat: 27.2280, lon: 78.0120 },
      { name: 'Kamla Nagar', lat: 27.2150, lon: 78.0250 }
    ]
  },
  {
    name: 'Nashik',
    state: 'Maharashtra',
    code: 'ISK',
    lat: 19.9975,
    lon: 73.7898,
    zoom: 12,
    landmark: 'Panchavati & Godavari Ramkund',
    municipal_authority: 'Nashik Municipal Corporation (NMC)',
    helpline: '0253-2575631 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Panchavati', lat: 20.0090, lon: 73.7990 },
      { name: 'College Road', lat: 20.0010, lon: 73.7620 },
      { name: 'Indira Nagar', lat: 19.9670, lon: 73.7780 },
      { name: 'Gangapur Road', lat: 20.0180, lon: 73.7460 }
    ]
  },
  {
    name: 'Madurai',
    state: 'Tamil Nadu',
    code: 'IXM',
    lat: 9.9252,
    lon: 78.1198,
    zoom: 12,
    landmark: 'Meenakshi Amman Temple & Thirumalai Nayakkar Mahal',
    municipal_authority: 'Madurai Corporation (MC)',
    helpline: '0452-2531551 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'KK Nagar', lat: 9.9320, lon: 78.1470 },
      { name: 'Anna Nagar', lat: 9.9205, lon: 78.1520 },
      { name: 'Simmakkal', lat: 9.9310, lon: 78.1220 },
      { name: 'Goripalayam', lat: 9.9350, lon: 78.1290 }
    ]
  },
  {
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    code: 'CJB',
    lat: 11.0168,
    lon: 76.9558,
    zoom: 12,
    landmark: 'Marudhamalai & VOC Park',
    municipal_authority: 'Coimbatore City Municipal Corporation (CCMC)',
    helpline: '0422-2302323 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'RS Puram', lat: 11.0110, lon: 76.9460 },
      { name: 'Gandhipuram', lat: 11.0190, lon: 76.9680 },
      { name: 'Peelamedu', lat: 11.0280, lon: 77.0120 },
      { name: 'Saibaba Colony', lat: 11.0310, lon: 76.9450 }
    ]
  },
  {
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    code: 'TRV',
    lat: 8.5241,
    lon: 76.9366,
    zoom: 12,
    landmark: 'Sree Padmanabhaswamy Temple & Napier Museum',
    municipal_authority: 'Thiruvananthapuram Municipal Corporation (TMC)',
    helpline: '0471-2320821 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Kowdiar', lat: 8.5300, lon: 76.9620 },
      { name: 'Palayam', lat: 8.5060, lon: 76.9510 },
      { name: 'Pattom', lat: 8.5310, lon: 76.9420 },
      { name: 'Kazhakkoottam', lat: 8.5680, lon: 76.8730 }
    ]
  },
  {
    name: 'Vadodara',
    state: 'Gujarat',
    code: 'BDQ',
    lat: 22.3072,
    lon: 73.1812,
    zoom: 12,
    landmark: 'Laxmi Vilas Palace & Sayaji Baug',
    municipal_authority: 'Vadodara Municipal Corporation (VMC)',
    helpline: '0265-2433116 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Alkapuri', lat: 22.3120, lon: 73.1710 },
      { name: 'Fatehgunj', lat: 22.3270, lon: 73.1890 },
      { name: 'Akota', lat: 22.2980, lon: 73.1680 },
      { name: 'Manjalpur', lat: 22.2640, lon: 73.1930 }
    ]
  },
  {
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    code: 'SXR',
    lat: 34.0837,
    lon: 74.7973,
    zoom: 12,
    landmark: 'Dal Lake & Shankaracharya Temple',
    municipal_authority: 'Srinagar Municipal Corporation (SMC)',
    helpline: '0194-2474499 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Lal Chowk', lat: 34.0720, lon: 74.8110 },
      { name: 'Rajbagh', lat: 34.0620, lon: 74.8210 },
      { name: 'Dalgate', lat: 34.0810, lon: 74.8320 },
      { name: 'Hazratbal', lat: 34.1280, lon: 74.8420 }
    ]
  },
  {
    name: 'Ranchi',
    state: 'Jharkhand',
    code: 'IXR',
    lat: 23.3441,
    lon: 85.3096,
    zoom: 12,
    landmark: 'Tagore Hill & Ranchi Lake',
    municipal_authority: 'Ranchi Municipal Corporation (RMC)',
    helpline: '0651-2211215 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Main Road', lat: 23.3550, lon: 85.3260 },
      { name: 'Lalpur', lat: 23.3710, lon: 85.3370 },
      { name: 'Doranda', lat: 23.3320, lon: 85.3210 },
      { name: 'Morabadi', lat: 23.3890, lon: 85.3270 }
    ]
  },
  {
    name: 'Jamshedpur',
    state: 'Jharkhand',
    code: 'IXW',
    lat: 22.8046,
    lon: 86.2029,
    zoom: 12,
    landmark: 'Jubilee Park & Tata Steel Plant',
    municipal_authority: 'Jamshedpur Notified Area Committee (JNAC)',
    helpline: '0657-2431221 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Bistupur', lat: 22.7950, lon: 86.1840 },
      { name: 'Sakchi', lat: 22.8120, lon: 86.2050 },
      { name: 'Telco Colony', lat: 22.7780, lon: 86.2510 },
      { name: 'Sonari', lat: 22.8190, lon: 86.1620 }
    ]
  },
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    code: 'UDR',
    lat: 24.5854,
    lon: 73.7125,
    zoom: 12,
    landmark: 'City Palace & Lake Pichola',
    municipal_authority: 'Udaipur Municipal Corporation (UMC)',
    helpline: '0294-2421255 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Hiran Magri', lat: 24.5680, lon: 73.7250 },
      { name: 'Fatehsagar', lat: 24.6030, lon: 73.6760 },
      { name: 'Sukhadia Circle', lat: 24.6040, lon: 73.6960 },
      { name: 'Old City', lat: 24.5800, lon: 73.6840 }
    ]
  },
  {
    name: 'Gwalior',
    state: 'Madhya Pradesh',
    code: 'GWL',
    lat: 26.2183,
    lon: 78.1828,
    zoom: 12,
    landmark: 'Gwalior Fort & Jai Vilas Mahal',
    municipal_authority: 'Gwalior Municipal Corporation (GMC)',
    helpline: '0751-2438300 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Lashkar', lat: 26.2010, lon: 78.1560 },
      { name: 'City Centre', lat: 26.2120, lon: 78.1920 },
      { name: 'Morar', lat: 26.2280, lon: 78.2250 },
      { name: 'Thatipur', lat: 26.2190, lon: 78.2050 }
    ]
  },
  {
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    code: 'VGA',
    lat: 16.5062,
    lon: 80.6480,
    zoom: 12,
    landmark: 'Kanaka Durga Temple & Prakasam Barrage',
    municipal_authority: 'Vijayawada Municipal Corporation (VMC)',
    helpline: '0866-2421058 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'MG Road', lat: 16.5080, lon: 80.6410 },
      { name: 'Benz Circle', lat: 16.4990, lon: 80.6540 },
      { name: 'Governorpet', lat: 16.5120, lon: 80.6270 },
      { name: 'Bhavanipuram', lat: 16.5260, lon: 80.6050 }
    ]
  },
  {
    name: 'Jodhpur',
    state: 'Rajasthan',
    code: 'JDH',
    lat: 26.2389,
    lon: 73.0243,
    zoom: 12,
    landmark: 'Mehrangarh Fort & Umaid Bhawan Palace',
    municipal_authority: 'Jodhpur Nagar Nigam (JNN)',
    helpline: '0291-2651400 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Sardarpura', lat: 26.2750, lon: 73.0110 },
      { name: 'Ratanada', lat: 26.2620, lon: 73.0360 },
      { name: 'Shastri Nagar', lat: 26.2840, lon: 72.9980 },
      { name: 'Clock Tower Bazaar', lat: 26.2960, lon: 73.0240 }
    ]
  },
  {
    name: 'Cuttack',
    state: 'Odisha',
    code: 'CTC',
    lat: 20.4625,
    lon: 85.8828,
    zoom: 12,
    landmark: 'Barabati Fort & Mahanadi Riverfront',
    municipal_authority: 'Cuttack Municipal Corporation (CMC)',
    helpline: '0671-2508000 / 1533',
    ambulance: '108',
    police: '112',
    localities: [
      { name: 'Badambadi', lat: 20.4550, lon: 85.8710 },
      { name: 'CDA Sector', lat: 20.4850, lon: 85.8420 },
      { name: 'Buxi Bazaar', lat: 20.4660, lon: 85.8860 },
      { name: 'Choudhury Bazar', lat: 20.4630, lon: 85.8790 }
    ]
  }
];

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem('needradar_selected_city') || 'Bengaluru';
  });
  const [availableCities, setAvailableCities] = useState<CityData[]>(DEFAULT_CITIES);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const data = await api.get<CityData[]>('/discovery/cities');
        if (data && data.length > 0) {
          setAvailableCities(data);
        }
      } catch (err) {
        console.warn('Using default 24-city national registry');
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  const setCity = (cityName: string) => {
    setCurrentCity(cityName);
    localStorage.setItem('needradar_selected_city', cityName);
  };

  const cityData =
    availableCities.find((c) => c.name.toLowerCase() === currentCity.toLowerCase()) ||
    availableCities[0];

  return (
    <CityContext.Provider
      value={{ currentCity, setCity, cityData, availableCities, loadingCities }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
