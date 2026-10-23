from typing import Dict, List, Any

CITIES_REGISTRY: Dict[str, Dict[str, Any]] = {
    # SOUTH REGION
    "Bengaluru": {
        "name": "Bengaluru",
        "state": "Karnataka",
        "code": "BLR",
        "lat": 12.9716,
        "lon": 77.5946,
        "zoom": 12,
        "landmark": "Vidhana Soudha & Cubbon Park",
        "municipal_authority": "Bruhat Bengaluru Mahanagara Palike (BBMP)",
        "helpline": "080-22660000 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Koramangala", "lat": 12.9352, "lon": 77.6245},
            {"name": "HSR Layout", "lat": 12.9121, "lon": 77.6446},
            {"name": "Indiranagar", "lat": 12.9784, "lon": 77.6408},
            {"name": "Whitefield", "lat": 12.9698, "lon": 77.7500},
            {"name": "Jayanagar", "lat": 12.9308, "lon": 77.5838},
            {"name": "Malleshwaram", "lat": 13.0031, "lon": 77.5643},
            {"name": "BTM Layout", "lat": 12.9166, "lon": 77.6101},
            {"name": "Electronic City", "lat": 12.8399, "lon": 77.6770}
        ]
    },
    "Chennai": {
        "name": "Chennai",
        "state": "Tamil Nadu",
        "code": "MAA",
        "lat": 13.0827,
        "lon": 80.2707,
        "zoom": 12,
        "landmark": "Marina Beach & Ripon Building",
        "municipal_authority": "Greater Chennai Corporation (GCC)",
        "helpline": "1913 / 044-25619206",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "T. Nagar", "lat": 13.0418, "lon": 80.2341},
            {"name": "Adyar", "lat": 13.0012, "lon": 80.2565},
            {"name": "Mylapore", "lat": 13.0368, "lon": 80.2676},
            {"name": "Velachery", "lat": 12.9815, "lon": 80.2180},
            {"name": "Anna Nagar", "lat": 13.0850, "lon": 80.2101}
        ]
    },
    "Hyderabad": {
        "name": "Hyderabad",
        "state": "Telangana",
        "code": "HYD",
        "lat": 17.3850,
        "lon": 78.4867,
        "zoom": 12,
        "landmark": "Charminar & Cyberabad",
        "municipal_authority": "Greater Hyderabad Municipal Corporation (GHMC)",
        "helpline": "040-21111111 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Banjara Hills", "lat": 17.4156, "lon": 78.4350},
            {"name": "Hitec City", "lat": 17.4435, "lon": 78.3772},
            {"name": "Jubilee Hills", "lat": 17.4319, "lon": 78.4073},
            {"name": "Gachibowli", "lat": 17.4401, "lon": 78.3489},
            {"name": "Secunderabad", "lat": 17.4399, "lon": 78.4983}
        ]
    },
    "Kochi": {
        "name": "Kochi",
        "state": "Kerala",
        "code": "COK",
        "lat": 9.9312,
        "lon": 76.2673,
        "zoom": 12,
        "landmark": "Fort Kochi & Marine Drive Walkway",
        "municipal_authority": "Kochi Municipal Corporation (KMC)",
        "helpline": "0484-2369007 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Fort Kochi", "lat": 9.9658, "lon": 76.2425},
            {"name": "Marine Drive", "lat": 9.9806, "lon": 76.2758},
            {"name": "Kaloor", "lat": 9.9986, "lon": 76.2952},
            {"name": "Edappally", "lat": 10.0246, "lon": 76.3082},
            {"name": "Kadavanthra", "lat": 9.9673, "lon": 76.2996}
        ]
    },
    "Visakhapatnam": {
        "name": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "code": "VTZ",
        "lat": 17.6868,
        "lon": 83.2185,
        "zoom": 12,
        "landmark": "RK Beach & Kailasagiri",
        "municipal_authority": "Greater Visakhapatnam Municipal Corporation (GVMC)",
        "helpline": "1800 425 0001 / 0891-2746400",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "RK Beach Road", "lat": 17.7126, "lon": 83.3182},
            {"name": "Dwaraka Nagar", "lat": 17.7242, "lon": 83.3085},
            {"name": "MVP Colony", "lat": 17.7441, "lon": 83.3364},
            {"name": "Gajuwaka", "lat": 17.6934, "lon": 83.2148}
        ]
    },

    # NORTH REGION
    "Delhi": {
        "name": "Delhi",
        "state": "National Capital Territory",
        "code": "DEL",
        "lat": 28.6139,
        "lon": 77.2090,
        "zoom": 11,
        "landmark": "India Gate & Connaught Place",
        "municipal_authority": "Municipal Corporation of Delhi (MCD)",
        "helpline": "155305 / 011-23220010",
        "ambulance": "102 / 108",
        "police": "112",
        "localities": [
            {"name": "Connaught Place", "lat": 28.6315, "lon": 77.2167},
            {"name": "Lajpat Nagar", "lat": 28.5677, "lon": 77.2433},
            {"name": "Rohini", "lat": 28.7166, "lon": 77.1136},
            {"name": "Dwarka", "lat": 28.5921, "lon": 77.0460},
            {"name": "Saket", "lat": 28.5244, "lon": 77.2167},
            {"name": "Chandni Chowk", "lat": 28.6562, "lon": 77.2300}
        ]
    },
    "Lucknow": {
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "code": "LKO",
        "lat": 26.8467,
        "lon": 80.9462,
        "zoom": 12,
        "landmark": "Rumi Darwaza & Hazratganj",
        "municipal_authority": "Lucknow Municipal Corporation (LMC)",
        "helpline": "0522-2622080 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Hazratganj", "lat": 26.8532, "lon": 80.9472},
            {"name": "Gomti Nagar", "lat": 26.8504, "lon": 81.0006},
            {"name": "Aliganj", "lat": 26.8925, "lon": 80.9392},
            {"name": "Indira Nagar", "lat": 26.8778, "lon": 80.9859},
            {"name": "Chowk", "lat": 26.8665, "lon": 80.9056},
            {"name": "Charbagh", "lat": 26.8289, "lon": 80.9231}
        ]
    },
    "Prayagraj": {
        "name": "Prayagraj",
        "state": "Uttar Pradesh",
        "code": "PRG",
        "lat": 25.4358,
        "lon": 81.8463,
        "zoom": 12,
        "landmark": "Triveni Sangam & Anand Bhavan",
        "municipal_authority": "Prayagraj Nagar Nigam (PNN)",
        "helpline": "0532-2407555 / 1920",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Civil Lines", "lat": 25.4526, "lon": 81.8344},
            {"name": "Katra", "lat": 25.4601, "lon": 81.8569},
            {"name": "Georgetown", "lat": 25.4419, "lon": 81.8596},
            {"name": "Naini", "lat": 25.3854, "lon": 81.8742},
            {"name": "Daraganj", "lat": 25.4326, "lon": 81.8789}
        ]
    },
    "Kanpur": {
        "name": "Kanpur",
        "state": "Uttar Pradesh",
        "code": "KNP",
        "lat": 26.4499,
        "lon": 80.3319,
        "zoom": 12,
        "landmark": "JK Temple & Industrial Hub",
        "municipal_authority": "Kanpur Nagar Nigam (KNN)",
        "helpline": "0512-2556488 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Civil Lines", "lat": 26.4735, "lon": 80.3496},
            {"name": "Swaroop Nagar", "lat": 26.4805, "lon": 80.3156},
            {"name": "Kakadeo", "lat": 26.4789, "lon": 80.2925},
            {"name": "Kidwai Nagar", "lat": 26.4319, "lon": 80.3341},
            {"name": "Mall Road", "lat": 26.4678, "lon": 80.3541}
        ]
    },
    "Varanasi": {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "code": "VNS",
        "lat": 25.3176,
        "lon": 82.9739,
        "zoom": 12,
        "landmark": "Kashi Vishwanath & Dashashwamedh",
        "municipal_authority": "Varanasi Nagar Nigam (VNN)",
        "helpline": "0542-2280010 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Godowlia", "lat": 25.3092, "lon": 83.0068},
            {"name": "Lanka / BHU", "lat": 25.2798, "lon": 82.9994},
            {"name": "Sigra", "lat": 25.3189, "lon": 82.9868},
            {"name": "Bhelupur", "lat": 25.2974, "lon": 82.9922}
        ]
    },
    "Chandigarh": {
        "name": "Chandigarh",
        "state": "Punjab & Haryana",
        "code": "IXC",
        "lat": 30.7333,
        "lon": 76.7794,
        "zoom": 12,
        "landmark": "Rock Garden & Sukhna Lake",
        "municipal_authority": "Municipal Corporation Chandigarh (MCC)",
        "helpline": "0172-2787200 / 155304",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Sector 17 (Plaza)", "lat": 30.7398, "lon": 76.7827},
            {"name": "Sector 35 (Commercial)", "lat": 30.7224, "lon": 76.7686},
            {"name": "Sector 22 (Market)", "lat": 30.7342, "lon": 76.7728}
        ]
    },
    "Dehradun": {
        "name": "Dehradun",
        "state": "Uttarakhand",
        "code": "DED",
        "lat": 30.3165,
        "lon": 78.0322,
        "zoom": 12,
        "landmark": "Clock Tower & Robber's Cave",
        "municipal_authority": "Dehradun Municipal Corporation (DMC)",
        "helpline": "0135-2651477 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Rajpur Road", "lat": 30.3456, "lon": 78.0645},
            {"name": "Clock Tower", "lat": 30.3255, "lon": 78.0436},
            {"name": "Paltan Bazaar", "lat": 30.3218, "lon": 78.0388},
            {"name": "Clement Town", "lat": 30.2685, "lon": 78.0076}
        ]
    },
    "Shimla": {
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "code": "SLV",
        "lat": 31.1048,
        "lon": 77.1734,
        "zoom": 12,
        "landmark": "The Ridge & Mall Road",
        "municipal_authority": "Municipal Corporation Shimla (SMC)",
        "helpline": "0177-2802771 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "The Mall / Ridge", "lat": 31.1044, "lon": 77.1746},
            {"name": "Sanjauli", "lat": 31.1011, "lon": 77.2023},
            {"name": "Chhota Shimla", "lat": 31.0924, "lon": 77.1852},
            {"name": "Summer Hill", "lat": 31.1126, "lon": 77.1356}
        ]
    },

    # WEST REGION
    "Mumbai": {
        "name": "Mumbai",
        "state": "Maharashtra",
        "code": "BOM",
        "lat": 19.0760,
        "lon": 72.8777,
        "zoom": 11,
        "landmark": "Gateway of India & Marine Drive",
        "municipal_authority": "Brihanmumbai Municipal Corporation (BMC)",
        "helpline": "1916 / 022-22694725",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Bandra West", "lat": 19.0596, "lon": 72.8295},
            {"name": "Andheri East", "lat": 19.1136, "lon": 72.8697},
            {"name": "Dadar", "lat": 19.0178, "lon": 72.8478},
            {"name": "Colaba", "lat": 18.9067, "lon": 72.8147},
            {"name": "Powai", "lat": 19.1176, "lon": 72.9060}
        ]
    },
    "Pune": {
        "name": "Pune",
        "state": "Maharashtra",
        "code": "PNQ",
        "lat": 18.5204,
        "lon": 73.8567,
        "zoom": 12,
        "landmark": "Shaniwar Wada & Aga Khan Palace",
        "municipal_authority": "Pune Municipal Corporation (PMC)",
        "helpline": "1800 1030 222 / 020-25501000",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Kothrud", "lat": 18.5074, "lon": 73.8077},
            {"name": "Viman Nagar", "lat": 18.5679, "lon": 73.9143},
            {"name": "Hinjawadi", "lat": 18.5913, "lon": 73.7389},
            {"name": "Shivajinagar", "lat": 18.5314, "lon": 73.8446}
        ]
    },
    "Ahmedabad": {
        "name": "Ahmedabad",
        "state": "Gujarat",
        "code": "AMD",
        "lat": 23.0225,
        "lon": 72.5714,
        "zoom": 12,
        "landmark": "Sabarmati Ashram & Atal Bridge",
        "municipal_authority": "Ahmedabad Municipal Corporation (AMC)",
        "helpline": "155303 / 079-25391811",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Navrangpura", "lat": 23.0365, "lon": 72.5611},
            {"name": "Bodakdev", "lat": 23.0401, "lon": 72.5115},
            {"name": "Maninagar", "lat": 22.9978, "lon": 72.6026},
            {"name": "Satellite", "lat": 23.0286, "lon": 72.5284}
        ]
    },
    "Jaipur": {
        "name": "Jaipur",
        "state": "Rajasthan",
        "code": "JAI",
        "lat": 26.9124,
        "lon": 75.7873,
        "zoom": 12,
        "landmark": "Hawa Mahal & Amer Fort",
        "municipal_authority": "Jaipur Greater Municipal Corporation",
        "helpline": "0141-2742823 / 181",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "C-Scheme", "lat": 26.9114, "lon": 75.8013},
            {"name": "Malviya Nagar", "lat": 26.8549, "lon": 75.8243},
            {"name": "Vaishali Nagar", "lat": 26.9069, "lon": 75.7423}
        ]
    },
    "Panaji": {
        "name": "Panaji",
        "state": "Goa",
        "code": "GOI",
        "lat": 15.4909,
        "lon": 73.8278,
        "zoom": 12,
        "landmark": "Fontainhas Latin Quarter & Mandovi Riverfront",
        "municipal_authority": "Corporation of the City of Panaji (CCP)",
        "helpline": "0832-2223339 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Fontainhas", "lat": 15.4962, "lon": 73.8324},
            {"name": "Miramar Beach", "lat": 15.4828, "lon": 73.8122},
            {"name": "Dona Paula", "lat": 15.4578, "lon": 73.8055},
            {"name": "Campal", "lat": 15.4891, "lon": 73.8194}
        ]
    },

    # CENTRAL REGION
    "Bhopal": {
        "name": "Bhopal",
        "state": "Madhya Pradesh",
        "code": "BHO",
        "lat": 23.2599,
        "lon": 77.4126,
        "zoom": 12,
        "landmark": "Upper Lake & Van Vihar",
        "municipal_authority": "Bhopal Municipal Corporation (BMC)",
        "helpline": "155304 / 0755-2701000",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "MP Nagar", "lat": 23.2332, "lon": 77.4343},
            {"name": "Arera Colony", "lat": 23.2144, "lon": 77.4339},
            {"name": "VIP Road / Upper Lake", "lat": 23.2662, "lon": 77.3785},
            {"name": "Kolar Road", "lat": 23.1812, "lon": 77.4182}
        ]
    },
    "Indore": {
        "name": "Indore",
        "state": "Madhya Pradesh",
        "code": "IDR",
        "lat": 22.7196,
        "lon": 75.8577,
        "zoom": 12,
        "landmark": "Rajwada Palace & 56 Dukan",
        "municipal_authority": "Indore Municipal Corporation (IMC)",
        "helpline": "0731-2535555 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Vijay Nagar", "lat": 22.7533, "lon": 75.8937},
            {"name": "Palasia", "lat": 22.7238, "lon": 75.8872},
            {"name": "Rajwada", "lat": 22.7187, "lon": 75.8554},
            {"name": "Bhawarkua", "lat": 22.6931, "lon": 75.8672}
        ]
    },

    # EAST & NORTHEAST REGION
    "Kolkata": {
        "name": "Kolkata",
        "state": "West Bengal",
        "code": "CCU",
        "lat": 22.5726,
        "lon": 88.3639,
        "zoom": 12,
        "landmark": "Howrah Bridge & Victoria Memorial",
        "municipal_authority": "Kolkata Municipal Corporation (KMC)",
        "helpline": "033-22861212 / 1600",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Park Street", "lat": 22.5510, "lon": 88.3524},
            {"name": "Salt Lake Sector V", "lat": 22.5802, "lon": 88.4350},
            {"name": "Ballygunge", "lat": 22.5280, "lon": 88.3655},
            {"name": "New Town", "lat": 22.5958, "lon": 88.4798}
        ]
    },
    "Bhubaneswar": {
        "name": "Bhubaneswar",
        "state": "Odisha",
        "code": "BBI",
        "lat": 20.2961,
        "lon": 85.8245,
        "zoom": 12,
        "landmark": "Lingaraj Temple & Smart City Corridor",
        "municipal_authority": "Bhubaneswar Municipal Corporation (BMC)",
        "helpline": "1800 345 0061 / 1929",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Saheed Nagar", "lat": 20.2884, "lon": 85.8428},
            {"name": "Patia / Infocity", "lat": 20.3533, "lon": 85.8174},
            {"name": "Nayapalli", "lat": 20.2982, "lon": 85.8189},
            {"name": "Old Town", "lat": 20.2415, "lon": 85.8335}
        ]
    },
    "Patna": {
        "name": "Patna",
        "state": "Bihar",
        "code": "PAT",
        "lat": 25.5941,
        "lon": 85.1376,
        "zoom": 12,
        "landmark": "Golghar & Gandhi Ghat",
        "municipal_authority": "Patna Municipal Corporation (PMC)",
        "helpline": "155304 / 0612-2223791",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "Boring Road", "lat": 25.6186, "lon": 85.1167},
            {"name": "Kankarbagh", "lat": 25.5925, "lon": 85.1583},
            {"name": "Bailey Road", "lat": 25.6122, "lon": 85.0978},
            {"name": "Patna Sahib", "lat": 25.5921, "lon": 85.2285}
        ]
    },
    "Guwahati": {
        "name": "Guwahati",
        "state": "Assam",
        "code": "GAU",
        "lat": 26.1445,
        "lon": 91.7362,
        "zoom": 12,
        "landmark": "Kamakhya Temple & Brahmaputra Riverfront",
        "municipal_authority": "Guwahati Municipal Corporation (GMC)",
        "helpline": "0361-2540525 / 1533",
        "ambulance": "108",
        "police": "112",
        "localities": [
            {"name": "GS Road", "lat": 26.1524, "lon": 91.7765},
            {"name": "Panbazar", "lat": 26.1865, "lon": 91.7482},
            {"name": "Dispur Capital Complex", "lat": 26.1422, "lon": 91.7915},
            {"name": "Kamakhya Foothills", "lat": 26.1648, "lon": 91.7058}
        ]
    }
}
