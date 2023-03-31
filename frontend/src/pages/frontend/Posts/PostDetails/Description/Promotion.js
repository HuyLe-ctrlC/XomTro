import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import GoogleMapIcon from "../../../../../img/google-maps.png";
import {
  GoogleMap,
  InfoBox,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import LabelXomTro from "../../../../../components/LabelXomTro";
const API_KEY = process.env.API_GOOGLE_MAP_KEY;
const GEOCODE_API_KEY = process.env.API_GEOCODE_MAP_KEY;
Geocode.setApiKey(GEOCODE_API_KEY);
export default function Promotion() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const addressMap = "91 Lê Văn Tách, Bình Đường 1, An Bình, Dĩ An, Bình Dương";
  // useEffect(() => {
  //   Geocode.fromAddress(addressMap).then(
  //     (response) => {
  //       const { lat, lng } = response.results[0].geometry.location;
  //       setLat(lat);
  //       setLng(lng);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setCurrentPosition({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }, []);
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const center = {
    lat: lat,
    lng: lng,
  };

  const position = {
    lat: lat,
    lng: lng,
  };

  const options = { closeBoxURL: "", enableEventPropagation: true };
  return (
    <>
      <div className="flex-initial flex flex-col lg:w-3/12 w-full border-2 rounded-t-lg">
        <div className="p-2">
          <LabelXomTro label="Vị trí" fontSize={2} rFontSize={3} />

          {/* <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={18}
            >
              <Marker position={position} />
              <InfoBox options={options} position={center}>
                <div className="bg-green-700 opacity-80 p-1 w-fit rounded-r-lg rounded-l-lg rounded-tl-none">
                  <div className="text-xs text-white">Nhà trọ cho thuê</div>
                </div>
              </InfoBox>
            </GoogleMap>
          </LoadScript> */}
          <button
            type="button"
            className="text-gray-900 w-full bg-gray-200 hover:bg-gray-300 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2 my-2"
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&z=12`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GoogleMapIcon} alt="google maps" className="w-8 h-8" />{" "}
            </a>
            <span className="ml-2">Mở với Google Maps</span>
          </button>
        </div>
      </div>
    </>
  );
}
