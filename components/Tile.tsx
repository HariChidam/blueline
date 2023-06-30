import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface TileProps {
  WaitTime: number;
  CoverFee: number;
  Vibe: string;
  ImageUrl: StaticImageData;
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
    <div className="bg-blue-100 rounded-lg shadow-md hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <Image src={ImageUrl} alt="Project Icon" className="w-full rounded-lg" width={200} height={200} />
      </div>
      <h1 className="text-2xl text-center font-bold mb-2">{Name}</h1>
      <div className="flex justify-between p-2">
        <div className="flex flex-col items-center p-2 bg-blue-800 rounded-lg text-neutral-50">
          <h2 className="font-bold">Wait Time</h2>
          <h2>{WaitTime}</h2>
        </div>
        <div className="flex flex-col items-center p-2 bg-blue-800 rounded-lg text-neutral-50">
          <h2 className="font-bold">Cover Fee</h2>
          <h2>{CoverFee}</h2>
        </div>
        <div className="flex flex-col items-center p-2 bg-blue-800 rounded-lg text-neutral-50">
          <h2 className="font-bold">Vibe</h2>
          <h2>{Vibe}</h2>
        </div>
      </div>
      <div className="flex justify-evenly p-2">
        <div className="flex flex-col items-center p-2 bg-blue-800 rounded-lg text-neutral-50">
          <h2 className="font-bold">Bouncer</h2>
          <h2>{Bouncer}</h2>
        </div>
        <div className="flex flex-col items-center p-2 bg-blue-800 rounded-lg text-neutral-50">
          <h2 className="font-bold">Cops</h2>
          <h2>{Cops ? 'Yes' : 'No'}</h2>
        </div>
      </div>
    </div>
  );
}

export default Tile;
