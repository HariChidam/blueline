import React, { FormEvent, useState, useEffect } from 'react';
import Image from "next/legacy/image";
import supabase from '../supabase.js';
import blueline from '../public/blueline.png';
import star from '../public/star.png';

interface TileProps {
  WaitTimeArray: number[];
  CoverFee: number;
  VibeArray: string[];
  ImageUrl: string;
  Name: string;
  Bouncer: string;
  Cops: boolean;
  xcoord: number;
  ycoord: number;
}

const Tile: React.FC<TileProps> = ({
  WaitTimeArray,
  CoverFee,
  VibeArray,
  ImageUrl,
  Name,
  Bouncer,
  Cops,
  xcoord,
  ycoord,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [newWaitTime, setNewWaitTime] = useState(0);
  const [newCoverFee, setNewCoverFee] = useState(0);
  const [newVibe, setNewVibe] = useState('');
  const [mostFrequentVibe, setMostFrequentVibe] = useState('');
  const [newBouncer, setNewBouncer] = useState('');
  const [newCops, setNewCops] = useState(false);
  const [WaitTime, setWaitTime] = useState(0);
  const [userxcoord, setUserxcoord] = useState(0);
  const [userycoord, setUserycoord] = useState(0);
  

  function degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371000; // Earth's radius in meters
  
    const lat1Rad = degToRad(lat1);
    const lon1Rad = degToRad(lon1);
    const lat2Rad = degToRad(lat2);
    const lon2Rad = degToRad(lon2);
  
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadius * c;
  
    return distance;
  }

  const getCurrentPositionAsync = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  
  const updateInfo = async () => {
    try {
      const { coords: { latitude, longitude } } = await getCurrentPositionAsync();
  
      console.log(latitude, longitude);
      setUserxcoord(latitude);
      setUserycoord(longitude);
  
      const isWithinDistance = calculateDistance(
        userxcoord,
        userycoord,
        xcoord,
        ycoord
      ) < 500;
  
      if (isWithinDistance) {
        setUpdateMode(true);
      } else {
        alert("You must be within 200m of the location to update information");
      }
    } catch (error: any) {
      // Handle geolocation error
      console.error("Error getting geolocation:", error);
      alert("Error getting geolocation. Please try again.");
    }
  };

  useEffect(() => {
    const updateCoords = async () => {
      const { coords: { latitude, longitude } } = await getCurrentPositionAsync();
  
      setUserxcoord(latitude);
      setUserycoord(longitude);
    };
    updateCoords();
}, []);

  //Updates bar info when the form is submitted
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateMode(false);
    
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

  //Cancels the update
  const handleCancel = async () => {
    setUpdateMode(false)
  };

  //Finds the average of the wait times
  useEffect(() => {
    if (WaitTimeArray !== undefined) {
      const waitTimeSum = WaitTimeArray.reduce((a, b) => a + b, 0);
      const waitTimeAverage = waitTimeSum / WaitTimeArray.length;
      setWaitTime(waitTimeAverage);
    }
  }, [WaitTimeArray]);

  //Finds the most frequent vibe
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
    <div className="flex flex-row items-center overflow-hidden bg-gradient-to-r bg-gray-200 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 mx-2 py-2">
      <div className="relative h-36 w-48 ml-2">
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
      <div className=''>
        <div className='flex flex-row items-center justify-between'>
          <h1 className="text-2xl text-center font-bold text-blue-900 py-2 mx-2">{Name}</h1>
          <div className='flex mr-1'>
            <div className='relative w-4 h-4 flex flex-row'>
                <Image src={star} alt="star" layout='fill' objectFit="cover" className="rounded-lg w-full" />
            </div>
            <div className='relative w-4 h-4 flex flex-row'>
                <Image src={star} alt="star" layout='fill' objectFit="cover" className="rounded-lg w-full" />
            </div>
            <div className='relative w-4 h-4 flex flex-row'>
                <Image src={star} alt="star" layout='fill' objectFit="cover" className="rounded-lg w-full" />
            </div>
            <div className='relative w-4 h-4 flex flex-row'>
                <Image src={star} alt="star" layout='fill' objectFit="cover" className="rounded-lg w-full" />
            </div>
            <div className='relative w-4 h-4 flex flex-row'>
                <Image src={star} alt="star" layout='fill' objectFit="cover" className="rounded-lg w-full" />
            </div>
        </div>
        </div>
        {!updateMode ? (
          <div className='flex flex-row items-center mb-2'>
            <div className="flex flex-row rounded-lg">
              <div className="flex flex-col justify-evenly mt-4 px-1">
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">Wait:</h3>
                  <h3 className='text-sm'>{WaitTime}</h3>
                </div>
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">Cover:</h3>
                  <h3 className='text-sm'>${CoverFee}</h3>
                </div>
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">Vibe:</h3>
                  <h3 className='text-sm'>{mostFrequentVibe}</h3>
                </div>
              </div>
              <div className="flex flex-col justify-evenly mt-4 px-1 mr-2">
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">Bouncer:</h3>
                  <h3 className='text-sm'>{Bouncer}</h3>
                </div>
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">Cops:</h3>
                  <h3 className='text-sm'>{Cops ? 'Yes' : 'No'}</h3>
                </div>
                <div className="flex flex-row items-center text-gray-500">
                  <h3 className="mr-1 font-bold text-sm">LineLeap:</h3>
                  <h3 className='text-sm'>Yes</h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center mt-10">
              <button
                className="bg-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl text-white font-bold px-2 py-1 mr-1" 
                onClick={updateInfo}
              >
                Rate
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
    </div>
  );
};

export default Tile;

