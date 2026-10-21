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
      { name: 'Malleshwaram', lat: 13.0031, lon: 77.5643 },
      { name: 'BTM Layout', lat: 12.9166, lon: 77.6101 },
      { name: 'Electronic City', lat: 12.8399, lon: 77.6770 }
    ]
  },
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
      { name: 'Dwarka', lat: 28.5921, lon: 77.0460 },
      { name: 'Saket', lat: 28.5244, lon: 77.2167 },
      { name: 'Karol Bagh', lat: 28.6514, lon: 77.1907 },
      { name: 'Chandni Chowk', lat: 28.6562, lon: 77.2300 }
    ]
  },
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
      { name: 'Colaba', lat: 18.9067, lon: 72.8147 },
      { name: 'Powai', lat: 19.1176, lon: 72.9060 },
      { name: 'Borivali', lat: 19.2307, lon: 72.8567 }
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
      { name: 'Indira Nagar', lat: 26.8778, lon: 80.9859 },
      { name: 'Alambagh', lat: 26.8155, lon: 80.9022 },
      { name: 'Chowk', lat: 26.8665, lon: 80.9056 },
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
      { name: 'Georgetown', lat: 25.4419, lon: 81.8596 },
      { name: 'Naini', lat: 25.3854, lon: 81.8742 },
      { name: 'Daraganj', lat: 25.4326, lon: 81.8789 },
      { name: 'Ashok Nagar', lat: 25.4651, lon: 81.8239 }
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
      { name: 'Kakadeo', lat: 26.4789, lon: 80.2925 },
      { name: 'Kidwai Nagar', lat: 26.4319, lon: 80.3341 },
      { name: 'Govind Nagar', lat: 26.4415, lon: 80.3015 },
      { name: 'Mall Road', lat: 26.4678, lon: 80.3541 }
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
      { name: 'Jubilee Hills', lat: 17.4319, lon: 78.4073 },
      { name: 'Gachibowli', lat: 17.4401, lon: 78.3489 },
      { name: 'Madhapur', lat: 17.4483, lon: 78.3915 },
      { name: 'Secunderabad', lat: 17.4399, lon: 78.4983 }
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
      { name: 'Sigra', lat: 25.3189, lon: 82.9868 },
      { name: 'Bhelupur', lat: 25.2974, lon: 82.9922 },
      { name: 'Cantonment', lat: 25.3340, lon: 82.9790 }
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
      { name: 'Velachery', lat: 12.9815, lon: 80.2180 },
      { name: 'Anna Nagar', lat: 13.0850, lon: 80.2101 }
    ]
  },
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
      { name: 'Salt Lake Sector V', lat: 22.5802, lon: 88.4350 },
      { name: 'Ballygunge', lat: 22.5280, lon: 88.3655 },
      { name: 'New Town', lat: 22.5958, lon: 88.4798 },
      { name: 'Shyambazar', lat: 22.6045, lon: 88.3746 }
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
      { name: 'Hinjawadi', lat: 18.5913, lon: 73.7389 },
      { name: 'Shivajinagar', lat: 18.5314, lon: 73.8446 },
      { name: 'Baner', lat: 18.5590, lon: 73.7868 }
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
      { name: 'Bodakdev / SG Highway', lat: 23.0401, lon: 72.5115 },
      { name: 'Maninagar', lat: 22.9978, lon: 72.6026 },
      { name: 'Satellite', lat: 23.0286, lon: 72.5284 }
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
      { name: 'Malviya Nagar', lat: 26.8549, lon: 75.8243 },
      { name: 'Vaishali Nagar', lat: 26.9069, lon: 75.7423 },
      { name: 'Mansarovar', lat: 26.8522, lon: 75.7671 }
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
      { name: 'Sector 17 (Plaza)', lat: 30.7398, lon: 76.7827 },
      { name: 'Sector 35 (Commercial)', lat: 30.7224, lon: 76.7686 },
      { name: 'Sector 22 (Market)', lat: 30.7342, lon: 76.7728 },
      { name: 'Sector 43 (ISBT)', lat: 30.7161, lon: 76.7454 }
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
        console.warn('Using default 14-city registry');
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
