from typing import Dict, List, Any

CITIES_REGISTRY: Dict[str, Dict[str, Any]] = {
    "Bengaluru": {
        "name": "Bengaluru",
        "state": "Karnataka",
        "lat": 12.9716,
        "lon": 77.5946,
        "zoom": 12,
        "localities": [
            {"name": "Koramangala", "lat": 12.9352, "lon": 77.6245},
            {"name": "HSR Layout", "lat": 12.9121, "lon": 77.6446},
            {"name": "Indiranagar", "lat": 12.9784, "lon": 77.6408},
            {"name": "Whitefield", "lat": 12.9698, "lon": 77.7500},
            {"name": "Jayanagar", "lat": 12.9308, "lon": 77.5838},
            {"name": "Malleshwaram", "lat": 13.0031, "lon": 77.5643},
            {"name": "BTM Layout", "lat": 12.9166, "lon": 77.6101},
            {"name": "Electronic City", "lat": 12.8399, "lon": 77.6770},
            {"name": "Hebbal", "lat": 13.0358, "lon": 77.5970},
            {"name": "Yelahanka", "lat": 13.1007, "lon": 77.5963}
        ]
    },
    "Lucknow": {
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "lat": 26.8467,
        "lon": 80.9462,
        "zoom": 12,
        "localities": [
            {"name": "Hazratganj", "lat": 26.8532, "lon": 80.9472},
            {"name": "Gomti Nagar", "lat": 26.8504, "lon": 81.0006},
            {"name": "Aliganj", "lat": 26.8925, "lon": 80.9392},
            {"name": "Indira Nagar", "lat": 26.8778, "lon": 80.9859},
            {"name": "Alambagh", "lat": 26.8155, "lon": 80.9022},
            {"name": "Chowk", "lat": 26.8665, "lon": 80.9056},
            {"name": "Mahanagar", "lat": 26.8732, "lon": 80.9547},
            {"name": "Jankipuram", "lat": 26.9181, "lon": 80.9497},
            {"name": "Charbagh", "lat": 26.8289, "lon": 80.9231}
        ]
    },
    "Prayagraj": {
        "name": "Prayagraj",
        "state": "Uttar Pradesh",
        "lat": 25.4358,
        "lon": 81.8463,
        "zoom": 12,
        "localities": [
            {"name": "Civil Lines", "lat": 25.4526, "lon": 81.8344},
            {"name": "Katra", "lat": 25.4601, "lon": 81.8569},
            {"name": "Georgetown", "lat": 25.4419, "lon": 81.8596},
            {"name": "Naini", "lat": 25.3854, "lon": 81.8742},
            {"name": "Daraganj", "lat": 25.4326, "lon": 81.8789},
            {"name": "Ashok Nagar", "lat": 25.4651, "lon": 81.8239},
            {"name": "Phaphamau", "lat": 25.5173, "lon": 81.8593},
            {"name": "Tagore Town", "lat": 25.4485, "lon": 81.8521},
            {"name": "Kareli", "lat": 25.4219, "lon": 81.8228}
        ]
    },
    "Kanpur": {
        "name": "Kanpur",
        "state": "Uttar Pradesh",
        "lat": 26.4499,
        "lon": 80.3319,
        "zoom": 12,
        "localities": [
            {"name": "Civil Lines", "lat": 26.4735, "lon": 80.3496},
            {"name": "Swaroop Nagar", "lat": 26.4805, "lon": 80.3156},
            {"name": "Kakadeo", "lat": 26.4789, "lon": 80.2925},
            {"name": "Kidwai Nagar", "lat": 26.4319, "lon": 80.3341},
            {"name": "Govind Nagar", "lat": 26.4415, "lon": 80.3015},
            {"name": "Kalyanpur", "lat": 26.4975, "lon": 80.2528},
            {"name": "Rawatpur", "lat": 26.4828, "lon": 80.3021},
            {"name": "Mall Road", "lat": 26.4678, "lon": 80.3541},
            {"name": "Panki", "lat": 26.4526, "lon": 80.2312}
        ]
    },
    "Delhi": {
        "name": "Delhi",
        "state": "National Capital Territory",
        "lat": 28.6139,
        "lon": 77.2090,
        "zoom": 11,
        "localities": [
            {"name": "Connaught Place", "lat": 28.6315, "lon": 77.2167},
            {"name": "Lajpat Nagar", "lat": 28.5677, "lon": 77.2433},
            {"name": "Rohini", "lat": 28.7166, "lon": 77.1136},
            {"name": "Dwarka", "lat": 28.5921, "lon": 77.0460},
            {"name": "Saket", "lat": 28.5244, "lon": 77.2167},
            {"name": "Karol Bagh", "lat": 28.6514, "lon": 77.1907},
            {"name": "Chandni Chowk", "lat": 28.6562, "lon": 77.2300},
            {"name": "Mayur Vihar", "lat": 28.6095, "lon": 77.2995},
            {"name": "Janakpuri", "lat": 28.6219, "lon": 77.0878},
            {"name": "Hauz Khas", "lat": 28.5494, "lon": 77.2001}
        ]
    },
    "Mumbai": {
        "name": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.0760,
        "lon": 72.8777,
        "zoom": 11,
        "localities": [
            {"name": "Bandra West", "lat": 19.0596, "lon": 72.8295},
            {"name": "Andheri East", "lat": 19.1136, "lon": 72.8697},
            {"name": "Dadar", "lat": 19.0178, "lon": 72.8478},
            {"name": "Colaba", "lat": 18.9067, "lon": 72.8147},
            {"name": "Powai", "lat": 19.1176, "lon": 72.9060},
            {"name": "Borivali", "lat": 19.2307, "lon": 72.8567},
            {"name": "Juhu", "lat": 19.1075, "lon": 72.8263},
            {"name": "Kurla", "lat": 19.0726, "lon": 72.8845}
        ]
    },
    "Hyderabad": {
        "name": "Hyderabad",
        "state": "Telangana",
        "lat": 17.3850,
        "lon": 78.4867,
        "zoom": 12,
        "localities": [
            {"name": "Banjara Hills", "lat": 17.4156, "lon": 78.4350},
            {"name": "Hitec City", "lat": 17.4435, "lon": 78.3772},
            {"name": "Jubilee Hills", "lat": 17.4319, "lon": 78.4073},
            {"name": "Gachibowli", "lat": 17.4401, "lon": 78.3489},
            {"name": "Madhapur", "lat": 17.4483, "lon": 78.3915},
            {"name": "Secunderabad", "lat": 17.4399, "lon": 78.4983},
            {"name": "Kukatpally", "lat": 17.4947, "lon": 78.3996}
        ]
    }
}
