import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectRooms,
  updateDataAction,
} from "../../../redux/slices/rooms/roomsSlices";
import Utility from "./Utility";
import TenantMonthlyUtilities from "./TenantMonthlyUtilities";
import { clearSelectionAction, selectAllAction, toggleItemAction } from "../../../redux/slices/selectedSlices";

const myItems = [
  {
    id: "614d1a5226b10f2b481f6d84",
    roomName: "Phòng 1",
    fields: {
      acreage: 50,
      price: 2000000,
    },
  },
  {
    id: "614d1a5226b10f2b481f6d69",
    roomName: "Phòng 2",
    fields: {
      acreage: 50,
      price: 2000000,
    },
  },
];

export default function UtilityManagement() {
  const dispatch = useDispatch();
  const roomData = useSelector(selectRooms);
  const { selected } = roomData;
  const handleSelection = (itemSelected) => {
    dispatch(toggleItemAction({ itemSelected }));
  };

  const handleClearSelection = () => {
    dispatch(clearSelectionAction());
  };

  const handleSend = () => {
    console.log("selected", selected);
    // dispatch(updateDataAction());
  };

  const handleSelectAll = () => {
    dispatch(selectAllAction(myItems));
  };
  return (
    <>
      {/* <button onClick={handleClearSelection}>Clear selection</button>
      <button onClick={handleSelectAll}>Select All</button>
      <ul>
        {myItems.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={selected?.map((item) => item.id).includes(item.id)}
              onChange={() => handleSelection(item)}
            />
            <span>{item.roomName}</span>
          </li>
        ))}
        {selected?.length === 0 && (
          <li>
            <input type="checkbox" checked={false} readOnly />
            <span>No items selected</span>
          </li>
        )}
      </ul>
      <button onClick={handleSend}>SEND</button> */}
      <div className="flex flex-col md:flex-row space-x-2 bg-slate-50 mx-2 rounded-xl p-4 drop-shadow-sm">
        <div className="flex-initial w-full md:w-2/5 ">
          <Utility />
        </div>
        <div className="flex-initial w-full md:w-3/5">
          <TenantMonthlyUtilities />
        </div>
      </div>
    </>
  );
}
