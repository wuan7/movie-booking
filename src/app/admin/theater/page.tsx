"use client";

import { AddSeat } from "./components/add-seat";
import { CreateRoom } from "./components/create-room";
import { CreateRow } from "./components/create-row";

const TheaterPage = () => {
  return (
    <div className="w-full">
      <div>
        <CreateRoom />
      </div>
      <div>
        <CreateRow />
      </div>
      <div>
        <AddSeat />
      </div>
    </div>
  );
};

export default TheaterPage;
