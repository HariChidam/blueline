//next
import Head from 'next/head';
import Image from "next/legacy/image";
//react
import { useEffect, useState } from 'react';
//supabase
import supabase from '../supabase.js';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
//components
import Tile from '../components/Tile';
//other
import cookie from "js-cookie";
import {v4 as uuid} from 'uuid';

interface Bar {
  WaitTimeArray: number[];
  CoverFee: number;
  VibeArray: string[];
  imageUrl: string;
  Name: string;
  Bouncer: string;
  Cops: boolean;
  xcoord: number;
  ycoord: number;
}

export default function Home() {
  const [barsData, setBarsData] = useState<Bar[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [numVisited, setNumVisited] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const getBarsImage = async () => {
    const updatedBarsData = await Promise.all(
      barsData.map(async (bar) => {
        if (bar.imageUrl) {
          return bar; // Return the original object if imageUrl exists
        } else {
          const { data: ImageData, error } = await supabase.storage.from('bars').download(bar.Name)
          if (error) {
            console.error(error);
            return bar;
          } else {
            const blob = new Blob([ImageData]);
            const imageUrl = URL.createObjectURL(blob);
            return {
              ...bar,
              imageUrl,
            };
          }
        }
      })
    );
    setBarsData(updatedBarsData);
  };


  const handleAuthStateChange = (event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_IN' && session?.user) {
      setUser(session.user);
    }
    if (event === 'SIGNED_OUT') {
      setUser(null);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session) {
          setUser(session.data.session?.user || null)
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSession();
    // Listen for changes in the authentication state
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

  }, []);

  useEffect(() => {
    const getBarsInfo = async () => {
      const { data, error } = await supabase.from('bars').select('*');
      if (error) {
        console.error(error);
      } else {
        setBarsData(data || []);
      }
    };

    const setCookies = () => {
      const userId = cookie.get('user') || uuid(); // Get the existing user cookie or generate a new unique identifier
      let visitCount = parseFloat(cookie.get('visitCount') || '0'); // Get the existing visit count or default to 0
      visitCount += 1; // Increment the visit count by 0.5
      cookie.set('user', userId);
      cookie.set('visitCount', visitCount.toString());
      setNumVisited(visitCount);
    };

    setCookies();
    getBarsInfo();
  }, []); 

  useEffect(() => {
    if (barsData.length > 0) {
      getBarsImage();
    }
  }, [barsData]);

  const filteredBars = barsData.filter((Bar) =>
    Bar.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>blueline</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.png" />
      </Head>

      {
        numVisited > 10 ? (
          user && (
            <div className='flex flex-col'>
              <div className="top-0 bg-white z-10">
                <div className="flex flex-row items-center justify-evenly">
                  <div className="flex justify-center items-center mb-4 w-6/12">
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border rounded-md p-2 w-full border-blue-950"
                    />
                  </div>
                  <div>
                    <button className="bg-green-500 text-white p-2 mb-4 rounded-lg shadow-md hover:scale-105">
                      Find Bars Near Me
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                {/* Display tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredBars.map((bar) => (
                    <Tile
                      key={bar.Name} // Add a unique key to each Tile
                      WaitTimeArray={bar.WaitTimeArray}
                      CoverFee={bar.CoverFee}
                      VibeArray={bar.VibeArray}
                      ImageUrl={bar.imageUrl}
                      Name={bar.Name}
                      Bouncer={bar.Bouncer}
                      Cops={bar.Cops}
                      xcoord={bar.xcoord}
                      ycoord={bar.ycoord}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div>
              <div className='flex flex-row items-center justify-evenly'>
                <div className="flex justify-center items-center mb-4 w-6/12">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-md p-2 w-full border-blue-950"
                  />
                </div>
                <div>
                  <button className='bg-green-500 text-white p-2 mb-4 rounded-lg shadow-md hover:scale-105'>Find Bars Near Me</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBars.map((bar) => (
                  <Tile
                    key={bar.Name} // Add a unique key to each Tile
                    WaitTimeArray={bar.WaitTimeArray}
                    CoverFee={bar.CoverFee}
                    VibeArray={bar.VibeArray}
                    ImageUrl={bar.imageUrl}
                    Name={bar.Name}
                    Bouncer={bar.Bouncer}
                    Cops={bar.Cops}
                    xcoord={bar.xcoord}
                    ycoord={bar.ycoord}
                  />
                ))}
              </div>
            </div>
        )
      }

    </div>
  );
};