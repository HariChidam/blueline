import React, { FormEvent, useState, useEffect } from 'react';
import Image from "next/legacy/image";
import supabase from '../supabase.js';
import blueline from '../public/blueline.png';

interface TileProps {
  WaitTimeArray: number[];
  CoverFee: number;
  VibeArray: string[];
  ImageUrl: string;
  Name: string;
  Bouncer: string;
  Cops: boolean;
}

const Tile: React.FC<TileProps> = ({
  WaitTimeArray,
  CoverFee,
  VibeArray,
  ImageUrl,
  Name,
  Bouncer,
  Cops,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [newWaitTime, setNewWaitTime] = useState(0);
  const [newCoverFee, setNewCoverFee] = useState(0);
  const [newVibe, setNewVibe] = useState('');
  const [mostFrequentVibe, setMostFrequentVibe] = useState('');
  const [newBouncer, setNewBouncer] = useState('');
  const [newCops, setNewCops] = useState(false);
  const [WaitTime, setWaitTime] = useState(0);

  const updateInfo = async () => {
    setUpdateMode(true);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateMode(false);
    
    console.log('here')
    const updatedWaitTime = [...WaitTimeArray, newWaitTime];
    const updatedVibe = [...VibeArray, newVibe];
    const { error } = await supabase
    .from('bars')
    .update({WaitTimeArray: updatedWaitTime, CoverFee: newCoverFee, VibeArray: updatedVibe, Bouncer: newBouncer, Cops: newCops})
    .eq('Name', Name);

    if (error) {
      console.error(error);
    }
  };

  const handleCancel = async () => {
    setUpdateMode(false)
  };

  useEffect(() => {
    console.log(WaitTimeArray)
    if (WaitTimeArray !== undefined) {
      const waitTimeSum = WaitTimeArray.reduce((a, b) => a + b, 0);
      const waitTimeAverage = waitTimeSum / WaitTimeArray.length;
      setWaitTime(waitTimeAverage);
    }
  }, [WaitTimeArray]);

  useEffect(() => {
    if (VibeArray !== undefined) {
      // Find the most frequent vibe in the VibeArray
      const vibeCount: Record<string, number> = VibeArray.reduce((acc: Record<string, number>, vibe: string) => {
        acc[vibe] = (acc[vibe] || 0) + 1;
        return acc;
      }, {});
  
      // Get the vibe with the maximum count
      let maxCount = 0;
      let mostFrequent = '';
      for (const vibe in vibeCount) {
        if (vibeCount[vibe] > maxCount) {
          maxCount = vibeCount[vibe];
          mostFrequent = vibe;
        }
      }
  
      // Set the most frequent vibe in the state
      setMostFrequentVibe(mostFrequent);
    }
  }, [VibeArray]);
  
  
  const handleWaitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewWaitTime(parseInt(event.target.value));
  };
  const handleCoverChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCoverFee(parseInt(event.target.value));
  };
  const handleVibeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewVibe(event.target.value);
  };
  const handleBouncerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewBouncer(event.target.value);
  };
  const handleCopsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCops(event.target.value === 'true');
  };

  return (
    <div className="flex flex-col sm:w-80 md:w-96 lg:w-96 max-w-xl mx-auto overflow-hidden bg-gradient-to-r from-slate-950 via-blue-800 to-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl">
      <div className="relative h-40 w-full">
        {ImageUrl ? 
          (
            <Image src={ImageUrl} alt="Bar" layout='fill' objectFit="cover" className="rounded-lg w-full" />
          )
          :
          (
            <Image src={blueline} alt="Bar" layout='fill' objectFit="cover" className="rounded-lg w-full" />
          )
        }
      </div>
      <h1 className="text-2xl text-center font-bold mb-2 text-neutral-50 py-2">{Name}</h1>
      {!updateMode ? (
        <div>
          <div className="flex flex-col rounded-lg bg-slate-50 mx-4 mb-4">
            <div className="flex justify-evenly px-4 mx-4">
              <div className="flex flex-col items-center p-2 text-neutral-900">
                <h2 className="font-bold">Wait Time</h2>
                <h2>{WaitTime} Min</h2>
              </div>
              <div className="flex flex-col items-center p-2 text-neutral-900">
                <h2 className="font-bold">Cover Fee</h2>
                <h2>${CoverFee}</h2>
              </div>
              <div className="flex flex-col items-center p-2 text-neutral-900">
                <h2 className="font-bold">Vibe</h2>
                <h2>{mostFrequentVibe}</h2>
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
          <div className="flex flex-col items-center pb-4">
            <button
              className="bg-slate-50 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl text-neutral-900 font-bold py-2 px-4"
              onClick={updateInfo}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div>
          <form className="flex flex-col rounded-lg bg-slate-50 mx-4 mb-4">
            <div className='flex justify-evenly px-4 mx-4 pb-4'>
              <div className="flex flex-col items-center">
                <label htmlFor="waitTime" className="text-neutral-900 font-bold">
                  Wait Time
                </label>
                <select id="waitTime" name="waitTime" className="bg-slate-200 rounded-lg" onChange={handleWaitChange}>
                  <option value="-1">N/A</option>
                  <option value="0"> No Wait </option>
                  <option value="5">5 Min</option>
                  <option value="10"> 10 Min </option>
                  <option value="15"> 15 Min </option>
                  <option value="20"> 20 Min </option>
                  <option value="30"> 30 Min </option>
                  <option value="45"> 45 Min </option>
                  <option value="60"> 1 Hr </option>
                  <option value="90"> 1.5 Hrs </option>
                  <option value="120"> 2 Hrs </option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="coverFee" className="text-neutral-900 font-bold">
                  Cover Fee
                </label>
                <select id="coverFee" name="coverFee" className="bg-slate-200 rounded-lg" onChange={handleCoverChange}>
                  <option value="-1">N/A</option>
                  <option value="0"> No Cover </option>
                  <option value="5"> $5 </option>
                  <option value="10"> $10 </option>
                  <option value="15"> $15 </option>
                  <option value="20"> $20 </option>
                  <option value="30"> $30 </option>
                  <option value="45"> $45 </option>
                  <option value="60"> $60 </option>
                </select>
              </div>
            </div>
            <div className='flex justify-evenly px-4 mx-4 mb-4'>
              <div className="flex flex-col items-center">
                <label htmlFor="vibe" className="text-neutral-900 font-bold">
                  Vibe
                </label>
                <select id="vibe" name="vibe" className="bg-slate-200 rounded-lg" onChange={handleVibeChange}>
                  <option value="Empty">N/A</option>
                  <option value="Dead">Dead</option>
                  <option value="Mid">Mid</option>
                  <option value="Bumpin">Bumpin</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="bouncer" className="text-neutral-900 font-bold">
                  Bouncer
                </label>
                <select id="bouncer" name="bouncer" className="bg-slate-200 rounded-lg" onChange={handleBouncerChange}>
                  <option value="Empty">N/A</option>
                  <option value="Chill">Chill</option>
                  <option value="Mid">Mid</option>
                  <option value="Strict">Strict</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col items-center mb-4">
              <label htmlFor="cops" className="text-neutral-900 font-bold">
                Cops
              </label>
              <select id="cops" name="cops" className="bg-slate-200 rounded-lg" onChange={handleCopsChange}>
                <option value="Empty">N/A</option>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </form>
          <div className='flex flex-row justify-evenly pb-4'>
          <button 
              className='bg-slate-50 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl text-neutral-900 font-bold py-2 px-4'
              onClick={handleCancel}
              >
              Cancel
            </button>
            <button
              className="bg-slate-50 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl text-neutral-900 font-bold py-2 px-4"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tile;

