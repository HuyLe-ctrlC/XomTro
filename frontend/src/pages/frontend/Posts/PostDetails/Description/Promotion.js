import React, { useEffect, useState } from "react";
import axios from "axios";
// import Geocode from "react-geocode";
import GoogleMapIcon from "../../../../../img/google-maps.png";
// import {
//   GoogleMap,
//   InfoBox,
//   LoadScript,
//   Marker,
//   Polyline,
// } from "@react-google-maps/api";
import LabelXomTro from "../../../../../components/LabelXomTro";
import { useSelector } from "react-redux";
import { selectPosts } from "../../../../../redux/slices/posts/postsSlices";
// const API_KEY = process.env.API_GOOGLE_MAP_KEY;
// const GEOCODE_API_KEY = process.env.REACT_APP_API_MAP_QUEST;
const MAP_QUEST_API_KEY = process.env.REACT_APP_API_MAP_QUEST_KEY;

// Geocode.setApiKey(GEOCODE_API_KEY);
export default function Promotion() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState("");
  // const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  //select post details from store
  const post = useSelector(selectPosts);
  const { dataUpdate } = post;

  useEffect(() => {
    if (dataUpdate !== undefined) {
      const addressMap =
        dataUpdate?.addressDetail +
        " " +
        dataUpdate?.ward?.prefix +
        " " +
        dataUpdate?.ward?.name +
        " " +
        dataUpdate?.district?.name +
        " " +
        dataUpdate?.city?.name;
      axios
        .get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=${MAP_QUEST_API_KEY}&location=${addressMap}`
        )
        .then((response) => {
          const { lat, lng } = response.data.results[0].locations[0].latLng;
          setLat(lat);
          setLng(lng);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dataUpdate]);

  // useEffect(() => {
  //   Geocode.fromAddress(address).then(
  //     (response) => {
  //       const { lat, lng } = response.results[0].geometry.location;
  //       setLat(lat);
  //       setLng(lng);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );

  // }, [address]);

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

  // const containerStyle = {
  //   width: "100%",
  //   height: "400px",
  // };
  // const center = {
  //   lat: lat,
  //   lng: lng,
  // };

  // const position = {
  //   lat: lat,
  //   lng: lng,
  // };

  // const options = { closeBoxURL: "", enableEventPropagation: true };
  // console.log("lat", lat);
  // console.log("lng", lng);
  return (
    <>
      <div className="flex-initial flex flex-col lg:w-3/12 w-full border-2 rounded-t-lg">
        <div className="p-2">
          <LabelXomTro
            label="Vị trí"
            fontSize="2xl"
            rFontSize="3xl"
            heightOfLine="h-10"
          />

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
