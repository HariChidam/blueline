import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface TileProps {
  WaitTime: number;
  CoverFee: number;
  Vibe: string;
  ImageUrl: string;
  Name: string;
  Bouncer: string;
  Cops: boolean;
}

const Tile: React.FC<TileProps> = ({
  WaitTime,
  CoverFee,
  Vibe,
  ImageUrl,
  Name,
  Bouncer,
  Cops
}) => {
  return (
    <div className=" flex flex-col sm:w-80 md:w-96 lg:w-96 max-w-xl mx-auto overflow-hidden bg-gradient-to-r from-slate-950 via-blue-800 to-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl">
      <div className="relative h-40">
          <Image
            src={ImageUrl}
            alt="Bar"
            layout="fill"
            objectFit="cover"
            className="rounded-lg w-full"
          />
      </div>
      <h1 className="text-2xl text-center font-bold mb-2 text-neutral-50 py-2 ">{Name}</h1>
      <div className='flex flex-col rounded-lg bg-slate-50 mx-4 mb-4'>
        <div className="flex justify-evenly px-4 mx-4">
          <div className="flex flex-col items-center p-2 text-neutral-900">
            <h2 className="font-bold">Wait Time</h2>
            <h2>{WaitTime}</h2>
          </div>
          <div className="flex flex-col items-center p-2 text-neutral-900">
            <h2 className="font-bold">Cover Fee</h2>
            <h2>${CoverFee}</h2>
          </div>
          <div className="flex flex-col items-center p-2 text-neutral-900">
            <h2 className="font-bold">Vibe</h2>
            <h2>{Vibe}</h2>
          </div>
        </div>
        <div className="flex justify-evenly px-4 mx-4">
          <div className="flex flex-col items-center p-2 text-neutral-900">
            <h2 className="font-bold">Bouncer</h2>
            <h2>{Bouncer}</h2>
          </div>
          <div className="flex flex-col items-center p-2 text-neutral-900">
            <h2 className="font-bold">Cops</h2>
            <h2>{Cops ? 'Yes' : 'No'}</h2>
          </div>
      </div>
      </div>

    </div>
  );
}

export default Tile;
